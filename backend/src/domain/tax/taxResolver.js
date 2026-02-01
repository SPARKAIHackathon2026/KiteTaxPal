import { TAX_CONFIG } from "../../config/tax.js";

export function resolveTaxAuthority(kyc) {
  // console.log(">>> Debug in resolveTaxAuthority - Input kyc:", kyc);
  // console.log(">>> Debug in resolveTaxAuthority - taxResidency:", kyc?.taxResidency);
  // console.log(">>> Debug in resolveTaxAuthority - Available authorities:", Object.keys(TAX_CONFIG.taxAuthorities));
  
  const residencyKey = kyc.taxResidency?.toUpperCase();
  const authority = TAX_CONFIG.taxAuthorities[residencyKey];

  if (!authority) {
    throw new Error(`No tax authority found for residency: ${kyc?.taxResidency}. Available: ${Object.keys(TAX_CONFIG.taxAuthorities).join(', ')}`);
  }

  return authority;
}
