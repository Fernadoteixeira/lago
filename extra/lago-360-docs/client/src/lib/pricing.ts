/** Atlas de Operação: cálculos didáticos isolados para teste e reutilização no simulador. */
export function calculateGraduated(units: number) {
  const normalizedUnits = Math.max(0, units);
  const tierOne = Math.min(normalizedUnits, 100) * 0.1;
  const tierTwo = Math.max(Math.min(normalizedUnits, 500) - 100, 0) * 0.08;
  const tierThree = Math.max(normalizedUnits - 500, 0) * 0.05;
  return { total: tierOne + tierTwo + tierThree, pieces: [tierOne, tierTwo, tierThree] };
}

export function calculateVolume(units: number) {
  const normalizedUnits = Math.max(0, units);
  const rate = normalizedUnits <= 100 ? 0.1 : normalizedUnits <= 500 ? 0.08 : 0.05;
  return { total: normalizedUnits * rate, rate };
}
