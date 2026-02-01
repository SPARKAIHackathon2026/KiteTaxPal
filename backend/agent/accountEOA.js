import { ethers } from "ethers";
import "dotenv/config";

export function createEOAAccount() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("请在 .env 中配置 PRIVATE_KEY");

  const provider = new ethers.JsonRpcProvider("https://rpc-testnet.gokite.ai/");

  const wallet = new ethers.Wallet(privateKey, provider);
  const address = wallet.address;

  console.log("EOA wallet address:", address);
  return { wallet, provider, address };
}
