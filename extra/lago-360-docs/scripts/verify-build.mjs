import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
  }))
);

const javascriptBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".js"))
  .reduce((total, { bytes }) => total + bytes, 0);
const stylesheetBytes = assetSizes
  .filter(({ assetName }) => assetName.endsWith(".css"))
  .reduce((total, { bytes }) => total + bytes, 0);

const budgets = {
  javascript: 450_000,
  stylesheet: 180_000,
};

if (javascriptBytes > budgets.javascript) {
  throw new Error(
    `JavaScript budget exceeded: ${javascriptBytes} bytes > ${budgets.javascript} bytes.`
  );
}

if (stylesheetBytes > budgets.stylesheet) {
  throw new Error(
    `Stylesheet budget exceeded: ${stylesheetBytes} bytes > ${budgets.stylesheet} bytes.`
  );
}

console.log(
  `Build smoke test passed: ${javascriptBytes} bytes JavaScript, ${stylesheetBytes} bytes CSS.`
);
