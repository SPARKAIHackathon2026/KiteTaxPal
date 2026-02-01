// 内存存储，后续可替换为数据库
const taxProfiles = new Map();

/**
 * 保存税务档案
 */
export function saveTaxProfile(profile) {
  taxProfiles.set(profile.userAddress.toLowerCase(), profile);
  return profile;
}

/**
 * 获取税务档案
 */
export function getTaxProfile(userAddress) {
  return taxProfiles.get(userAddress?.toLowerCase()) || null;
}

/**
 * 获取所有税务档案（用于调试）
 */
export function getAllTaxProfiles() {
  return Array.from(taxProfiles.values());
}
