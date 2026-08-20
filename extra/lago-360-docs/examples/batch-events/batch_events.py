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

from batch_contract import select_batch_outcome, validate_batch_request

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

payload = validate_batch_request({"events": events})
result = send_batch(payload["events"])
outcome = select_batch_outcome(payload["events"], result.get("errors"))
print(json.dumps({"accepted": [event["transaction_id"] for event in outcome["accepted"]], "failures": outcome["failures"]}, indent=2, ensure_ascii=False))
if outcome["retry"]:
    print("Corrija apenas estes eventos antes de reenviar:", ", ".join(event["transaction_id"] for event in outcome["retry"]))
