import { getUserKYC } from "../domain/kyc/kycRepo.js";
import { getTransactions } from "../domain/transaction/transactionRepo.js";
import { calculateTax } from "../domain/tax/taxCalculator.js";
import { resolveTaxAuthority } from "../domain/tax/taxResolver.js";
import { checkPaymentPermission } from "../agent/permission.js";
import { sendPayment } from "../agent/paymentAA.js";

// export async function settleTax(agent, userAddress) {
//   const kyc = getUserKYC(userAddress);
//   const transactions = getTransactions(userAddress);

//   const authority = resolveTaxAuthority(kyc);
//   const taxAmount = calculateTax(transactions, authority.taxRate);

//   checkPaymentPermission({
//     amount: taxAmount,
//     to: authority.address
//   });

//   const txHash = await sendPayment(agent, {
//     to: authority.address,
//     amount: taxAmount
//   });

//   return {
//     taxAmount,
//     authority: authority.address,
//     txHash
//   };
// }
// taxSettlementService.js 处理部署逻辑
export async function settleTax(agent, userAddress, amount, to) {
  let taxAmount = Number(amount) || 5;
  let targetAddress = to || "0x103034dbd47AfaeF830Df2F9147a05149992377d";
  
  try {
    checkPaymentPermission({ amount: taxAmount, to: targetAddress });
    
    const txHash = await sendPayment(agent, { to: targetAddress, amount: taxAmount });
    
    return {
      success: true,
      mode: "on-chain",
      taxAmount,
      authority: targetAddress,
      txHash,
      userAddress
    };
    
  } catch (err) {
    // 如果是因为钱包未部署，先部署再重试（简化版）
    if (err.message?.includes("AA_WALLET_NOT_DEPLOYED")) {
      const aaAddress = err.message.split(":")[1];
      console.log(">>> 检测到未部署钱包:", aaAddress);
      
      // 演示环境：返回 Mock 但告诉前端需要初始化
      return {
        success: true,
        mode: "initialization-required",
        aaWalletAddress: aaAddress,
        taxAmount,
        authority: targetAddress,
        txHash: "0xDEPLOY_REQUIRED_" + Math.random().toString(16).substr(2, 10),
        message: "AA 钱包首次使用，需先存入 Gas 费完成部署",
        instruction: "请向此地址转入少量 KITE: " + aaAddress
      };
    }
    
    throw err;
  }
}