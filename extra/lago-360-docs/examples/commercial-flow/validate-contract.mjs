/**
 * Lago API 1.51.0 — validação local do recorte comercial canônico.
 * Fonte: references/COMMERCIAL_CONTRACT_1_51.md e bundle OpenAPI preservado.
 */
import { z } from "zod";

const aggregationType = z.enum(["count_agg", "sum_agg", "max_agg", "unique_count_agg", "weighted_sum_agg", "latest_agg"]);
const chargeModel = z.enum(["dynamic", "graduated", "graduated_percentage", "package", "percentage", "standard", "volume"]);

const metric = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  aggregation_type: aggregationType,
  field_name: z.string().min(1).optional(),
}).superRefine((value, context) => {
  if (value.aggregation_type !== "count_agg" && !value.field_name) {
    context.addIssue({ code: "custom", message: "field_name é necessário quando a agregação não é count_agg." });
  }
});

const customerCreate = z.object({ customer: z.object({ external_id: z.string().min(1) }) });
const metricCreate = z.object({ billable_metric: metric });
const planCreate = z.object({
  plan: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    interval: z.enum(["weekly", "monthly", "quarterly", "semiannual", "yearly"]),
    amount_cents: z.number().int().nonnegative(),
    amount_currency: z.string().length(3),
    pay_in_advance: z.boolean(),
    charges: z.array(z.object({
      billable_metric_id: z.string().uuid(),
      charge_model: chargeModel,
    })).min(1),
  }),
});
const subscriptionCreate = z.object({
  subscription: z.object({
    external_customer_id: z.string().min(1),
    plan_code: z.string().min(1),
    external_id: z.string().min(1),
    billing_time: z.enum(["calendar", "anniversary"]).optional(),
  }),
});
const eventCreate = z.object({
  transaction_id: z.string().min(1),
  external_subscription_id: z.string().min(1),
  code: z.string().min(1),
  properties: z.object({ requests: z.number().int().nonnegative() }),
});

const fixture = {
  customer: { external_id: "docs-acme-001" },
  metric: { name: "Chamadas de API", code: "docs_api_calls", aggregation_type: "count_agg" },
  plan: {
    name: "Docs Pro", code: "docs_pro_monthly", interval: "monthly", amount_cents: 0, amount_currency: "USD", pay_in_advance: false,
    charges: [{ billable_metric_id: "11111111-1111-4111-8111-111111111111", charge_model: "graduated" }],
  },
  subscription: { external_customer_id: "docs-acme-001", plan_code: "docs_pro_monthly", external_id: "docs-sub-acme-pro-001", billing_time: "calendar" },
  event: { transaction_id: "docs-event-acme-pro-001", external_subscription_id: "docs-sub-acme-pro-001", code: "docs_api_calls", properties: { requests: 250 } },
};

const validations = [
  ["customer", customerCreate, { customer: fixture.customer }],
  ["billable_metric", metricCreate, { billable_metric: fixture.metric }],
  ["plan", planCreate, { plan: fixture.plan }],
  ["subscription", subscriptionCreate, { subscription: fixture.subscription }],
  ["event", eventCreate, fixture.event],
];

for (const [name, schema, payload] of validations) schema.parse(payload);
if (metric.safeParse({ name: "Incompleta", code: "missing-field", aggregation_type: "sum_agg" }).success) {
  throw new Error("A validação deveria rejeitar agregação baseada em valor sem field_name.");
}

console.log(JSON.stringify({ validated: validations.map(([name]) => name), source: "OpenAPI 1.51.0 comercial" }, null, 2));

