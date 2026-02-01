import { getTransactions } from "../domain/transaction/transactionRepo.js";
import { calculateTaxWithStrategy } from "../domain/tax/taxCalculator.js";
import { getTaxProfile } from "../domain/kyc/taxProfileRepo.js";
import { resolveTaxAuthority } from "../domain/tax/taxResolver.js";
import { getUserKYC } from "../domain/kyc/kycRepo.js";
import { TAX_CONFIG } from "../../src/config/tax.js";

/**
 * POST /api/tax/analyze
 * 分析用户交易并计算税额
 */
export async function analyzeTaxHandler(req, res) {
  try {
    const { userAddress, strategy = "FIFO" } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required"
      });
    }

    // 获取交易数据
    const transactions = getTransactions(userAddress);
    
    // 获取税务配置（优先使用用户配置，否则使用默认KYC）
    let kyc;
    const taxProfile = getTaxProfile(userAddress);
    if (taxProfile) {
      kyc = {
        taxResidency: (taxProfile.taxResidency || taxProfile.country || "SG").toUpperCase(),
        taxType: "capital_gains"
      };
    } else {
      kyc = getUserKYC(userAddress);// 防止返回 undefined
      // 确保有默认值
      kyc.taxResidency = (taxProfile.taxResidency || taxProfile.country || "SG").toUpperCase();
      kyc.taxType = kyc.taxType || "capital_gains";
    }

    console.log(">>> Debug - User Address:", userAddress);
    console.log(">>> Debug - Tax Profile:", taxProfile);
    console.log(">>> Debug - KYC Data:", kyc);
    console.log(">>> Debug - Tax Residency:", kyc?.taxResidency);
    console.log(">>> Debug - Full TAX_CONFIG:", TAX_CONFIG);

    // 解析税务机构
    const authority = resolveTaxAuthority(kyc);

    // 计算税额（支持策略）
    const taxResult = calculateTaxWithStrategy(transactions, authority.taxRate, strategy);

    // 计算总交易量和资本利得
    const totalVolume = transactions.reduce((sum, tx) => {
      // 假设每笔交易的平均金额为 profit 的绝对值 * 100（mock逻辑）
      return sum + Math.abs(tx.profit || 0) * 100;
    }, 0);

    const capitalGains = transactions
      .filter(tx => tx.profit > 0)
      .reduce((sum, tx) => sum + tx.profit, 0);

    res.json({
      success: true,
      transactionCount: transactions.length,
      totalVolume: Math.round(totalVolume),
      estimatedCapitalGains: Math.round(capitalGains * 1000), // 转换为美元（mock）
      taxAmount: Math.round(taxResult.taxAmount * 1000), // 转换为美元（mock）
      strategy,
      authority: authority.address,
      taxRate: authority.taxRate
    });
  } catch (err) {
    // console.error(">>> Error in analyzeTaxHandler:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
