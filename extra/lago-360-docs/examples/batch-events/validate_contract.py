"""Validação local do recorte canônico Lago API 1.51.0 para eventos em lote."""
from __future__ import annotations

from batch_contract import BatchContractError, select_batch_outcome, validate_batch_request


FIXTURE = {
    "events": [
        {
            "transaction_id": "docs-batch-001",
            "external_subscription_id": "docs-sub-acme-pro-001",
            "code": "docs_api_calls",
            "timestamp": "1735689600",
            "properties": {"requests": 25},
        },
        {
            "transaction_id": "docs-batch-002",
            "external_subscription_id": "docs-sub-acme-pro-001",
            "code": "docs_api_calls",
            "timestamp": "1735689601",
            "properties": {"requests": 50},
        },
    ]
}


validate_batch_request(FIXTURE)
partial = select_batch_outcome(FIXTURE["events"], {"invalid_transaction_id": ["docs-batch-002"]})
assert [event["transaction_id"] for event in partial["accepted"]] == ["docs-batch-001"]
assert [event["transaction_id"] for event in partial["retry"]] == ["docs-batch-002"]
assert partial["failures"] == [
    {"transaction_id": "docs-batch-002", "reason": "invalid_transaction_id"}
]

try:
    validate_batch_request({"events": [FIXTURE["events"][0], FIXTURE["events"][0]]})
except BatchContractError as exc:
    assert "transaction_id único" in str(exc)
else:
    raise AssertionError("IDs duplicados deveriam ser rejeitados")

try:
    select_batch_outcome(FIXTURE["events"], {"invalid_code": ["not-in-batch"]})
except BatchContractError as exc:
    assert "fora do lote" in str(exc)
else:
    raise AssertionError("IDs desconhecidos deveriam ser rejeitados")

try:
    validate_batch_request({"events": [{**FIXTURE["events"][0], "properties": {"requests": "25"}}]})
except BatchContractError as exc:
    assert "numéricos" in str(exc)
else:
    raise AssertionError("Propriedades não numéricas deveriam ser rejeitadas")

print("Python batch contract passed: envelope, partial acceptance, selective retry and safety guards.")
