import { Transaction } from '../mockData/mockData';

interface TaxConfig {
    country: "us" | "sg";
    intent?: "investment" | "trading";
}

export const calculateTax = (txs: Transaction[], config: TaxConfig) => {
    let taxableTotal = 0;

    const analyzedTxs = txs.map(tx => {
        let isTaxable = false;
        let gainOrIncome = 0;
        let taxCategory = "Non-Taxable";

        if (config.country === "us") {
            // 美国逻辑：Trade 算资本利得，Airdrop/Staking 算普通收入
            if (tx.type === "trade") {
                isTaxable = true;
                gainOrIncome = tx.fiatValueAtTime - (tx.costBasis || 0);
                taxCategory = "Capital Gain";
            } else if (tx.type === "airdrop" || tx.type === "staking") {
                isTaxable = true;
                gainOrIncome = tx.fiatValueAtTime;
                taxCategory = "Ordinary Income";
            }
        } else if (config.country === "sg") {
            // 新加坡逻辑：如果是 Investment，Trade 往往不扣税；如果是 Trading，则按收入扣
            if (tx.type === "trade") {
                if (config.intent === "trading") {
                    isTaxable = true;
                    gainOrIncome = tx.fiatValueAtTime - (tx.costBasis || 0);
                    taxCategory = "Income Tax (Trading)";
                }
            } else if (tx.type === "airdrop" || tx.type === "staking") {
                isTaxable = true;
                gainOrIncome = tx.fiatValueAtTime;
                taxCategory = "Other Income";
            }
        }

        if (isTaxable) taxableTotal += gainOrIncome;

        return { ...tx, isTaxable, gainOrIncome, taxCategory };
    });

    // 模拟一个简单的税率
    const taxRate = config.country === "us" ? 0.25 : 0.08;
    const taxDue = taxableTotal * taxRate;

    return { analyzedTxs, taxableTotal, taxRate, taxDue };
};