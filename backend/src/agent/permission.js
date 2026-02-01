import { TAX_CONFIG } from "../config/tax.js";

export function checkPaymentPermission({ amount, to }) {
  if (amount <= 0) {
    throw new Error("Tax amount must be greater than 0");
  }

  if (amount > TAX_CONFIG.maxTaxPayment) {
    throw new Error("Tax amount exceeds max allowed limit");
  }

  const allowedAddresses = Object.values(
    TAX_CONFIG.taxAuthorities
  ).map(a => a.address);

  if (!allowedAddresses.includes(to)) {
    throw new Error("Target address is not a whitelisted tax authority");
  }
}
