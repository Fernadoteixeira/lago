import { z } from "zod";

const batchEvent = z.object({
  transaction_id: z.string().min(1),
  external_subscription_id: z.string().min(1),
  code: z.string().min(1),
  timestamp: z.string().min(1),
  properties: z.record(z.string(), z.number().finite()),
});

export const batchRequest = z.object({
  events: z.array(batchEvent).min(1).max(100),
});

export function validateBatchRequest(payload) {
  const parsed = batchRequest.parse(payload);
  const ids = parsed.events.map(({ transaction_id }) => transaction_id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Cada evento do lote deve possuir transaction_id único.");
  }
  return parsed;
}

export function failuresByTransactionId(errors = {}) {
  return Object.entries(errors).flatMap(([reason, transactionIds]) =>
    Array.isArray(transactionIds)
      ? transactionIds.map(transactionId => ({ transactionId, reason }))
      : []
  );
}

export function selectBatchOutcome(events, errors = {}) {
  const failures = failuresByTransactionId(errors);
  const knownIds = new Set(events.map(({ transaction_id }) => transaction_id));
  const unknownFailure = failures.find(
    ({ transactionId }) => !knownIds.has(transactionId)
  );
  if (unknownFailure) {
    throw new Error(
      `A API retornou transaction_id fora do lote: ${unknownFailure.transactionId}`
    );
  }
  const failedIds = new Set(failures.map(({ transactionId }) => transactionId));
  return {
    accepted: events.filter(
      ({ transaction_id }) => !failedIds.has(transaction_id)
    ),
    failures,
    retry: events.filter(({ transaction_id }) => failedIds.has(transaction_id)),
  };
}
