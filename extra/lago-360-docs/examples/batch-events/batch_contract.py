"""Regras determinísticas do contrato Lago API 1.51.0 para POST /events/batch."""
from __future__ import annotations

from typing import Any


class BatchContractError(ValueError):
    """Erro de contrato ou de reconciliação do lote."""


def validate_batch_request(payload: dict[str, Any]) -> dict[str, Any]:
    events = payload.get("events")
    if not isinstance(events, list) or not 1 <= len(events) <= 100:
        raise BatchContractError("events deve conter entre 1 e 100 itens.")

    transaction_ids: list[str] = []
    for event in events:
        if not isinstance(event, dict):
            raise BatchContractError("Cada item do lote deve ser um objeto.")
        for field in ("transaction_id", "external_subscription_id", "code", "timestamp"):
            if not isinstance(event.get(field), str) or not event[field]:
                raise BatchContractError(f"{field} deve ser uma string não vazia.")
        properties = event.get("properties")
        if not isinstance(properties, dict) or any(
            not isinstance(value, (int, float)) or isinstance(value, bool)
            for value in properties.values()
        ):
            raise BatchContractError("properties deve conter somente valores numéricos.")
        transaction_ids.append(event["transaction_id"])

    if len(set(transaction_ids)) != len(transaction_ids):
        raise BatchContractError("Cada evento do lote deve possuir transaction_id único.")
    return payload


def failures_by_transaction_id(errors: dict[str, Any] | None) -> list[dict[str, str]]:
    failures: list[dict[str, str]] = []
    for reason, transaction_ids in (errors or {}).items():
        if isinstance(transaction_ids, list):
            failures.extend(
                {"transaction_id": str(transaction_id), "reason": reason}
                for transaction_id in transaction_ids
            )
    return failures


def select_batch_outcome(
    events: list[dict[str, Any]], errors: dict[str, Any] | None = None
) -> dict[str, Any]:
    failures = failures_by_transaction_id(errors)
    known_ids = {event["transaction_id"] for event in events}
    unknown_failure = next(
        (failure for failure in failures if failure["transaction_id"] not in known_ids),
        None,
    )
    if unknown_failure:
        raise BatchContractError(
            f"A API retornou transaction_id fora do lote: {unknown_failure['transaction_id']}"
        )
    failed_ids = {failure["transaction_id"] for failure in failures}
    return {
        "accepted": [event for event in events if event["transaction_id"] not in failed_ids],
        "failures": failures,
        "retry": [event for event in events if event["transaction_id"] in failed_ids],
    }
