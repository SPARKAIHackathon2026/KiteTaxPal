import { createEOAAccount } from "./accountEOA.js";
import { ethers } from "ethers";

export async function sendStablecoinEOA(to, amount, tokenAddress) {
  const { wallet, provider, address } = createEOAAccount();

  // 使用 ERC20 合约
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)"
  ];

  const token = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  const decimals = 18; // 具体 token 根据 testnet 设置
  const tx = await token.transfer(to, ethers.parseUnits(amount.toString(), decimals));

  console.log(`EOA tx hash: ${tx.hash}`);
  await tx.wait();
  console.log("EOA payment success");

  return tx.hash;
}
