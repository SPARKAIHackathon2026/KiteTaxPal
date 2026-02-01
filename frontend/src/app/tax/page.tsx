// 单页 Wizard 重构版（去掉中间 Analyzing 页，明确身份与钱包状态）
// 技术栈：Next.js + React + Tailwind + Framer Motion

'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// ---------------- types ----------------
type Step = 1 | 2 | 3

interface UserProfile {
    nationality: string
    workCountry: string
    taxResident: string
}

// ---------------- main ----------------
export default function TaxWizard() {
    const [step, setStep] = useState<Step>(1)
    const [walletConnected, setWalletConnected] = useState(false)
    const [profile, setProfile] = useState<UserProfile>({
        nationality: '',
        workCountry: '',
        taxResident: '',
    })

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-xl shadow-xl rounded-2xl">
                <CardContent className="p-8 space-y-6">
                    <Progress value={(step / 3) * 100} />

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepIdentity
                                key="step1"
                                profile={profile}
                                setProfile={setProfile}
                                walletConnected={walletConnected}
                                onConnectWallet={() => setWalletConnected(true)}
                                onNext={() => setStep(2)}
                            />
                        )}

                        {step === 2 && (
                            <StepAnalyze
                                key="step2"
                                onBack={() => setStep(1)}
                                onNext={() => setStep(3)}
                            />
                        )}

                        {step === 3 && (
                            <StepResult
                                key="step3"
                                onBack={() => setStep(2)}
                            />
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}

// ---------------- Step 1 ----------------
interface StepIdentityProps {
    profile: UserProfile
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>
    walletConnected: boolean
    onConnectWallet: () => void
    onNext: () => void
}

function StepIdentity({
    profile,
    setProfile,
    walletConnected,
    onConnectWallet,
    onNext,
}: StepIdentityProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-semibold">身份 & 钱包</h2>

            <Input label="国籍" value={profile.nationality} onChange={(v: string) => setProfile({ ...profile, nationality: v })} />
            <Input label="工作国家 / 地区" value={profile.workCountry} onChange={(v: string) => setProfile({ ...profile, workCountry: v })} />
            <Input label="税务居民国家" value={profile.taxResident} onChange={(v: string) => setProfile({ ...profile, taxResident: v })} />

            <div className="flex items-center justify-between pt-4">
                {walletConnected ? (
                    <span className="text-green-600 text-sm">✅ 钱包已连接</span>
                ) : (
                    <Button variant="outline" onClick={onConnectWallet}>连接钱包</Button>
                )}

                <Button onClick={onNext} disabled={!walletConnected}>下一步</Button>
            </div>
        </motion.div>
    )
}

// ---------------- Step 2 ----------------
interface StepAnalyzeProps {
    onBack: () => void
    onNext: () => void
}

function StepAnalyze({ onBack, onNext }: StepAnalyzeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold">链上数据分析</h2>

            <p className="text-sm text-gray-500">正在分析你的钱包交易、DeFi 活动和 NFT 行为…</p>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="h-2 bg-blue-500 rounded"
            />

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={onBack}>返回</Button>
                <Button onClick={onNext}>查看报税建议</Button>
            </div>
        </motion.div>
    )
}

// ---------------- Step 3 ----------------
interface StepResultProps {
    onBack: () => void
}

function StepResult({ onBack }: StepResultProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-semibold">报税方案建议</h2>

            <ul className="text-sm list-disc pl-5 space-y-2">
                <li>主要税务辖区：日本</li>
                <li>应申报类型：Crypto Capital Gains</li>
                <li>推荐方式：自行申报 + Kite AI 自动填表</li>
            </ul>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={onBack}>返回修改</Button>
                <Button>确认并交给 AI 报税</Button>
            </div>
        </motion.div>
    )
}

// ---------------- small input ----------------
interface InputProps {
    label: string
    value: string
    onChange: (value: string) => void
}

function Input({ label, value, onChange }: InputProps) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input
                className="w-full border rounded px-3 py-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
