import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = new URL(process.env.UI_BASE_URL || "http://127.0.0.1:4174/");
const executablePath = process.env.CHROMIUM_PATH || "/usr/bin/chromium";
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.message));

function route(path = "") {
  return new URL(path.replace(/^\//, ""), baseUrl).toString();
}

async function visible(locator, description) {
  await locator.waitFor({ state: "visible", timeout: 8000 });
  assert.equal(
    await locator.isVisible(),
    true,
    `${description} deve estar visível`
  );
}

async function selected(locator, description) {
  assert.equal(
    await locator.getAttribute("aria-selected"),
    "true",
    `${description} deve estar selecionado`
  );
}

const result = {
  baseUrl: baseUrl.toString(),
  checks: [],
};

try {
  await page.goto(route(), { waitUntil: "networkidle" });
  await visible(
    page.getByRole("heading", { name: /Documentação para o seu billing baseado em uso/ }),
    "hero do simulador"
  );
  result.checks.push("home-rendered");

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: baseUrl.origin,
  });
  const copyPayloadButton = page.getByRole("button", {
    name: "Copiar exemplo de payload",
  });
  await copyPayloadButton.click();
  const copiedPayload = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  assert.match(copiedPayload, /\"events\"/);
  result.checks.push("payload-copy");

  const responseTab = page.getByRole("tab", { name: "Resposta", exact: true });
  await responseTab.click();
  await selected(responseTab, "aba Resposta");
  await visible(
    page.getByText("200 confirma recepção, não faturamento imediato."),
    "conteúdo da resposta"
  );
  result.checks.push("batch-tabs");

  const slider = page.getByRole("slider", { name: "Uso agregado no período" });
  await slider.press("End");
  await assert.doesNotReject(async () => slider.waitFor({ state: "visible" }));
  assert.equal(await page.locator("#units").inputValue(), "900");
  const volumeTab = page.getByRole("tab", { name: /Por volume/ });
  await volumeTab.click();
  await selected(volumeTab, "aba Por volume");
  await visible(page.getByText("Resultado didático"), "resultado do simulador");
  result.checks.push("pricing-simulator");

  const todosFilter = page.getByRole("button", { name: "Todos", exact: true });
  await todosFilter.click();
  const eventosFilter = page.getByRole("button", {
    name: "Eventos",
    exact: true,
  });
  await eventosFilter.click();
  assert.equal(await eventosFilter.getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator(".endpoint-row").count(), 3);
  const operationSearch = page.getByRole("textbox", {
    name: "Buscar operação da API",
  });
  await operationSearch.fill("/events/batch");
  assert.equal(await page.locator(".endpoint-row").count(), 1);
  await visible(page.locator(".endpoint-row code"), "operação /events/batch");
  assert.equal(
    await page.locator(".endpoint-row code").textContent(),
    "/events/batch"
  );
  await todosFilter.click();
  await operationSearch.fill("fatura");
  assert.ok(
    (await page.locator(".endpoint-row").count()) > 0,
    "a busca por fatura deve encontrar operações"
  );
  await operationSearch.fill("rota-que-nao-existe-no-contrato");
  await visible(
    page.getByText(/Nenhuma operação corresponde ao filtro/),
    "estado vazio do explorador"
  );
  result.checks.push("openapi-filters");

  await page.goto(route("coverage"), { waitUntil: "networkidle" });
  await visible(
    page.getByRole("heading", { name: /Visibilidade sobre cada domínio de billing/ }),
    "matriz de cobertura"
  );
  const implementationTab = page.getByRole("tab", {
    name: "Em implementação",
    exact: true,
  });
  await implementationTab.click();
  await selected(implementationTab, "filtro Em implementação");
  const coverageSearch = page.getByRole("textbox", {
    name: "Buscar domínio ou contrato",
  });
  await coverageSearch.fill("Eventos");
  const eventosDomain = page.getByRole("article").filter({ hasText: "Eventos de uso" });
  await visible(eventosDomain, "domínio Eventos");
  assert.equal(await page.locator("article").count(), 1);
  await page
    .getByRole("link", { name: /Abrir guia de Eventos de uso/ })
    .click();
  await page.waitForURL(/\/docs\/eventos/);
  await visible(
    page.getByRole("heading", { name: /Eventos de uso/ }),
    "guia de Eventos de uso"
  );
  await visible(
    page.getByText("Gate de prontidão do domínio"),
    "gate do guia de domínio"
  );
  result.checks.push("coverage-to-domain-guide");

  await page.goto(route("docs/rota-inexistente"), { waitUntil: "networkidle" });
  await visible(
    page.getByRole("heading", { name: "Domínio não encontrado." }),
    "fallback de domínio inexistente"
  );
  result.checks.push("unknown-domain-fallback");

  assert.deepEqual(
    pageErrors,
    [],
    `a UI não deve emitir page errors: ${pageErrors.join(" | ")}`
  );
  console.log(JSON.stringify({ ...result, status: "passed" }, null, 2));
} finally {
  await browser.close();
}
