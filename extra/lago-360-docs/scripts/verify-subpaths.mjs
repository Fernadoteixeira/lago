import assert from "node:assert/strict";

const baseUrl = new URL(
  process.env.SUBPATH_BASE_URL ||
    process.env.UI_BASE_URL ||
    "http://127.0.0.1:4174/"
);
const expectedRoutes = [
  "",
  "coverage",
  "docs/eventos",
  "docs/metricas",
  "docs/planos",
  "docs/assinaturas",
  "docs/faturas",
  "docs/pagamentos",
  "docs/creditos",
  "docs/webhooks",
  "docs/analytics",
  "rota-inexistente",
];
const checks = [];

for (const route of expectedRoutes) {
  const url = new URL(route, baseUrl);
  const response = await fetch(url);
  const body = await response.text();
  assert.equal(
    response.status,
    200,
    `${route || "/"} deve responder 200, recebeu ${response.status}`
  );
  assert.match(
    response.headers.get("content-type") || "",
    /text\/html/,
    `${route || "/"} deve responder HTML`
  );
  assert.match(
    body,
    /<div id="root"><\/div>/,
    `${route || "/"} deve carregar o root da SPA`
  );
  checks.push({
    route: `/${route}`,
    status: response.status,
    bytes: Buffer.byteLength(body),
  });
}

const home = await fetch(baseUrl);
const html = await home.text();
const assetSources = [
  ...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g),
].map(([, source]) => source);
assert.ok(assetSources.length > 0, "o HTML publicado deve declarar assets");
for (const source of assetSources.filter(value => value.startsWith("/"))) {
  const assetResponse = await fetch(new URL(source, baseUrl.origin));
  assert.ok(
    assetResponse.ok,
    `asset ${source} deve ser resolvível sob o base path`
  );
}

console.log(
  JSON.stringify(
    {
      status: "passed",
      baseUrl: baseUrl.toString(),
      routes: checks,
      assetsChecked: assetSources.length,
    },
    null,
    2
  )
);
