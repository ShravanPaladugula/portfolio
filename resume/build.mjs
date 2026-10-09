/**
 * Regenerates public/resume.pdf from resume/resume.html.
 *
 *   node resume/build.mjs
 *
 * Requires Chrome installed locally and playwright-core available:
 *   npm install --no-save playwright-core
 *
 * Note: resume.html sets `@page { margin: 0 }` on purpose — the page margins
 * are supplied below. Setting both makes Chrome stack them and spill to a
 * second page.
 */
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(join(here, "resume.html")).href;
const out = join(here, "..", "public", "resume.pdf");

const pageCount = (buf) => {
  const m = /\/Type\s*\/Pages[\s\S]{0,160}?\/Count\s+(\d+)/.exec(
    buf.toString("latin1"),
  );
  return m ? Number(m[1]) : -1;
};

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

await page.goto(source, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const pdf = await page.pdf({
  format: "Letter",
  printBackground: true,
  margin: { top: "0.5in", bottom: "0.5in", left: "0.55in", right: "0.55in" },
});

const pages = pageCount(pdf);
if (pages !== 1) {
  console.error(
    `✗ Résumé rendered to ${pages} pages. Trim content or tighten ` +
      `section/item spacing in resume.html, then re-run.`,
  );
  await browser.close();
  process.exit(1);
}

writeFileSync(out, pdf);
console.log(`✓ ${out} — 1 page, ${(pdf.length / 1024).toFixed(0)} KB`);
await browser.close();
