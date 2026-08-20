/**
 * Lago API 1.51.0 — cliente → métrica → plano → assinatura → evento.
 * Execute somente com LAGO_ALLOW_WRITE=true em um ambiente autorizado.
 */
const apiUrl = (process.env.LAGO_API_URL ?? "https://api.getlago.com/api/v1").replace(/\/$/, "");
const apiKey = process.env.LAGO_API_KEY;
const customerId = process.env.LAGO_CUSTOMER_ID ?? "docs-acme-001";
const metricCode = process.env.LAGO_METRIC_CODE ?? "docs_api_calls";
const planCode = process.env.LAGO_PLAN_CODE ?? "docs_pro_monthly";
const subscriptionId = process.env.LAGO_SUBSCRIPTION_ID ?? "docs-sub-acme-pro-001";
const transactionId = process.env.LAGO_EVENT_TRANSACTION_ID ?? "docs-event-acme-pro-001";

if (!apiKey) throw new Error("Defina LAGO_API_KEY antes de executar o fluxo comercial.");
if (process.env.LAGO_ALLOW_WRITE !== "true") throw new Error("Execução bloqueada: defina LAGO_ALLOW_WRITE=true após revisar os identificadores e o ambiente.");

async function request(method, path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Lago respondeu ${response.status} em ${method} ${path}`);
    error.status = response.status;
    error.body = json;
    throw error;
  }
  return json;
}

async function createOrFetch({ label, createPath, readPath, payload, unwrap }) {
  try {
    const created = await request("POST", createPath, payload);
    return { value: unwrap(created), disposition: "created" };
  } catch (error) {
    if (error.status !== 409) throw error;
    const existing = await request("GET", readPath);
    return { value: unwrap(existing), disposition: "reused" };
  }
}

const customer = await createOrFetch({
  label: "customer", createPath: "/customers", readPath: `/customers/${encodeURIComponent(customerId)}`,
  payload: { customer: { external_id: customerId, name: "Acme Docs" } }, unwrap: (body) => body.customer,
});
const metric = await createOrFetch({
  label: "billable_metric", createPath: "/billable_metrics", readPath: `/billable_metrics/${encodeURIComponent(metricCode)}`,
  payload: { billable_metric: { name: "Chamadas de API", code: metricCode, aggregation_type: "count_agg" } }, unwrap: (body) => body.billable_metric,
});
if (!metric.value?.id) throw new Error("A resposta da métrica não incluiu id; interrompendo antes de criar o plano.");

const plan = await createOrFetch({
  label: "plan", createPath: "/plans", readPath: `/plans/${encodeURIComponent(planCode)}`,
  payload: { plan: { name: "Docs Pro", code: planCode, interval: "monthly", amount_cents: 0, amount_currency: "USD", pay_in_advance: false, charges: [{ billable_metric_id: metric.value.id, charge_model: "graduated" }] } },
  unwrap: (body) => body.plan,
});
const subscription = await createOrFetch({
  label: "subscription", createPath: "/subscriptions", readPath: `/subscriptions/${encodeURIComponent(subscriptionId)}`,
  payload: { subscription: { external_customer_id: customerId, plan_code: planCode, external_id: subscriptionId, billing_time: "calendar" } },
  unwrap: (body) => body.subscription,
});

const event = await request("POST", "/events", { transaction_id: transactionId, external_subscription_id: subscriptionId, code: metricCode, properties: { requests: 250 } });
console.log(JSON.stringify({ customer: customer.disposition, metric: metric.disposition, plan: plan.disposition, subscription: subscription.disposition, event: event.event?.transaction_id ?? transactionId }, null, 2));

