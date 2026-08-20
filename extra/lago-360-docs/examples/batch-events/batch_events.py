"""Lago API 1.51.0 — evento em lote com diagnóstico e retry seletivo.

Execute: LAGO_API_KEY=... LAGO_SUBSCRIPTION_ID=... LAGO_METRIC_CODE=... python3 batch_events.py
"""
from __future__ import annotations

import json
import os
import time
from datetime import datetime, timezone
from typing import Any
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API_URL = os.getenv("LAGO_API_URL", "https://api.getlago.com/api/v1").rstrip("/")
API_KEY = os.getenv("LAGO_API_KEY")
SUBSCRIPTION_ID = os.getenv("LAGO_SUBSCRIPTION_ID")
METRIC_CODE = os.getenv("LAGO_METRIC_CODE")

for variable, value in {
    "LAGO_API_KEY": API_KEY,
    "LAGO_SUBSCRIPTION_ID": SUBSCRIPTION_ID,
    "LAGO_METRIC_CODE": METRIC_CODE,
}.items():
    if not value:
        raise RuntimeError(f"Defina {variable} antes de executar o exemplo.")


def send_batch(events: list[dict[str, Any]]) -> dict[str, Any]:
    request = Request(
        f"{API_URL}/events/batch",
        data=json.dumps({"events": events}).encode("utf-8"),
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Lago respondeu {exc.code}: {detail}") from exc


def failures_by_transaction_id(errors: dict[str, Any] | None) -> list[dict[str, str]]:
    failures: list[dict[str, str]] = []
    for reason, transaction_ids in (errors or {}).items():
        if isinstance(transaction_ids, list):
            failures.extend({"transaction_id": str(transaction_id), "reason": reason} for transaction_id in transaction_ids)
    return failures


run_id = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
events = [
    {
        "transaction_id": f"docs-batch-{run_id}-{index}",
        "external_subscription_id": SUBSCRIPTION_ID,
        "code": METRIC_CODE,
        "timestamp": str(time.time()),
        "properties": {"requests": requests},
    }
    for index, requests in enumerate((25, 50), start=1)
]

result = send_batch(events)
failures = failures_by_transaction_id(result.get("errors"))
failed_ids = {failure["transaction_id"] for failure in failures}
accepted = [event["transaction_id"] for event in events if event["transaction_id"] not in failed_ids]
print(json.dumps({"accepted": accepted, "failures": failures}, indent=2, ensure_ascii=False))
if failures:
    print("Corrija apenas estes eventos antes de reenviar:", ", ".join(failure["transaction_id"] for failure in failures))
