import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  selectBatchOutcome,
  validateBatchRequest,
} from "../examples/batch-events/batch-contract.mjs";

const concurrency = Number.parseInt(process.env.BATCH_CONCURRENCY || "128", 10);
const iterationsPerWorker = Number.parseInt(
  process.env.BATCH_ITERATIONS || "32",
  10
);
assert.ok(
  Number.isInteger(concurrency) && concurrency > 0,
  "BATCH_CONCURRENCY deve ser inteiro positivo"
);
assert.ok(
  Number.isInteger(iterationsPerWorker) && iterationsPerWorker > 0,
  "BATCH_ITERATIONS deve ser inteiro positivo"
);

const request = {
  events: [
    {
      transaction_id: "evt-concurrency-0001",
      external_subscription_id: "sub-concurrency",
      code: "api_calls",
      timestamp: "1786805400.125",
      properties: { requests: 250 },
    },
    {
      transaction_id: "evt-concurrency-0002",
      external_subscription_id: "sub-concurrency",
      code: "api_calls",
      timestamp: "1786805401.125",
      properties: { requests: 500 },
    },
    {
      transaction_id: "evt-concurrency-0003",
      external_subscription_id: "sub-concurrency",
      code: "api_calls",
      timestamp: "1786805402.125",
      properties: { requests: 750 },
    },
  ],
};
const errors = { invalid_code: ["evt-concurrency-0002"] };
const expected = {
  accepted: ["evt-concurrency-0001", "evt-concurrency-0003"],
  failures: [{ transactionId: "evt-concurrency-0002", reason: "invalid_code" }],
  retry: ["evt-concurrency-0002"],
};

const baseline = validateBatchRequest(request);
const startedAt = performance.now();
const jobs = Array.from(
  { length: concurrency },
  (_, worker) =>
    new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          for (
            let iteration = 0;
            iteration < iterationsPerWorker;
            iteration += 1
          ) {
            const validated = validateBatchRequest(request);
            const outcome = selectBatchOutcome(validated.events, errors);
            assert.deepEqual(
              outcome.accepted.map(({ transaction_id }) => transaction_id),
              expected.accepted,
              `accepted divergente no worker ${worker}, iteração ${iteration}`
            );
            assert.deepEqual(
              outcome.failures,
              expected.failures,
              `failures divergente no worker ${worker}, iteração ${iteration}`
            );
            assert.deepEqual(
              outcome.retry.map(({ transaction_id }) => transaction_id),
              expected.retry,
              `retry divergente no worker ${worker}, iteração ${iteration}`
            );
            assert.deepEqual(
              validated,
              baseline,
              `validação mutada no worker ${worker}, iteração ${iteration}`
            );
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    })
);
await Promise.all(jobs);

const elapsedMs = Number((performance.now() - startedAt).toFixed(2));
const totalExecutions = concurrency * iterationsPerWorker;
console.log(
  JSON.stringify(
    {
      status: "passed",
      concurrency,
      iterationsPerWorker,
      totalExecutions,
      elapsedMs,
      executionsPerSecond: Number(
        (totalExecutions / Math.max(elapsedMs / 1000, 0.001)).toFixed(2)
      ),
      invariant:
        "accepted + failures + retry permanece estável e sem mutação entre execuções",
    },
    null,
    2
  )
);
