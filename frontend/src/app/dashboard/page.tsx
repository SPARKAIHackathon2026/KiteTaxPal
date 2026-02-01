"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {motion, AnimatePresence, Variants} from "motion/react";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
    Bot, Wallet, Zap,
    CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
    FileBarChart, Building2, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES } from "@/constants/countries";

import TaxResultDisplay from "@/app/dashboard/TaxResultDisplay";
import TaxForm from "@/components/TaxForm";
import Fireworks from "@/components/Fireworks";
import {
    type SettleTaxResult,
    type Transaction,
    useSaveTaxProfile,
    useSettleTax,
    useStrategyComparison,
    useTaxAnalysis,
    useTransactions,
} from "@/lib/api/hooks";
//背景组件
import FluidBackground from "@/components/FluidBackground";
import Footer from "@/app/sections/Footer";
import {useRouter} from "next/navigation";



const useMockAccount = () => {
    const { isConnected, address, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const { openConnectModal } = useConnectModal();

    const connect = () => {
        openConnectModal?.();
    };
    return { isConnected, address: address ?? null, connect, disconnect, connector };
};



export default function DashboardPage() {
    // 状态管理
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [direction, setDirection] = useState(0); // 用于控制动画方向
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const { isConnected, address, connect, disconnect, connector } = useMockAccount(); // 模拟钱包 Hook
    const [transActionData, setTransActionData] = useState<Transaction[]>([]);

    const [shouldAnalyze, setShouldAnalyze] = useState(false);
    const [shouldCompare, setShouldCompare] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [settleHistory, setSettleHistory] = useState<(SettleTaxResult & { createdAt: number })[]>([]);

    const transactionsQuery = useTransactions(address, { enabled: step === 3 });
    const taxAnalysisQuery = useTaxAnalysis(address, "FIFO", { enabled: step === 3 && shouldAnalyze });
    const strategyComparisonQuery = useStrategyComparison(address, { enabled: step === 3 && shouldCompare });
    const saveTaxProfileMutation = useSaveTaxProfile();
    const settleTaxMutation = useSettleTax();

    // 表单数据
    const [formData, setFormData] = useState({
        country: "sg",
        taxYear: "2025",
        residency: "sg",
        intent: "",
        filingStatus: "single" as "single" | "married",
        annualIncome: undefined as number | undefined,
    });

    // 分析状态
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const steps = [
        { id: 1, title: "连接钱包", icon: Wallet },
        { id: 2, title: "身份信息", icon: Building2 },
        { id: 3, title: "智能方案", icon: Bot },
        { id: 4, title: "支付完成", icon: Zap },
    ] as const;

    const maxStep = steps.length as 4;

    // 导航函数
    const nextStep = () => {
        setDirection(1);
        setStep((prev) => (prev < maxStep ? prev + 1 : prev) as 1 | 2 | 3 | 4);
    };

    const prevStep = () => {
        setDirection(-1);
        setStep((prev) => (prev > 1 ? prev - 1 : prev) as 1 | 2 | 3 | 4);
        setShowFireworks(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (step !== 3) {
            setIsAnalyzing(false);
            return;
        }

        setIsAnalyzing(
            transactionsQuery.isFetching ||
            taxAnalysisQuery.isFetching ||
            strategyComparisonQuery.isFetching
        );

        const txs =
            (transactionsQuery.data as any)?.data?.transactions ??
            (transactionsQuery.data as any)?.transactions ??
            [];
        setTransActionData(txs);
    }, [
        step,
        transactionsQuery.isFetching,
        transactionsQuery.data,
        taxAnalysisQuery.isFetching,
        strategyComparisonQuery.isFetching,
    ]);

    useEffect(() => {
        if (!strategyComparisonQuery.data) return;
        if (selectedPlan) return;
        setSelectedPlan(strategyComparisonQuery.data.recommended.toLowerCase());
    }, [strategyComparisonQuery.data, selectedPlan]);

    const handleAnalyze = async () => {
        if (!address) return;

        try {
            await saveTaxProfileMutation.mutateAsync({
                userAddress: address,
                country: formData.country,
                taxResidency: formData.residency,
                taxYear: formData.taxYear,
                filingStatus: formData.filingStatus,
                name: "",
            });
        } catch (e) {
            // ignore, toast handled globally
        }

        setShouldAnalyze(true);
        setShouldCompare(true);
        nextStep();
    };

    const handleSettleTax = async () => {
        if (!address) return;

        const amount = (strategyComparisonQuery.data?.strategies ?? [])
            .find((s) => s.strategy.toLowerCase() === selectedPlan)
            ?.taxAmount;

        try {
            // Show loading state
            setIsPaymentLoading(true);
            
            const payload = await settleTaxMutation.mutateAsync({
                userAddress: address,
                amount,
            });

            const normalized: SettleTaxResult | undefined = (payload as any)?.data?.txHash
                ? (payload as any).data
                : (payload as any)?.txHash
                    ? (payload as any)
                    : undefined;

            if (!normalized) {
                setIsPaymentLoading(false);
                return;
            }

            setSettleHistory((prev) => [{ ...normalized, createdAt: Date.now() }, ...prev]);
            setIsPaymentLoading(false);
            setShowFireworks(true);
            setDirection(1);
            setStep(4);
        } catch (e) {
            setIsPaymentLoading(false);
            // ignore, toast handled globally
        }
    };

    // 动画配置
    const variants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, type: "spring", bounce: 0.3 }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        })
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full">
                    <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">连接您的 Web3 资产</CardTitle>
                            <CardDescription>我们将扫描您的链上交易记录以计算税务基准。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isConnected ? "border-green-500/30 bg-green-500/5" : "border-white/10 bg-white/5"}`}>
                                {isConnected ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Wallet className="w-8 h-8 text-green-400" />
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <span className="text-2xl">💼</span>
                                                <h3 className="text-lg font-bold text-white">已连接至{connector?.name || "钱包"}</h3>
                                            </div>
                                            <p className="text-gray-400 font-mono text-sm">{address}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => disconnect()} className="cursor-pointer mt-2 hover:border-red-500/30 hover:text-red-400 bg-red-950/30 text-red-300">
                                            断开连接
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                                            <Wallet className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold text-gray-300">未检测到钱包</h3>
                                            <p className="text-sm text-gray-500 mt-1">请点击下方按钮连接 RainbowKit</p>
                                        </div>
                                        <Button onClick={connect} className="cursor-pointer border-none mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20">
                                            <span className="mr-2">🌈</span> Connect Wallet
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-4">
                            <Button
                                onClick={nextStep}
                                disabled={!isConnected}
                                className={`px-8 border-none ${isConnected ? "bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer" : "cursor-not-allowed bg-gray-800 text-gray-500 "}`}
                            >
                                下一步 <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            );
        }

        if (step === 2) {
            return (
                <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full">
                    <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">完善税务身份</CardTitle>
                            <CardDescription>不同的国家/地区适用不同的税收政策，AI 将为您自动匹配。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <TaxForm
                                formData={formData}
                                onFormDataChange={(newData) => {
                                    setFormData(newData);
                                }}
                            />

                            <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-200">
                                    不用担心，您的隐私数据将存储在本地，仅用于 AI 本地计算生成报表，不会上传至中央服务器。
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4">
                            <Button variant="ghost" onClick={prevStep} className="cursor-pointer border-none text-gray-400 hover:text-white hover:bg-white/10">
                                <ArrowLeft className="mr-2 w-4 h-4" /> 上一步
                            </Button>
                            <Button
                                onClick={handleAnalyze}
                                disabled={!formData.country || !formData.residency || !formData.taxYear}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 cursor-pointer border-none"
                            >
                                开始 AI 分析 <Bot className="ml-2 w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            );
        }

        if (step === 3) {
            return (
                <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full">
                    <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                        {isAnalyzing ? (
                            <div className="h-[500px] flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-white">AI 正在扫描链上数据...</h3>
                                    <p className="text-gray-400 font-mono text-sm">
                                        Parsing tx history for {address}... <br/>
                                        Matching {formData.country} tax regulations...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                                                <FileBarChart className="w-6 h-6 text-cyan-400" />
                                                税务分析报告 ({formData.taxYear})
                                            </CardTitle>
                                            <CardDescription>
                                                基于您在 <span className="text-cyan-400 font-medium">{COUNTRIES.find(c => c.value === formData.country)?.label.split('(')[1]?.replace(')', '') || formData.country}</span> 的税务身份分析
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-900/20">
                                            可优化
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <TaxResultDisplay
                                        transactions={transActionData}
                                        analyzeData={(taxAnalysisQuery.data as any)?.data ?? (taxAnalysisQuery.data as any) ?? null}
                                    />
                                    <Separator className="bg-white/10" />

                                    <div className="space-y-3">
                                        <div className="text-lg text-white font-bold flex items-center gap-2">

                                            <Bot className="w-4 h-4 text-cyan-400"/>选择申报策略
                                            <a 
                                                href="/fifo" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors "
                                                title="了解FIFO、LIFO、HIFO计价方法的区别"
                                            >
                                                <HelpCircle className="w-4 h-4" />
                                            </a>

                                        </div>

                                        {strategyComparisonQuery.isFetching ? (
                                            <div className="text-center py-8 text-gray-400">加载策略数据...</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {(strategyComparisonQuery.data?.strategies ?? []).map((strategy) => {
                                                    const isRecommended =
                                                        strategyComparisonQuery.data?.recommended === strategy.strategy;
                                                    const isSelected = selectedPlan === strategy.strategy.toLowerCase();

                                                    return (
                                                        <div
                                                            key={strategy.strategy}
                                                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-white/5 ${
                                                                isSelected
                                                                    ? isRecommended
                                                                        ? "border-green-500 bg-green-950/10"
                                                                        : "border-cyan-500 bg-cyan-950/10"
                                                                    : "border-white/10"
                                                            }`}
                                                            onClick={() => setSelectedPlan(strategy.strategy.toLowerCase())}
                                                        >
                                                            {isRecommended && (
                                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                                    Recommended
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-bold text-white">{strategy.strategy}</span>
                                                                {isSelected && (
                                                                    <CheckCircle2 className={`w-4 h-4 ${isRecommended ? "text-green-500" : "text-cyan-500"}`}/>
                                                                )}
                                                            </div>
                                                            <div className="text-lg font-bold text-white">
                                                                ${strategy.taxAmount.toFixed(2).toLocaleString()}
                                                                <span className="text-xs text-gray-500 font-normal"> 税费</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 mt-1">
                                                                Capital Gains: {strategy.capitalGains.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between pt-4 bg-white/5 border-t border-white/10">
                                    <Button variant="outline" onClick={prevStep} className="cursor-pointer text-blue-500 border-none ">
                                        重新填写
                                    </Button>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 m-0">预计需缴税款</p>
                                            <div className="text-xl font-bold text-white">
                                                {(() => {
                                                    const amount = (strategyComparisonQuery.data?.strategies ?? [])
                                                        .find((s) => s.strategy.toLowerCase() === selectedPlan)
                                                        ?.taxAmount;
                                                    return typeof amount === "number" ? `$${amount.toFixed(2).toLocaleString()}` : "--";
                                                })()}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleSettleTax}
                                            disabled={settleTaxMutation.isPending}
                                            className="cursor-pointer border-none bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-12 px-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                        >
                                            <Zap className="mr-2 w-4 h-4 fill-yellow-400 text-yellow-400" /> 使用 Kite AI 支付
                                        </Button>
                                    </div>
                                </CardFooter>
                            </>
                        )}
                    </Card>
                </motion.div>
            );
        }

        return (
            <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full">
                <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            已成功提交
                        </CardTitle>
                        <CardDescription>以下为本次会话内成功提交的历史记录。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {settleHistory.length === 0 ? (
                            <div className="text-gray-400">暂无记录</div>
                        ) : (
                            <div className="space-y-3">
                                {settleHistory.map((item) => (
                                    <div
                                        key={`${item.txHash}-${item.createdAt}`}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-300 mb-10">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-400">交易哈希</div>
                                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-950/20 px-2 py-1 mb-2">
                                                    <Link 
                                                        href={`https://testnet.kitescan.ai/tx/${item.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-mono text-blue-300 underline cursor-pointer"
                                                    >
                                                        {item.txHash}
                                                    </Link>
                                                </Badge>

                                                <div className="text-xs text-gray-400">用户地址</div>
                                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-950/20 px-2 py-1 mb-2">
                                                    <Link
                                                        href={`https://testnet.kitescan.ai/address/${item.userAddress}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-mono border-green-500/30 text-green-400 underline cursor-pointer"
                                                    >
                                                        {item.userAddress}
                                                    </Link>
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400">税额</div>
                                                <div className="text-lg font-bold text-white">${item.taxAmount.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2 flex-wrap">
                                            <Badge variant="outline" className="border-white/10 text-gray-300 px-2 py-1 ">
                                                    {item.authority}
                                            </Badge>
                                            <div>
                                                <Badge variant="outline" className="border-white/10 text-gray-300 px-2 py-1">
                                                    {item.mode}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4 bg-white/5 border-t border-white/10">
                        <Button variant="ghost" onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer text-blue-400 border-none bg-transparent hover:bg-white">
                            返回报告
                        </Button>
                        <Button
                            onClick={() => {
                                setShouldAnalyze(false);
                                setShouldCompare(false);
                                setSelectedPlan("");
                                setDirection(-1);
                                setStep(1);
                            }}
                            className=" cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-black px-8 border-none"
                        >
                            重新开始
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-black text-white font-sans relative overflow-hidden flex flex-col">
            {/* 背景 */}
            <div className="fixed inset-0 z-0">
                <FluidBackground />
            </div>

            {/* 顶部导航 */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl h-16 flex items-center justify-between">
                <div className="cursor-pointer flex items-center gap-4"  onClick={() => router.push('/')}>

                    <div className="w-8 h-8 rounded-lg bg-[#3898EC] flex items-center justify-center group-hover:glow-blue transition-all ml-6">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-bold text-lg transition-colors text-white`}>
                        KiteTax
                        <span className="text-[#3898EC]"> Pal</span>
                    </span>
                </div>

                <div className="flex items-center gap-3 mr-6">
                    {isConnected ? (
                        <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-950/20 px-3 py-1 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            {address}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-gray-500/50 text-gray-400 px-3 py-1">
                            未连接钱包
                        </Badge>
                    )}
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-24 pb-10 px-4 w-full max-w-4xl mx-auto">

                {/* 步骤进度条 */}
                <div className="w-full mb-12 relative px-10">
                    <div className="absolute top-1/3 left-0 w-full h-1 bg-white/10 -translate-y-1/2 -z-10"></div>
                    {/* 动态进度条 */}
                    <motion.div
                        className="absolute top-1/3 left-0 h-1 bg-cyan-500 -translate-y-1/2 -z-10 origin-left"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step - 1) / (maxStep - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    ></motion.div>

                    <div className="flex justify-between">
                        {steps.map((item) => {
                            const isActive = step >= item.id;
                            return (
                                <div key={item.id} className="flex flex-col items-center gap-2  px-2">
                                    <motion.div
                                        animate={{
                                            backgroundColor: isActive ? "#06b6d4" : "#171717",
                                            color: isActive ? "#000" : "#6b7280",
                                            borderColor: isActive ? "#06b6d4" : "#404040"
                                        }}
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {step > item.id && (
                                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-black" />
                                            </div>
                                        )}
                                    </motion.div>
                                    <span className={`text-xs font-medium ${isActive ? "text-cyan-400" : "text-gray-600"}`}>
                                {item.title}
                            </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 核心卡片区域 */}
                <div className="w-full max-w-2xl perspective-1000">
                    <AnimatePresence custom={direction} mode="wait">

                        {renderStep()}
                    </AnimatePresence>
                </div>

                {/* Payment Loading Overlay */}
                {isPaymentLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
                    >
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">正在处理税务支付</h3>
                                <p className="text-gray-400 text-sm">Kite AI 正在为您完成合规税务流程</p>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { label: "分析链上应税明细", status: "complete" },
                                    { label: "正在通过 Kite AI 代理", status: "loading" },
                                    { label: "生成合规性证明 (CARF Standard)", status: "pending" },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                            item.status === "complete" ? "bg-green-500" :
                                            item.status === "loading" ? "bg-cyan-500 animate-pulse" :
                                            "bg-gray-600"
                                        }`}>
                                            {item.status === "complete" && (
                                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {item.status === "loading" && (
                                                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            )}
                                        </div>
                                        <span className={`text-sm ${
                                            item.status === "complete" ? "text-green-400" :
                                            item.status === "loading" ? "text-cyan-400" :
                                            "text-gray-500"
                                        }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
            
            {/* Fireworks Animation */}
            <Fireworks trigger={showFireworks} />
            
            {/* Footer */}
            <Footer />
        </div>
    );
}