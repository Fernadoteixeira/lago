import { describe, expect, it } from "vitest";
import { coverageCounts, coverageDomains, getCoverageDomain } from "./coverage";

describe("matriz de cobertura", () => {
  it("mantém cada domínio com um slug e estágio causal", () => {
    expect(new Set(coverageDomains.map((domain) => domain.slug)).size).toBe(coverageDomains.length);
    expect(coverageDomains.every((domain) => domain.flowStage && domain.contractFocus && domain.nextTask)).toBe(true);
  });

  it("mantém o resumo consistente com os domínios", () => {
    expect(Object.values(coverageCounts).reduce((sum, count) => sum + count, 0)).toBe(coverageDomains.length);
  });

  it("recupera um guia por rota e rejeita um slug desconhecido", () => {
    expect(getCoverageDomain("eventos")?.title).toBe("Eventos de uso");
    expect(getCoverageDomain("inexistente")).toBeUndefined();
  });
});
