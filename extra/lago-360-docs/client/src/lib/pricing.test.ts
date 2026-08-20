import { describe, expect, it } from "vitest";
import { calculateGraduated, calculateVolume } from "./pricing";

describe("modelos de cobrança didáticos", () => {
  it("acumula faixas no modelo graduado", () => {
    expect(calculateGraduated(450)).toEqual({ total: 38, pieces: [10, 28, 0] });
  });

  it("aplica uma única tarifa ao total no modelo por volume", () => {
    expect(calculateVolume(450)).toEqual({ total: 36, rate: 0.08 });
  });

  it("não calcula valor negativo para entrada inválida", () => {
    expect(calculateGraduated(-1).total).toBe(0);
    expect(calculateVolume(-1).total).toBe(0);
  });
});
