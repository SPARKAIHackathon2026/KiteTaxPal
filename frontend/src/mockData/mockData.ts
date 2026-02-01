export type Transaction = {
    id: string;
    timestamp: string;
    hash: string;
    type: "trade" | "receive" | "send" | "staking" | "airdrop";
    fromAsset: string;
    fromAmount: number;
    toAsset: string;
    toAmount: number;
    fiatValueAtTime: number; // 交易发生时的公允价值 (SGD/USD)
    costBasis?: number;      // 初始购入成本
};

export const mockTransactions: Transaction[] = [
    {
        id: "1",
        timestamp: "2024-03-15 10:20",
        hash: "0x7a2...f31",
        type: "trade",
        fromAsset: "ETH",
        fromAmount: 1.5,
        toAsset: "USDC",
        toAmount: 4200,
        fiatValueAtTime: 4200,
        costBasis: 2800, // 假设 1.5 ETH 买入时只花了 2800
    },
    {
        id: "2",
        timestamp: "2024-04-02 14:00",
        hash: "0x3b1...e92",
        type: "airdrop",
        fromAsset: "",
        fromAmount: 0,
        toAsset: "STRK",
        toAmount: 500,
        fiatValueAtTime: 1200, // 收到空投瞬间的价值
    },
    {
        id: "3",
        timestamp: "2024-05-10 08:30",
        hash: "0x9c4...d22",
        type: "staking",
        fromAsset: "",
        fromAmount: 0,
        toAsset: "stETH",
        toAmount: 0.05,
        fiatValueAtTime: 180,
    },
    {
        id: "4",
        timestamp: "2024-06-01 12:00",
        hash: "0x12d...a11",
        type: "send", // 比如提现到冷钱包或转账给朋友
        fromAsset: "ETH",
        fromAmount: 0.2,
        toAsset: "",
        toAmount: 0,
        fiatValueAtTime: 700,
    }
];