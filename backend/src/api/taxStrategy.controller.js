import { getTransactions } from "../domain/transaction/transactionRepo.js";
import { calculateTaxWithStrategy } from "../domain/tax/taxCalculator.js";
import { getTaxProfile } from "../domain/kyc/taxProfileRepo.js";
import { resolveTaxAuthority } from "../domain/tax/taxResolver.js";
import { getUserKYC } from "../domain/kyc/kycRepo.js";

/**
 * POST /api/tax/compare-strategies
 * 对比不同策略的税额
 */
export async function compareStrategiesHandler(req, res) {
  try {
    const { userAddress } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required"
      });
    }

    // 获取交易数据
    const transactions = getTransactions(userAddress);
    
    // 获取税务配置
    let kyc;
    const taxProfile = getTaxProfile(userAddress);
    if (taxProfile) {
      kyc = {
        taxResidency: taxProfile.taxResidency || taxProfile.country || "SG",
        taxType: "capital_gains"
      };
    } else {
      kyc = getUserKYC(userAddress);
    }

    const authority = resolveTaxAuthority(kyc);

    // 计算资本利得（用于所有策略）
    const capitalGains = transactions
      .filter(tx => tx.profit > 0)
      .reduce((sum, tx) => sum + tx.profit, 0);

    // 计算三种策略的税额
    const strategies = ["FIFO", "HIFO", "LIFO"].map(strategy => {
      const taxResult = calculateTaxWithStrategy(transactions, authority.taxRate, strategy);
      return {
        strategy,
        taxAmount: Math.round(taxResult.taxAmount * 1000), // 转换为美元（mock）
        capitalGains: Math.round(capitalGains * 1000) // 转换为美元（mock）
      };
    });

    // 找出税额最低的策略（推荐）
    const recommended = strategies.reduce((min, curr) => 
      curr.taxAmount < min.taxAmount ? curr : min
    );

    res.json({
      success: true,
      strategies,
      recommended: recommended.strategy
    });
  } catch (err) {
    console.error(">>> Error in compareStrategiesHandler:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
