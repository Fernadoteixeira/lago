import { assertReconciliation, fixture } from "./validate-contract.mjs";

const report = assertReconciliation(fixture);
console.log(JSON.stringify({
  ...report,
  status: "reconciled_locally",
  note: "Demonstração sem chamada de escrita; confirme estados remotos antes de qualquer operação financeira.",
}, null, 2));
