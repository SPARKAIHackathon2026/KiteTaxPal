import "dotenv/config";
import { createAgentAccount } from "./agent/accountAA.js";
import { sendStablecoinEOA } from "./agent/paymentEOA.js";
import { sendPayment } from "./agent/paymentAA.js";

const USE_EOA = false;  // 配置切换
const from = process.env.WALLET_ADDRESS;
const to = process.env.WALLET_ADDRESS;

async function main() {
  if (USE_EOA) {
    const txHash = await sendStablecoinEOA(from, 0.00001, to);
    console.log("EOA payment done, txHash:", txHash);
  } else {
    const agent = await createAgentAccount();
    await sendPayment(agent);
    console.log("AA account ready:", agent.accountAddress);
  }
}

main().catch(console.error);