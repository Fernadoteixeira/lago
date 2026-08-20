import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const publicDirectory = fileURLToPath(
  new URL("../dist/public/", import.meta.url)
);
const indexPath = join(publicDirectory, "index.html");
const assetsDirectory = join(publicDirectory, "assets");
const indexHtml = await readFile(indexPath, "utf8");

if (!indexHtml.includes("Lago 360")) {
  throw new Error("The production index does not contain the Lago 360 marker.");
}

if (!indexHtml.includes('lang="pt-BR"')) {
  throw new Error("The production index is missing the pt-BR language marker.");
}

if (indexHtml.includes("%VITE_")) {
  throw new Error(
    "The production index contains an unresolved VITE placeholder."
  );
}

const assetNames = await readdir(assetsDirectory);
const assetSizes = await Promise.all(
  assetNames.map(async assetName => ({
    assetName,
    bytes: (await stat(join(assetsDirectory, assetName))).size,
    gzipBytes: gzipSync(await readFile(join(assetsDirectory, assetName))).length,
  }))
);

const javascriptBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".js"))
  .reduce((total, { bytes }) => total + bytes, 0);
const stylesheetBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".css"))
  .reduce((total, { bytes }) => total + bytes, 0);

const javascriptGzipBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".js"))
  .reduce((total, { gzipBytes }) => total + gzipBytes, 0);
const stylesheetGzipBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".css"))
  .reduce((total, { gzipBytes }) => total + gzipBytes, 0);

const budgets = {
  javascriptGzip: 260_000,
  stylesheetGzip: 30_000,
};

if (javascriptGzipBytes > budgets.javascriptGzip) {
  throw new Error(
    `JavaScript gzip budget exceeded: ${javascriptGzipBytes} bytes > ${budgets.javascriptGzip} bytes.`
  );
}

if (stylesheetGzipBytes > budgets.stylesheetGzip) {
  throw new Error(
    `Stylesheet gzip budget exceeded: ${stylesheetGzipBytes} bytes > ${budgets.stylesheetGzip} bytes.`
  );
}

console.log(
  `Build smoke test passed: ${javascriptBytes} bytes JavaScript (${javascriptGzipBytes} gzip), ${stylesheetBytes} bytes CSS (${stylesheetGzipBytes} gzip).`
);
