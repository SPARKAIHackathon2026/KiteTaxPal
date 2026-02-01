import { GokiteAASDK } from "gokite-aa-sdk";
import { ethers } from "ethers";
import { KITE_CONFIG } from "../config/kite.js";
import "dotenv/config";

export async function createAgentAccount() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in .env");
  }

  const wallet = new ethers.Wallet(privateKey);
  const ownerAddress = await wallet.getAddress();

  const sdk = new GokiteAASDK(
    KITE_CONFIG.network,
    KITE_CONFIG.rpcUrl,
    KITE_CONFIG.bundlerUrl
  );

  const accountAddress = sdk.getAccountAddress(ownerAddress);
  console.log("Agent account address:", accountAddress);

  return {
    sdk,
    wallet,
    ownerAddress,
    accountAddress
  };
}
