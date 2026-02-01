import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type TaxAnalysisResult } from "@/lib/api/hooks";

type TransactionItem = {
    token: string;
    profit: number;
    amount?: number;
    timestamp?: number;
    type?: string;
};

export default function TaxResultDisplay({
    transactions,
    analyzeData,
}: {
    transactions: TransactionItem[];
    analyzeData?: TaxAnalysisResult | null;
}) {
    const totalTransactions = transactions.length;
    const totalProfit = transactions.reduce((sum, tx) => sum + (tx.profit ?? 0), 0);
    const profitableCount = transactions.filter((tx) => (tx.profit ?? 0) > 0).length;

    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount ?? 0), 0);

    return (
        <div className="space-y-6">
            {/* 汇总卡片 */}
            <div className="space-y-4">
                {/* 第一行 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                        <p className="text-xs text-zinc-300 uppercase">交易笔数</p>
                        <p className="text-2xl font-bold text-yellow-400 m-0">{totalTransactions}</p>
                    </div>
                    <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                        <p className="text-xs text-zinc-300 uppercase">总数量 (amount)</p>
                        <p className="text-2xl font-bold text-white m-0">{totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                        <p className="text-xs text-zinc-300 uppercase">资产种类</p>
                        <p className="text-2xl font-bold text-white m-0">
                            {Array.from(new Set(transactions.map((t) => t.token))).filter(Boolean).length}
                        </p>
                    </div>
                </div>
                
                {/* 第二行 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                        <p className="text-xs text-zinc-400 uppercase">总盈亏 (profit)</p>
                        <p className={`text-2xl m-0 font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                        <p className="text-xs text-zinc-400 uppercase">平均盈亏/笔</p>
                        <p className="text-2xl m-0 font-bold text-cyan-400">
                            {totalTransactions > 0 ? (totalProfit / totalTransactions).toFixed(4) : "0"}
                        </p>
                    </div>
                    {analyzeData && (
                            <div className="bg-white/5 p-4 pt-3 rounded-xl border border-white/10">
                                <p className="text-xs text-zinc-400 uppercase">税率</p>
                                <p className="m-0 text-2xl font-bold text-cyan-400">{(analyzeData.taxRate * 100).toFixed(2)}%</p>
                            </div>
                    )}

                </div>


            </div>

            {/* 交易明细 */}
            <div className="rounded-xl border border-white/5 overflow-hidden text-white">
                <Table>
                    <TableHeader className="bg-white/5 ">
                        <TableRow className="text-white">
                            <TableHead className="text-white">时间</TableHead>
                            <TableHead className="text-white">交易类型</TableHead>
                            <TableHead className="text-white">Token</TableHead>
                            <TableHead className="text-right text-white">数量</TableHead>
                            <TableHead className="text-right text-white">盈亏 (profit)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx, idx) => {
                            const profit = tx.profit ?? 0;
                            const timestampText = tx.timestamp
                                ? new Date(tx.timestamp).toLocaleString()
                                : "--";
                            return (
                                <TableRow key={`${tx.token}-${tx.timestamp ?? "na"}-${idx}`}>
                                    <TableCell className="text-xs font-mono">{timestampText}</TableCell>
                                    <TableCell className="capitalize">{tx.type ?? "--"}</TableCell>
                                    <TableCell className="font-mono">{tx.token}</TableCell>
                                    <TableCell className="text-right font-mono">{(tx.amount ?? 0).toLocaleString()}</TableCell>
                                    <TableCell className={`text-right font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                                        {profit >= 0 ? "+" : ""}{profit}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}