"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import FlowingWaveCanvas from "@/components/3d/FlowingWave";

export default function LandingPage() {
    return (
        <main className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* WebGL 背景 */}
            <FlowingWaveCanvas />

            {/* 遮罩层：增加文字可读性，模仿 FunGui 的柔和对比度 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none z-[1]" />

            {/* 内容层 */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="p-8 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 animate-pulse" />
                        <span>KiteTax<span className="opacity-50">.ai</span></span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                        <a href="#" className="hover:text-white transition-colors">Governance</a>
                        <a href="#" className="hover:text-white transition-colors">Docs</a>
                    </nav>
                </header>

                <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tight mb-6">
                            SMOOTH AS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
                LIQUID ASSETS.
              </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
                            基于 Kite AI 的流体式税务解决方案。
                        </p>

                        <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
                           自动化、智能化，让 Web3 合规像水流一样顺畅。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="cursor-pointer h-16 px-10 rounded-full bg-white text-black hover:bg-pink-100 font-bold text-lg group transition-all">
                                    进入控制台
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="https://docs.gokite.ai">
                                <Button variant="outline" size="lg" className="cursor-pointer text-black h-16 px-10 rounded-full border-white/20 backdrop-blur-md bg-white/10 text-lg">
                                    了解 Kite AI 集成
                                </Button>
                            </Link>

                        </div>
                    </motion.div>
                </section>

                {/* 底部装饰：极简风格 */}
                <footer className="p-8 flex flex-col md:flex-row justify-between items-end gap-4 text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <div className="flex gap-10">
                        <div className="space-y-1">
                            <p>Built for</p>
                            <p className="text-white/80 font-bold">Kite AI Ecosystem</p>
                        </div>
                        <div className="space-y-1">
                            <p>Protocol</p>
                            <p className="text-white/80 font-bold">ERC-TAX-2026</p>
                        </div>
                    </div>
                    <p>© 2026 RESN-STYLE TAX AGENT</p>
                </footer>
            </div>
        </main>
    );
}