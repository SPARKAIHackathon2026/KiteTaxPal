"use client";

import React, { useRef } from "react";
import FlowingLiquid from "@/components/3d/FlowingLiquid";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Zap, Globe2, Wallet, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// --- 1. 走马灯组件 ---
const Marquee = () => {
    return (
        <div className="w-full bg-blue-950/80 border-y border-white/10 backdrop-blur-sm overflow-hidden py-3 z-20 relative">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            >
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-12 px-6 items-center">
            <span className="text-white/80 font-mono text-sm tracking-widest uppercase">
              KiteTax Pal: AI-Driven Compliance Agent
            </span>
                        <span className="text-cyan-400 font-bold text-sm">
              基于 Kite AI 的自动化税务合规智能体
            </span>
                        <span className="text-pink-500 font-mono text-xs">
              CARF 2026 READY
            </span>
                        <span className="text-white/80 font-mono text-sm tracking-widest uppercase">
              Multi-source Reconciliation
            </span>
                        <span className="text-cyan-400 font-bold text-sm">
              多源数据对账 • 确定性逻辑计税 • 受控自主支付
            </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// --- 2. 优势数据 ---
const features = [
    {
        title: "Multi-Source Reconciliation",
        titleCn: "多源数据穿透对账",
        desc: "整合碎片化链上交易，穿透式清洗 Defi、NFT 及跨链行为，告别手工账单。",
        icon: Globe2,
        color: "text-blue-400",
        imgPlaceholder: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" // 实际应使用 Web3 数据流图片
    },
    {
        title: "Deterministic Tax Logic",
        titleCn: "确定性逻辑计税",
        desc: "基于经过审计的确定性算法，自动匹配 CARF 监管框架，杜绝计算误差。",
        icon: FileText,
        color: "text-pink-400",
        imgPlaceholder: "linear-gradient(135deg, #371126 0%, #000000 100%)"
    },
    {
        title: "Controlled Auto-Payment",
        titleCn: "受控自主支付",
        desc: "遵循“最小授权”与“白名单”原则，智能体仅从纳税专用钱包自动划转税金。",
        icon: Wallet,
        color: "text-cyan-400",
        imgPlaceholder: "linear-gradient(135deg, #083344 0%, #000000 100%)"
    },
    {
        title: "Invisible Compliance",
        titleCn: "无感自动报税",
        desc: "从“事后应对”转向“交易即合规”。避免高频交易导致的人工税务灾难。",
        icon: Zap,
        color: "text-white",
        imgPlaceholder: "linear-gradient(135deg, #171717 0%, #404040 100%)"
    },
    {
        title: "CARF 2026 Ready",
        titleCn: "全球监管护航",
        desc: "专为 2026 年全球 CARF 监管框架设计，生成不可篡改的链上完税凭证。",
        icon: ShieldCheck,
        color: "text-green-400",
        imgPlaceholder: "linear-gradient(135deg, #022c22 0%, #000000 100%)"
    },
    {
        title: "Secure Isolation",
        titleCn: "资产绝对隔离",
        desc: "主资产与纳税资金物理隔离，确保智能体权限受限，资金在透明监管中安全流动。",
        icon: Lock,
        color: "text-yellow-400",
        imgPlaceholder: "linear-gradient(135deg, #422006 0%, #000000 100%)"
    }
];

// --- 3. 团队数据 ---
const team = [
    { name: "Alex Chen", role: "Lead Architect", avatar: "AC" },
    { name: "Sarah Li", role: "Tax Logic Expert", avatar: "SL" },
    { name: "Mike Wang", role: "Smart Contract Lead", avatar: "MW" },
    { name: "Kite Bot", role: "AI Agent", avatar: "AI" },
];

export default function Home() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref });

    return (
        <motion.div ref={ref} className="relative min-h-screen font-sans selection:bg-pink-500/30">

            {/* 3D 背景层 */}
            <FlowingLiquid />

            {/* 遮罩层：确保文字可读 */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

            {/* 顶部导航占位 */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="text-2xl font-bold tracking-tighter italic text-white flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500 rotate-45" />
                    KiteTax<span className="text-pink-500">Pal</span>
                </div>
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 rounded-none pixel-border">
                    Launch App
                </Button>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-5xl"
                >
                    <Badge className="bg-white/10 text-cyan-300 hover:bg-white/20 border-cyan-500/30 mb-4 px-4 py-1 backdrop-blur-md">
                        Powered by Kite AI Infrastructure
                    </Badge>

                    <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        WEB3 TAX <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
              AUTOPILOT
            </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                        把复杂的税务合规从“事后被动应对”转变为“交易时主动完成”。
                        <br className="hidden md:block"/>
                        让资产在透明监管中<span className="text-cyan-400 font-bold">安全流动</span>。
                    </p>

                    <div className="flex gap-6 justify-center mt-10">
                        <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white border-2 border-transparent hover:border-white transition-all h-14 px-8 text-lg font-bold rounded-sm shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                            Connect Wallet <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white h-14 px-8 text-lg rounded-sm backdrop-blur-sm">
                            Read Whitepaper
                        </Button>
                    </div>
                </motion.div>

                {/* 走马灯位于 Hero 底部 */}
                <div className="absolute bottom-0 w-full">
                    <Marquee />
                </div>
            </section>

            {/* Content Section */}
            <div className="relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-20">

                {/* Pain Points / Advantages Title */}
                <div className="py-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Built for the <span className="text-pink-500">2026 CARF</span> Era
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto px-4">
                        KiteTax Pal 解决了 Web3 链上多币种、高频交易导致的人工计算难度大、易出错的痛点。
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden h-full rounded-xl">
                                {/* 模拟图片区域 */}
                                <div
                                    className="h-48 w-full relative overflow-hidden"
                                    style={{ background: item.imgPlaceholder }}
                                >
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    {/* 装饰性网格 */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                </div>

                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <h4 className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
                                            {item.titleCn}
                                        </h4>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="mt-32 px-6 max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1" />
                        <h2 className="text-2xl font-mono text-cyan-400 uppercase tracking-widest">
                            Core Builders
                        </h2>
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-10">
                        {team.map((member, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 group">
                                <div className="relative p-1 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                                    <div className="bg-black rounded-full p-1">
                                        <Avatar className="w-24 h-24 border-2 border-white/10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`} />
                                            <AvatarFallback>{member.avatar}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold">{member.name}</p>
                                    <p className="text-xs text-cyan-400 font-mono">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 border-t border-white/10 py-10 text-center text-gray-600 text-sm">
                    <p>© 2026 KiteTax Pal. Powered by Kite AI Infrastructure.</p>
                </footer>

            </div>
        </motion.div>
    );
}