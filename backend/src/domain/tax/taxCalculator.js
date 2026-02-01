/**
 * 原始计算方法（保持向后兼容）
 */
export function calculateTax(transactions, taxRate) {
  const taxableProfit = transactions
    .filter(tx => tx.profit > 0)
    .reduce((sum, tx) => sum + tx.profit, 0);

  return taxableProfit * taxRate;
}

/**
 * 支持策略的税额计算
 * @param {Array} transactions - 交易列表
 * @param {number} taxRate - 税率
 * @param {string} strategy - 策略：FIFO, HIFO, LIFO
 * @returns {Object} { taxAmount, taxableProfit }
 */
export function calculateTaxWithStrategy(transactions, taxRate, strategy = "FIFO") {
  // 过滤出盈利交易
  const profitableTxs = transactions.filter(tx => tx.profit > 0);
  
  if (profitableTxs.length === 0) {
    return { taxAmount: 0, taxableProfit: 0 };
  }

  let taxableProfit;

  switch (strategy.toUpperCase()) {
    case "FIFO":
      // 先进先出：按时间顺序（假设数组顺序就是时间顺序）
      taxableProfit = profitableTxs.reduce((sum, tx) => sum + tx.profit, 0);
      break;
    
    case "HIFO":
      // 最高成本先出：优先选择利润最低的交易（税负最小）
      // 按 profit 从低到高排序，优先计算利润低的
      const sortedLow = [...profitableTxs].sort((a, b) => a.profit - b.profit);
      taxableProfit = sortedLow.reduce((sum, tx) => sum + tx.profit, 0);
      // HIFO 策略下，我们假设可以优化，减少约15%的应税利润（mock逻辑）
      taxableProfit = taxableProfit * 0.85;
      break;
    
    case "LIFO":
      // 后进先出：按时间倒序
      const reversed = [...profitableTxs].reverse();
      taxableProfit = reversed.reduce((sum, tx) => sum + tx.profit, 0);
      // LIFO 策略下，假设减少约10%的应税利润（mock逻辑）
      taxableProfit = taxableProfit * 0.90;
      break;
    
    default:
      // 默认使用 FIFO
      taxableProfit = profitableTxs.reduce((sum, tx) => sum + tx.profit, 0);
  }

  const taxAmount = taxableProfit * taxRate;

  return {
    taxAmount,
    taxableProfit
  };
}
