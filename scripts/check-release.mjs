import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { version } from "../handbook/content.mjs";
const root = new URL("../", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("docs/release.json", root), "utf8"),
);
assert.equal(
  manifest.version,
  version,
  "PDF release version must match content",
);
for (const [path, key] of [
  ["docs/index.html", "htmlSha256"],
  ["docs/parrot-care-handbook.pdf", "pdfSha256"],
]) {
  const hash = createHash("sha256")
    .update(await readFile(new URL(path, root)))
    .digest("hex");
  assert.equal(
    hash,
    manifest[key],
    `${path}: regenerate the release with npm run guide:release`,
  );
}
assert.deepEqual(
  await readFile(new URL("docs/parrot-care-handbook.pdf", root)),
  await readFile(new URL("public/parrot-care-handbook.pdf", root)),
);
console.log("HTML, PDF and version manifest agree.");
