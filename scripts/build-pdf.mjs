import { chromium } from "playwright";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { version } from "../handbook/content.mjs";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("docs/index.html", root));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 900 },
    timezoneId: "Asia/Shanghai",
  });
  await page.goto(new URL("docs/index.html", root).href);
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("js-ready"),
  );
  // Avoid PingFang's radical-codepoint mappings in searchable PDF text on macOS.
  // Linux builds use the CJK font installed by the verification workflow.
  await page.addStyleTag({
    content: '@media print { body, button, input, textarea, select, svg text { font-family: "Arial Unicode MS", "Noto Sans CJK SC", sans-serif !important; } }',
  });
  await page.evaluate(async () => {
    document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
    await Promise.all(Array.from(document.images).map((img) => img.decode()));
    await document.fonts.ready;
    document.querySelectorAll("[data-date]").forEach((el) => {
      el.textContent =
        el.dataset.date === "daily"
          ? "填写日期：________"
          : el.dataset.date === "weekly"
            ? "本周起始日：________"
            : "定期确认仍然可用";
    });
    document
      .querySelectorAll("[data-meter]")
      .forEach((el) => (el.hidden = true));
  });
  const path = new URL("docs/parrot-care-handbook.pdf", root);
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    tagged: true,
    outline: true,
    displayHeaderFooter: true,
    margin: { top: "14mm", bottom: "18mm", left: "13mm", right: "13mm" },
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:9px;text-align:center;color:#52685e">${version} · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
  await writeFile(path, pdf);
  await mkdir(new URL("output/pdf/", root), { recursive: true });
  await copyFile(path, new URL("output/pdf/鹦鹉饲养指南.pdf", root));
  await copyFile(path, new URL("public/parrot-care-handbook.pdf", root));
  await writeFile(
    new URL("docs/release.json", root),
    JSON.stringify(
      {
        version,
        htmlSha256: createHash("sha256").update(html).digest("hex"),
        pdfSha256: createHash("sha256").update(pdf).digest("hex"),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`PDF ${pdf.length} bytes; version ${version}`);
} finally {
  await browser.close();
}
