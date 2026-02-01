// import { createTaxAgent } from "../agent/agentFactory.js";
// import { settleTax } from "../services/taxSettlementService.js";

// export async function settleTaxHandler(req, res) {
//   console.log(">>> [API] /tax/settle called");
//   console.log(">>> body:", req.body);

//   try {
//     const { userAddress } = req.body;

//     const agent = await createTaxAgent();
//     const result = await settleTax(agent, userAddress);

//     res.json({
//       success: true,
//       ...result
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// }
import { createTaxAgent } from "../agent/agentFactory.js";
import { settleTax } from "../services/taxSettlementService.js";

export async function settleTaxHandler(req, res) {
  console.log(">>> [API] /tax/settle called");
  console.log(">>> body:", req.body);

  try {
    // ⭐ 解构出所有字段
    const { userAddress, amount, to } = req.body;

    const agent = await createTaxAgent();
    
    // ⭐ 传入 amount 和 to（可选）
    const result = await settleTax(agent, userAddress, amount, to);

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    // console.error(">>> Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}