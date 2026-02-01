// import pkg from "gokite-aa-sdk";
// import { ethers } from "ethers";

// const { GokiteAASDK } = pkg;

// export async function sendPayment(agent, { to, amount }) {
//   const { sdk, wallet } = agent;
//   const ownerAddress = await wallet.getAddress();
//   const valueWei = ethers.parseEther(amount.toString());

//   const txRequest = {
//     target: to,
//     value: valueWei.toString(),
//     callData: "0x"
//   };

//   const signFn = async (userOpHash) => {
//     return wallet.signMessage(ethers.getBytes(userOpHash));
//   };

//   const result = await sdk.sendUserOperationAndWait(
//     ownerAddress,
//     txRequest,
//     signFn
//   );

//   console.log("Transaction hash:", Result.userOpHash);
//   return result.userOpHash;
// }

import { GokiteAASDK } from "gokite-aa-sdk";
import { ethers } from "ethers";
import { KITE_CONFIG } from "../config/kite.js";

// ERC20 transfer(address to, uint256 amount) 的 selector + 参数编码
const ERC20_TRANSFER_IFACE = new ethers.Interface([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export async function sendPayment(agent, { to, amount }) {
  const { sdk, wallet } = agent;
  const ownerAddress = await wallet.getAddress();
  const useUSDT = (KITE_CONFIG.paymentToken || "KITE").toUpperCase() === "USDT";

  // 1. 获取 AA 钱包地址
  const aaWalletAddress = sdk.getAccountAddress(ownerAddress);
  console.log(">>> AA Wallet:", aaWalletAddress);
  console.log(">>> Payment token:", useUSDT ? "USDT" : "KITE (native)");

  // 2. 检查钱包是否已部署（查链上代码）
  const rpcUrl = process.env.KITE_RPC || KITE_CONFIG.rpcUrl;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const code = await provider.getCode(aaWalletAddress);

  if (code === "0x") {
    console.log(">>> 钱包未部署，先执行部署...");
  }

  let txRequest;

  if (useUSDT) {
    const usdtAddress = KITE_CONFIG.usdtContractAddress;
    if (!usdtAddress || !ethers.isAddress(usdtAddress)) {
      throw new Error(
        "使用 USDT 支付时必须在 config/kite.js 或环境变量 KITE_TESTNET_USDT_ADDRESS 中配置 Kite 测试网 USDT 合约地址"
      );
    }
    // USDT 通常为 6 位小数
    const amountRaw = ethers.parseUnits(amount.toString(), 6);
    const callData = ERC20_TRANSFER_IFACE.encodeFunctionData("transfer", [to, amountRaw]);
    txRequest = {
      target: usdtAddress,
      value: "0",
      callData,
    };
  } else {
    // 原生 KITE 测试币（18 位小数）
    const valueWei = ethers.parseEther(amount.toString());
    txRequest = {
      target: to,
      value: valueWei.toString(),
      callData: "0x",
    };
  }

  const signFn = async (userOpHash) => {
    return wallet.signMessage(ethers.getBytes(userOpHash));
  };

  try {
    const result = await sdk.sendUserOperationAndWait(
      ownerAddress,
      txRequest,
      signFn
    );

    const txHash = result.status?.transactionHash || result.userOpHash;
    console.log("Transaction hash:", txHash);
    return txHash;
  } catch (err) {
    console.error(">>> 链上交易失败:", err.message);
    throw new Error(`AA 交易失败: ${err.message} (可能是钱包未部署或余额不足)`);
  }
}