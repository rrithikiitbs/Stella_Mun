import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputRoot = path.resolve("public/images/artwork");
const outputRoot = path.resolve("public/images/optimized");
const widths = [480, 768, 1024];
const originals = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.toLowerCase().endsWith(".png")) originals.push(full);
  }
}

await walk(inputRoot);
const report = { sourceCount: originals.length, sourceBytes: 0, outputBytes: 0, desktopBytes: { avif: 0, webp: 0 }, formats: { avif: 0, webp: 0 }, files: [] };
for (const source of originals) {
  const relative = path.relative(inputRoot, source);
  const relativeDir = path.dirname(relative);
  const stem = path.basename(relative, path.extname(relative));
  const metadata = await sharp(source).metadata();
  const sourceBytes = (await fs.stat(source)).size;
  report.sourceBytes += sourceBytes;
  const outputDir = path.join(outputRoot, relativeDir);
  await fs.mkdir(outputDir, { recursive: true });
  const outputs = [];
  for (const width of widths.filter(candidate => candidate <= (metadata.width ?? 0))) {
    for (const format of ["avif", "webp"]) {
      const output = path.join(outputDir, `${stem}-${width}.${format}`);
      const pipeline = sharp(source).resize({ width, withoutEnlargement: true, fit: "inside" });
      if (format === "avif") await pipeline.avif({ quality: 58, effort: 5, chromaSubsampling: "4:2:0" }).toFile(output);
      else await pipeline.webp({ quality: 84, effort: 5, smartSubsample: true }).toFile(output);
      const bytes = (await fs.stat(output)).size;
      report.outputBytes += bytes;
      if (width === 1024) report.desktopBytes[format] += bytes;
      report.formats[format] += 1;
      outputs.push({ file: path.relative(outputRoot, output).replaceAll("\\", "/"), width, bytes });
    }
  }
  report.files.push({ source: path.relative(inputRoot, source).replaceAll("\\", "/"), sourceBytes, width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha ?? false, outputs });
}
report.outputCount = report.formats.avif + report.formats.webp;
report.desktopAvifReductionPercent = Number(((1 - report.desktopBytes.avif / report.sourceBytes) * 100).toFixed(1));
report.desktopWebpReductionPercent = Number(((1 - report.desktopBytes.webp / report.sourceBytes) * 100).toFixed(1));
await fs.writeFile(path.join(outputRoot, "optimization-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ sourceCount: report.sourceCount, outputCount: report.outputCount, sourceBytes: report.sourceBytes, outputBytesAllVariants: report.outputBytes, desktopAvifBytes: report.desktopBytes.avif, desktopWebpBytes: report.desktopBytes.webp, desktopAvifReductionPercent: report.desktopAvifReductionPercent, desktopWebpReductionPercent: report.desktopWebpReductionPercent, formats: report.formats }, null, 2));
