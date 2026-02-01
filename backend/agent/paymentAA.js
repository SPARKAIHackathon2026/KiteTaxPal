// payment.js
import pkg from "gokite-aa-sdk"; // ✅ 默认导入
import { ethers } from "ethers";
import "dotenv/config";

const { GokiteAASDK } = pkg; // 取需要的类
// 其他类型声明不用导入，因为 JS 运行时不需要类型

export async function sendPayment({ sdk, wallet, accountAddress }) {
  const ownerAddress = await wallet.getAddress();

  // 使用批量交易格式 (SDK 的 prependAddSupportedToken 对单笔格式有 bug)
  const txRequest = {
    targets: ["0x103034dbd47AfaeF830Df2F9147a05149992377d"],
    values: ["100000000000000"], // 0.0001 ETH
    callDatas: ["0x"]
  };

  // 签名函数：SDK 传递 userOpHash，需要签名后返回
  const signFn = async (userOpHash) => {
    const signature = await wallet.signMessage(ethers.getBytes(userOpHash));
    return signature;
  };

  // 使用 SDK 发送交易 (第一个参数是 owner 地址，不是 accountAddress)
  const txResult = await sdk.sendUserOperationAndWait(
    ownerAddress,
    txRequest,
    signFn
  );

  console.log("Transaction hash:", txResult.userOpHash);
}