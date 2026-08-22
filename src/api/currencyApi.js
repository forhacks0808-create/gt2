/**
 * TODO (production): replace with a real call to exchangerate.host (or
 * similar FX API):
 *
 *   const res = await fetch(`https://api.exchangerate.host/latest?base=USD`);
 *   const { rates } = await res.json();
 *
 * Static snapshot used for the budget screen's cost-index math in the demo.
 */
const RATES_TO_USD = {
  USD: 1,
  EUR: 1.08,
  JPY: 0.0067,
  GBP: 1.27,
};

export async function getExchangeRates() {
  await new Promise((r) => setTimeout(r, 200));
  return RATES_TO_USD;
}
