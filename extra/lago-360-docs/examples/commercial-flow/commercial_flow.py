"""Lago API 1.51.0 — cliente → métrica → plano → assinatura → evento.

Execute somente com LAGO_ALLOW_WRITE=true em um ambiente autorizado.
"""
import json
import os
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

API_URL = os.getenv("LAGO_API_URL", "https://api.getlago.com/api/v1").rstrip("/")
API_KEY = os.getenv("LAGO_API_KEY")
CUSTOMER_ID = os.getenv("LAGO_CUSTOMER_ID", "docs-acme-001")
METRIC_CODE = os.getenv("LAGO_METRIC_CODE", "docs_api_calls")
PLAN_CODE = os.getenv("LAGO_PLAN_CODE", "docs_pro_monthly")
SUBSCRIPTION_ID = os.getenv("LAGO_SUBSCRIPTION_ID", "docs-sub-acme-pro-001")
TRANSACTION_ID = os.getenv("LAGO_EVENT_TRANSACTION_ID", "docs-event-acme-pro-001")

if not API_KEY:
    raise RuntimeError("Defina LAGO_API_KEY antes de executar o fluxo comercial.")
if os.getenv("LAGO_ALLOW_WRITE") != "true":
    raise RuntimeError("Execução bloqueada: defina LAGO_ALLOW_WRITE=true após revisar os identificadores e o ambiente.")


def request(method: str, path: str, payload: dict | None = None) -> dict:
    data = json.dumps(payload).encode() if payload is not None else None
    http_request = Request(f"{API_URL}{path}", data=data, method=method, headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"})
    try:
        with urlopen(http_request) as response:
            return json.loads(response.read().decode() or "{}")
    except HTTPError as error:
        body = json.loads(error.read().decode() or "{}")
        error.lago_status = error.code
        error.lago_body = body
        raise


def create_or_fetch(create_path: str, read_path: str, payload: dict, key: str) -> tuple[dict, str]:
    try:
        return request("POST", create_path, payload)[key], "created"
    except HTTPError as error:
        if getattr(error, "lago_status", error.code) != 409:
            raise
        return request("GET", read_path)[key], "reused"


customer, customer_state = create_or_fetch("/customers", f"/customers/{quote(CUSTOMER_ID)}", {"customer": {"external_id": CUSTOMER_ID, "name": "Acme Docs"}}, "customer")
metric, metric_state = create_or_fetch("/billable_metrics", f"/billable_metrics/{quote(METRIC_CODE)}", {"billable_metric": {"name": "Chamadas de API", "code": METRIC_CODE, "aggregation_type": "count_agg"}}, "billable_metric")
if not metric.get("id"):
    raise RuntimeError("A resposta da métrica não incluiu id; interrompendo antes de criar o plano.")
plan, plan_state = create_or_fetch("/plans", f"/plans/{quote(PLAN_CODE)}", {"plan": {"name": "Docs Pro", "code": PLAN_CODE, "interval": "monthly", "amount_cents": 0, "amount_currency": "USD", "pay_in_advance": False, "charges": [{"billable_metric_id": metric["id"], "charge_model": "graduated"}]}}, "plan")
subscription, subscription_state = create_or_fetch("/subscriptions", f"/subscriptions/{quote(SUBSCRIPTION_ID)}", {"subscription": {"external_customer_id": CUSTOMER_ID, "plan_code": PLAN_CODE, "external_id": SUBSCRIPTION_ID, "billing_time": "calendar"}}, "subscription")
event = request("POST", "/events", {"transaction_id": TRANSACTION_ID, "external_subscription_id": SUBSCRIPTION_ID, "code": METRIC_CODE, "properties": {"requests": 250}})

print(json.dumps({"customer": customer_state, "metric": metric_state, "plan": plan_state, "subscription": subscription_state, "event": event.get("event", {}).get("transaction_id", TRANSACTION_ID)}, indent=2))
