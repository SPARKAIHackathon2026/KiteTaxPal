import { GokiteAASDK, NETWORKS } from "gokite-aa-sdk";
import { ethers } from "ethers";
import { KITE_CONFIG } from "../config/kite.js";
import "dotenv/config";

export async function createAgentAccount() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("请在 .env 中配置 PRIVATE_KEY");

  const wallet = new ethers.Wallet(privateKey); // 🔹 从私钥生成钱包
  const ownerAddress = await wallet.getAddress(); // 🔹 得到地址

  const sdk = new GokiteAASDK(
    "kite_testnet",                    // 网络标识
    KITE_CONFIG.rpcUrl,                // RPC URL
    "https://bundler-service.staging.gokite.ai/rpc/"  // bundler URL
  );

  const accountAddress = sdk.getAccountAddress(ownerAddress); // 🔹 用地址而非私钥

  console.log("Smart account address:", accountAddress);

  return { sdk, wallet, accountAddress }; // 返回 wallet 方便签名交易
}