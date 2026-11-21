import fs from "fs";
import path from "path";
import sharp from "sharp";

sharp.cache(false);

const CATEGORIES_DIR = path.resolve("src/assets/categories");

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (/\.(webp|jpe?g|png)$/i.test(entry.name)) {
      try {
        const inputBuffer = fs.readFileSync(fullPath);
        const beforeSize = inputBuffer.length;

        const outputBuffer = await sharp(inputBuffer)
          .rotate()
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 90, effort: 5 })
          .toBuffer();

        const outPath = fullPath.replace(/\.(jpe?g|png)$/i, ".webp");
        fs.writeFileSync(outPath, outputBuffer);
        if (outPath !== fullPath) fs.unlinkSync(fullPath);

        console.log(
          `OK ${path.relative(CATEGORIES_DIR, outPath)}: ${(beforeSize / 1024).toFixed(0)}KB -> ${(outputBuffer.length / 1024).toFixed(0)}KB`
        );
      } catch (err) {
        console.error(`SKIP ${path.relative(CATEGORIES_DIR, fullPath)}:`, err.message);
      }
    }
  }
}

walk(CATEGORIES_DIR).then(() => console.log("Έτοιμες οι κατηγορίες με υψηλή ποιότητα!"));