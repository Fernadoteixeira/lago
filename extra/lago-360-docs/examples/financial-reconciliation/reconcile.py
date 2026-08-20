"""Reconciliação financeira local sem chamadas de escrita à API do Lago."""

from decimal import Decimal

INVOICE_TOTAL = Decimal("10.00")
PAYMENT_AMOUNT = Decimal("8.50")
CREDIT_AMOUNT = Decimal("1.50")


def reconcile() -> dict[str, str]:
    if PAYMENT_AMOUNT + CREDIT_AMOUNT != INVOICE_TOTAL:
        raise ValueError("Pagamento e crédito devem reconciliar o total da fatura.")
    return {
        "invoice_id": "11111111-1111-4111-8111-111111111111",
        "status": "reconciled_locally",
        "settlement_amount": str(PAYMENT_AMOUNT + CREDIT_AMOUNT),
        "note": "Exemplo local: consulte o estado remoto antes de criar pagamento, crédito ou wallet.",
    }


if __name__ == "__main__":
    print(reconcile())
