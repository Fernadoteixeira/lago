import { describe, expect, it } from "vitest";
import { documentationFilterOptions, documentationIndex } from "./documentationIndex";

describe("índice canônico da documentação", () => {
  it("mantém identificadores únicos e destinos navegáveis", () => {
    const ids = documentationIndex.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(documentationIndex.every((entry) => entry.href.startsWith("/"))).toBe(true);
  });

  it("indexa as rotas de maior impacto do fluxo Lago", () => {
    expect(documentationIndex.some((entry) => entry.title === "/events/batch" && entry.method === "POST")).toBe(true);
    expect(documentationIndex.some((entry) => entry.title === "/plans" && entry.method === "POST")).toBe(true);
    expect(documentationIndex.some((entry) => entry.href === "/coverage")).toBe(true);
  });

  it("deriva filtros a partir do próprio índice", () => {
    expect(documentationFilterOptions.domains).toContain("Eventos");
    expect(documentationFilterOptions.stages).toContain("Cobrança");
    expect(documentationFilterOptions.methods).toContain("POST");
  });
});
