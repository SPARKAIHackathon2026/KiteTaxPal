/**
 * 获取用户的交易列表
 * @param {string} address - 用户地址
 * @param {number} fromTs - 开始时间戳（可选）
 * @param {number} toTs - 结束时间戳（可选）
 * @returns {Array} 交易列表
 */
export function getTransactions(address, fromTs, toTs) {
  // Mock 数据：返回更丰富的交易信息
  // 后续可以接入真实的链上数据查询
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  return [
    { 
      token: "USDC", 
      profit: 0.03,
      amount: 0.01,
      timestamp: now - oneDay * 10,
      type: "swap"
    },
    { 
      token: "ETH", 
      profit: -0.01,
      amount: 0.005,
      timestamp: now - oneDay * 8,
      type: "transfer"
    },
    { 
      token: "DAI", 
      profit: 0.002,
      amount: 0.5,
      timestamp: now - oneDay * 5,
      type: "swap"
    },
    { 
      token: "USDC", 
      profit: 0.015,
      amount: 0.8,
      timestamp: now - oneDay * 3,
      type: "swap"
    },
    { 
      token: "ETH", 
      profit: 0.025,
      amount: 0.0003,
      timestamp: now - oneDay * 1,
      type: "swap"
    }
  ];
}
