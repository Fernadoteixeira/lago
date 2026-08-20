/**
 * Lago API 1.51.0 — evento em lote com diagnóstico e retry seletivo.
 * Execute: LAGO_API_KEY=... LAGO_SUBSCRIPTION_ID=... LAGO_METRIC_CODE=... node batch-events.mjs
 */
const apiUrl = process.env.LAGO_API_URL ?? "https://api.getlago.com/api/v1";
const apiKey = process.env.LAGO_API_KEY;
const subscriptionId = process.env.LAGO_SUBSCRIPTION_ID;
const metricCode = process.env.LAGO_METRIC_CODE;

for (const [name, value] of Object.entries({ LAGO_API_KEY: apiKey, LAGO_SUBSCRIPTION_ID: subscriptionId, LAGO_METRIC_CODE: metricCode })) {
  if (!value) throw new Error(`Defina ${name} antes de executar o exemplo.`);
}

const runId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const events = [25, 50].map((requests, index) => ({
  transaction_id: `docs-batch-${runId}-${index + 1}`,
  external_subscription_id: subscriptionId,
  code: metricCode,
  timestamp: `${Date.now() / 1000}`,
  properties: { requests },
}));

function failuresByTransactionId(errors = {}) {
  return Object.entries(errors).flatMap(([reason, transactionIds]) =>
    Array.isArray(transactionIds) ? transactionIds.map((transactionId) => ({ transactionId, reason })) : [],
  );
}

async function sendBatch(batch) {
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/events/batch`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ events: batch }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Lago respondeu ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const result = await sendBatch(events);
const failures = failuresByTransactionId(result.errors);
const failedIds = new Set(failures.map(({ transactionId }) => transactionId));
const accepted = events.filter((event) => !failedIds.has(event.transaction_id));

console.log(JSON.stringify({ accepted: accepted.map(({ transaction_id }) => transaction_id), failures }, null, 2));
if (failures.length) {
  console.log("Corrija apenas estes eventos antes de reenviar:", failures.map(({ transactionId }) => transactionId).join(", "));
}
