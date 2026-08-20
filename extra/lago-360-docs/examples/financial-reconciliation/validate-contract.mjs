/*
 * Lago API 1.51.0 — validação local do corte financeiro canônico.
 * Fonte: references/FINANCIAL_CONTRACT_1_51.md e bundle OpenAPI preservado.
 */
import { z } from "zod";

const uuid = z.string().uuid();
const invoice = z.object({
  lago_id: uuid,
  payment_status: z.enum(["pending", "succeeded", "failed"]),
  status: z.enum(["draft", "finalized", "failed", "pending", "voided"]),
  total_amount_cents: z.number().int().nonnegative(),
  currency: z.string().length(3),
});
const payment = z.object({
  payment: z.object({ invoice_id: uuid, amount_cents: z.number().int().positive(), reference: z.string().min(1), paid_at: z.string().date().optional() }),
});
const creditNote = z.object({
  credit_note: z.object({
    invoice_id: uuid,
    items: z.array(z.object({ fee_id: uuid, amount_cents: z.number().int().positive() })).min(1),
    credit_amount_cents: z.number().int().nonnegative().optional(),
    refund_amount_cents: z.number().int().nonnegative().optional(),
    offset_amount_cents: z.number().int().nonnegative().optional(),
  }),
});
const wallet = z.object({
  wallet: z.object({
    rate_amount: z.string().regex(/^[0-9]+\.?[0-9]*$/),
    currency: z.string().length(3),
    external_customer_id: z.string().min(1),
    paid_credits: z.string().regex(/^[0-9]+\.?[0-9]*$/).optional(),
    granted_credits: z.string().regex(/^[0-9]+\.?[0-9]*$/).optional(),
  }),
});

export const fixture = {
  invoice: { lago_id: "11111111-1111-4111-8111-111111111111", status: "finalized", payment_status: "pending", total_amount_cents: 1000, currency: "USD" },
  payment: { payment: { invoice_id: "11111111-1111-4111-8111-111111111111", amount_cents: 850, reference: "bank-transfer-acme-2026-04", paid_at: "2026-04-15" } },
  creditNote: { credit_note: { invoice_id: "11111111-1111-4111-8111-111111111111", items: [{ fee_id: "22222222-2222-4222-8222-222222222222", amount_cents: 150 }], credit_amount_cents: 150, refund_amount_cents: 0, offset_amount_cents: 0 } },
  wallet: { wallet: { rate_amount: "1.0", currency: "USD", external_customer_id: "acme-001", granted_credits: "25.0" } },
};

export function assertReconciliation(value = fixture) {
  invoice.parse(value.invoice); payment.parse(value.payment); creditNote.parse(value.creditNote); wallet.parse(value.wallet);
  const note = value.creditNote.credit_note;
  const itemsTotal = note.items.reduce((sum, item) => sum + item.amount_cents, 0);
  const distribution = (note.credit_amount_cents ?? 0) + (note.refund_amount_cents ?? 0) + (note.offset_amount_cents ?? 0);
  if (itemsTotal !== distribution) throw new Error("A distribuição de crédito, reembolso e offset deve equilibrar os itens da nota.");
  if (distribution > value.invoice.total_amount_cents) throw new Error("O ajuste financeiro não pode exceder o total da fatura.");
  if (value.payment.payment.invoice_id !== value.invoice.lago_id) throw new Error("O pagamento deve referenciar a mesma fatura da reconciliação.");
  if (value.payment.payment.amount_cents + distribution !== value.invoice.total_amount_cents) throw new Error("Pagamento e ajuste devem reconciliar o total da fatura neste cenário de exemplo.");
  if (!value.wallet.wallet.paid_credits && !value.wallet.wallet.granted_credits) throw new Error("A wallet requer créditos pagos ou concedidos.");
  return { invoice_id: value.invoice.lago_id, settlement_amount_cents: value.payment.payment.amount_cents + distribution, currency: value.invoice.currency, validated: ["invoice", "payment", "credit_note", "wallet"] };
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(assertReconciliation(), null, 2));
