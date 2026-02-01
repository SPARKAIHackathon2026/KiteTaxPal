import { ethers } from "ethers";
import { saveBinding } from "../domain/wallet/walletRepo.js";

export async function bindWallet(req, res) {
  try {
    const { userAddress, agentAddress, chainId } = req.body;

    // 基础校验
    if (!userAddress || !ethers.isAddress(userAddress)) {
      return res.status(400).json({ success: false, error: "Invalid user address" });
    }

    // TODO: 可选链校验 / allowance 检查
    saveBinding({
      userAddress,
      agentAddress,
      chainId,
      authorizationType: "ERC20_ALLOWANCE"
    });

    res.json({ success: true });
  } catch (err) {
    console.error(">>> Error in bindWallet:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
