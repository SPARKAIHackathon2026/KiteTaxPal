"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/constants/countries";

interface TaxFormData {
    country: string;
    residency: string;
    taxYear: string;
    intent?: string;
    filingStatus?: "single" | "married";
    annualIncome?: number;
}

interface TaxFormProps {
    formData: TaxFormData;
    onFormDataChange: React.Dispatch<React.SetStateAction<TaxFormData>>;
}

export default function TaxForm({ formData, onFormDataChange }: TaxFormProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 基础信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 text-white">
                    <Label className="text-white">申报国家/地区</Label>
                    <Select value={formData.country} onValueChange={(v) => onFormDataChange({...formData, country: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                            <SelectValue placeholder="选择国家" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-gray-900 border-white/10 text-white">
                            {COUNTRIES.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 text-white">
                    <Label className="text-white">税务居民身份</Label>
                    <Select value={formData.residency} onValueChange={(v) => onFormDataChange({...formData, residency: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                            <SelectValue placeholder="选择身份" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-gray-900 border-white/10 text-white">
                            {COUNTRIES.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 text-white">
                    <Label className="text-white">报税年份</Label>
                    <Select value={formData.taxYear} onValueChange={(v) => onFormDataChange({...formData, taxYear: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                            <SelectValue placeholder="选择年份" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-gray-900 border-white/10 text-white">
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 动态逻辑：中国方案 */}
            {formData.country === "cn" && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-red-400">中国税务合规细节</h4>
                    <div className="space-y-3 ">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500">交易目的 / 身份判断</Label>
                        <RadioGroup
                            value={formData.intent}
                            onValueChange={(v) => onFormDataChange({...formData, intent: v})}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="investment" id="cn_i1" />
                                <Label htmlFor="cn_i1">长期投资 / 偶发交易</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="trading" id="cn_i2" />
                                <Label htmlFor="cn_i2">高频交易 / 营利性经营</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            )}

            {/* 动态逻辑：美国方案 */}
            {formData.country === "us" && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-blue-400">美国 IRS 合规细节</h4>
                    <div className="space-y-2 text-white">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500">报税状态 (Filing Status)</Label>
                        <RadioGroup
                            value={formData.filingStatus ?? "single"}
                            onValueChange={(v) => onFormDataChange({...formData, filingStatus: v as "single" | "married"})}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="single" id="s1" />
                                <Label className="text-white" htmlFor="s1">单身</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="married" id="s2" />
                                <Label className="text-white" htmlFor="s2">已婚联报</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500">年收入区间 (用于计算累进税率)</Label>
                        <Input
                            type="number"
                            value={formData.annualIncome ?? ""}
                            onChange={(e) => {
                                const v = e.target.value;
                                onFormDataChange({...formData, annualIncome: v === "" ? undefined : Number(v)});
                            }}
                            placeholder="预计非加密货币年收入 ($)"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 w-full"
                        />
                    </div>
                </div>
            )}

            {/* 动态逻辑：新加坡方案 */}
            {formData.country === "sg" && (
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-cyan-400">新加坡 IRAS 合规细节</h4>
                    <div className="space-y-3 text-white">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500">资产持有目的 (关键判别)</Label>
                        <RadioGroup value={formData.intent} onValueChange={(v) => onFormDataChange({...formData, intent: v})} className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="investment" id="i1" />
                                <Label className="text-white" htmlFor="i1">长期投资 (通常免资本利得税)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="trading" id="i2" />
                                <Label className="text-white" htmlFor="i2">高频营利交易 (需按所得税报税)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            )}

        </div>
    );
}