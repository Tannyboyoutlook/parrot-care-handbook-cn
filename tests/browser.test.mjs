import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "node:http";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

let browser, server, origin, scratch;
before(async () => {
  const html = await readFile(new URL("../docs/index.html", import.meta.url));
  server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  scratch = await mkdtemp(join(tmpdir(), "parrot-regression-"));
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {}),
  });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  if (scratch) await rm(scratch, { recursive: true, force: true });
});
async function withPage(run, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    timezoneId: "Asia/Shanghai",
    ...options,
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await run(page, context);
    assert.deepEqual(errors, [], "no uncaught page errors");
  } finally {
    await context.close();
  }
}
const pageCount = (buffer) =>
  (buffer.toString("latin1").match(/\/Type \/Page\b/g) || []).length;

test("search covers glossary terms, diagrams, ordinary text, and urgent routes", () =>
  withPage(async (page) => {
    await page.locator('.topbar [data-open="search"]').click();
    for (const query of [
      "PTFE",
      "前倾张嘴",
      "遮示玻璃",
      "苹果果肉",
      "落粪路径",
      "虎皮 换粮",
    ]) {
      await page.locator("#searchInput").fill(query);
      assert.ok((await page.locator("#searchResults li").count()) > 0, query);
    }
    await page.locator("#searchInput").fill("喘");
    assert.equal(await page.locator("#searchEmergency").isVisible(), true);
    assert.match(
      await page.locator(".result-location").first().textContent(),
      /急症/,
    );
    await page.locator("#searchInput").fill("苹果果肉");
    await page.locator(".result-link").first().click();
    assert.equal(await page.locator("#searchModal").isVisible(), false);
    assert.equal(
      await page
        .locator(".search-hit")
        .evaluate((e) => e.closest("details").open),
      true,
    );
  }));

test("printing from either modal retains every page and restores UI state", () =>
  withPage(async (page) => {
    const normal = pageCount(await page.pdf({ format: "A4" }));
    assert.ok(normal > 10);
    for (const modal of ["search", "toc"]) {
      await page.locator('.bottom-nav a[href="#checklists"]').click();
      await page.locator(`.bottom-nav [data-open="${modal}"]`).click();
      const before = await page.evaluate(() => ({
        position: document.body.style.position,
        top: document.body.style.top,
        open: document.querySelectorAll(".chapter details[open]").length,
      }));
      const printed = pageCount(await page.pdf({ format: "A4" }));
      assert.equal(printed, normal, modal + " print page count");
      assert.equal(await page.locator(`#${modal}Modal`).isVisible(), true);
      assert.deepEqual(
        await page.evaluate(() => ({
          position: document.body.style.position,
          top: document.body.style.top,
          open: document.querySelectorAll(".chapter details[open]").length,
        })),
        before,
      );
      await page.keyboard.press("Escape");
    }
  }));

test("download resets UI and remains readable and searchable while offline", () =>
  withPage(async (page, context) => {
    await page.locator("#expandAll").click();
    await page.locator('[data-check="daily-water"]').check();
    const promise = page.waitForEvent("download");
    await page.locator("#downloadGuide").click();
    const path = join(scratch, "offline.html");
    await (await promise).saveAs(path);
    await context.setOffline(true);
    await page.goto(pathToFileURL(path).href);
    assert.equal(
      await page.locator("#expandAll").textContent(),
      "展开全部详细内容",
    );
    assert.equal(await page.locator(".chapter details[open]").count(), 0);
    assert.equal(
      await page.locator('[data-check="daily-water"]').isChecked(),
      false,
    );
    await page.locator("#expandAll").click();
    assert.equal(
      await page.locator(".chapter details[open]").count(),
      await page.locator(".chapter details").count(),
    );
    assert.equal(
      await page.locator("#expandAll").textContent(),
      "收起全部详细内容",
    );
    // Images outside the current viewport are intentionally lazy-loaded.
    // Decode the embedded bytes while offline before asserting they are usable.
    await page.locator("img").evaluateAll(async (imgs) => {
      imgs.forEach((img) => (img.loading = "eager"));
      await Promise.all(imgs.map((img) => img.decode()));
    });
    assert.equal(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every((i) => i.complete && i.naturalWidth > 0),
        ),
      true,
    );
    await page.locator('.topbar [data-open="search"]').click();
    await page.locator("#searchInput").fill("PTFE");
    assert.ok((await page.locator(".result-link").count()) > 0);
    assert.deepEqual(
      await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((r) => r.name)
          .filter((u) => /^https?:/.test(u)),
      ),
      [],
    );
  }));

test("mobile without JavaScript has a native complete table of contents and PDF link", () =>
  withPage(
    async (page) => {
      assert.equal(await page.locator("#inlineToc").isVisible(), true);
      assert.equal(await page.locator("button:visible").count(), 0);
      await page.locator('.bottom-nav [data-open="toc"]').click();
      await page.locator("#inlineToc summary").click();
      assert.equal(await page.locator("#inlineToc nav a:visible").count(), 16);
      await page.locator('#inlineToc a[href="#food"]').click();
      assert.equal(new URL(page.url()).hash, "#food");
      assert.ok(
        (await page
          .locator('a[href$="parrot-care-handbook.pdf"]:visible')
          .count()) > 0,
      );
    },
    { javaScriptEnabled: false },
  ));

test("stored checks survive reload and reset by day/week, not the preparation group", () =>
  withPage(async (page) => {
    await page.clock.install({ time: new Date("2031-03-30T23:58:00+08:00") });
    await page.reload();
    for (const id of ["daily-water", "weekly-clean", "prep-vet"])
      await page.locator(`[data-check="${id}"]`).check();
    await page.reload();
    assert.equal(
      await page.locator('[data-check="daily-water"]').isChecked(),
      true,
    );
    await page.clock.setSystemTime(new Date("2031-03-31T00:01:00+08:00"));
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    assert.equal(
      await page.locator('[data-check="daily-water"]').isChecked(),
      false,
    );
    assert.equal(
      await page.locator('[data-check="weekly-clean"]').isChecked(),
      false,
    );
    assert.equal(
      await page.locator('[data-check="prep-vet"]').isChecked(),
      true,
    );
  }));

test("storage failure does not prevent search or temporary checklists", () =>
  withPage(async (page) => {
    await page.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("storage disabled");
        },
      }),
    );
    await page.reload();
    assert.equal(await page.locator("#storageNotice").isVisible(), true);
    await page.locator('[data-check="daily-water"]').check();
    assert.match(
      await page.locator('[data-meter="daily"]').textContent(),
      /^1 \/ /,
    );
    await page.locator('.topbar [data-open="search"]').click();
    await page.locator("#searchInput").fill("PTFE");
    assert.ok((await page.locator(".result-link").count()) > 0);
  }));

test("expanded content fits mobile and desktop at 100% and 200% text size", () =>
  withPage(async (page) => {
    await page.locator("#expandAll").click();
    for (const font of [100, 200])
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(
          (font) => (document.documentElement.style.fontSize = font + "%"),
          font,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${width}px / ${font}%`,
        );
      }
  }));
