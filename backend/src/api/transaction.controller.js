import { getTransactions } from "../domain/transaction/transactionRepo.js";

/**
 * GET /api/transactions/:userAddress
 * 获取用户的交易列表
 */
export async function getTransactionsHandler(req, res) {
  try {
    const { userAddress } = req.params;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required"
      });
    }

    // 暂时使用 mock 数据，后续可以接入真实链上数据
    const transactions = getTransactions(userAddress);

    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    console.error(">>> Error in getTransactionsHandler:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
