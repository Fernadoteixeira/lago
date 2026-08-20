import assert from "node:assert/strict";
import {
  batchRequest,
  failuresByTransactionId,
  selectBatchOutcome,
  validateBatchRequest,
} from "./batch-contract.mjs";

const fixture = {
  events: [
    {
      transaction_id: "docs-batch-001",
      external_subscription_id: "docs-sub-acme-pro-001",
      code: "docs_api_calls",
      timestamp: "1735689600",
      properties: { requests: 25 },
    },
    {
      transaction_id: "docs-batch-002",
      external_subscription_id: "docs-sub-acme-pro-001",
      code: "docs_api_calls",
      timestamp: "1735689601",
      properties: { requests: 50 },
    },
  ],
};

const parsed = validateBatchRequest(fixture);
assert.equal(parsed.events.length, 2);
assert.deepEqual(failuresByTransactionId({}), []);

const partial = selectBatchOutcome(parsed.events, {
  invalid_transaction_id: ["docs-batch-002"],
});
assert.deepEqual(
  partial.accepted.map(({ transaction_id }) => transaction_id),
  ["docs-batch-001"]
);
assert.deepEqual(
  partial.retry.map(({ transaction_id }) => transaction_id),
  ["docs-batch-002"]
);
assert.deepEqual(partial.failures, [
  { transactionId: "docs-batch-002", reason: "invalid_transaction_id" },
]);

assert.throws(
  () =>
    validateBatchRequest({ events: [fixture.events[0], fixture.events[0]] }),
  /transaction_id único/
);
assert.throws(
  () => selectBatchOutcome(parsed.events, { invalid_code: ["not-in-batch"] }),
  /fora do lote/
);
assert.throws(
  () =>
    batchRequest.parse({
      events: [{ ...fixture.events[0], properties: { requests: "25" } }],
    }),
  /number/
);

console.log(
  JSON.stringify(
    {
      validated: [
        "request-envelope",
        "partial-acceptance",
        "selective-retry",
        "duplicate-id-rejection",
        "unknown-id-rejection",
        "property-type-rejection",
      ],
      source: "Lago API 1.51.0 · POST /events/batch",
    },
    null,
    2
  )
);
