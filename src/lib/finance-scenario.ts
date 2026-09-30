export const BASE_FINANCE_INPUT = {
  invoiceAmount: 1_863_900,
  daysToSettle: 148,
  advanceRate: 60,
  deductionsPercent: 2,
  bankInterestRate: 0.11,
  platformFeeRate: 0.0035,
  traditionalInterestRate: 0.18,
} as const;

export function calculateFinanceScenario(input: {
  invoiceAmount: number;
  daysToSettle: number;
  advanceRate: number;
  deductionsPercent: number;
}) {
  const { invoiceAmount, daysToSettle, advanceRate, deductionsPercent } = input;
  const advanceAmount = Math.round(invoiceAmount * (advanceRate / 100));
  const holdbackAmount = invoiceAmount - advanceAmount;
  const bankDiscount = Math.round(advanceAmount * BASE_FINANCE_INPUT.bankInterestRate * (daysToSettle / 365));
  const platformFee = Math.round(invoiceAmount * BASE_FINANCE_INPUT.platformFeeRate);
  const deductionsAmount = Math.round(invoiceAmount * (deductionsPercent / 100));
  const totalCharges = bankDiscount + platformFee + deductionsAmount;
  const remainingHoldback = Math.max(0, holdbackAmount - totalCharges);
  // Net proceeds include the modeled shortfall even when the holdback is exhausted.
  const contractorNetTake = Math.max(0, invoiceAmount - totalCharges);
  const contractorNetTakePercent = (contractorNetTake / invoiceAmount) * 100;
  const traditionalInterest = Math.round(invoiceAmount * BASE_FINANCE_INPUT.traditionalInterestRate * (daysToSettle / 365));
  const traditionalNetTake = Math.max(0, invoiceAmount - traditionalInterest - deductionsAmount);
  const traditionalNetTakePercent = (traditionalNetTake / invoiceAmount) * 100;
  const principalExposed = totalCharges > holdbackAmount;
  const deficitAmount = Math.max(0, totalCharges - holdbackAmount);

  return {
    advanceAmount, holdbackAmount, bankDiscount, platformFee, deductionsAmount,
    remainingHoldback, contractorNetTake, contractorNetTakePercent,
    traditionalInterest, traditionalNetTake, traditionalNetTakePercent,
    principalExposed, deficitAmount,
  };
}

export const BASE_FINANCE_SCENARIO = calculateFinanceScenario(BASE_FINANCE_INPUT);
