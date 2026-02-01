"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/useAppStore";
import clsx from "clsx";

/* ---------------- Step Indicator ---------------- */

function StepIndicator({ step }: { step: number }) {
    const steps = ["Profile", "Analyzing", "Result"];

    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((label, i) => {
                const active = step === i + 1;
                return (
                    <div key={label} className="flex-1 text-center">
                        <div
                            className={clsx(
                                "mx-auto mb-2 h-8 w-8 rounded-full flex items-center justify-center",
                                active
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-500"
                            )}
                        >
                            {i + 1}
                        </div>
                        <p className={clsx(active && "font-medium")}>{label}</p>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------------- Step 1: Profile ---------------- */

function ProfileStep({ onNext }: { onNext: () => void }) {
    const setTaxProfile = useAppStore((s) => s.setTaxProfile);

    const [country, setCountry] = useState("");
    const [residency, setResidency] = useState("");
    const [activities, setActivities] = useState<string[]>([]);
    const [riskLevel, setRiskLevel] = useState("low");

    const toggle = (v: string) => {
        setActivities((prev) =>
            prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
        );
    };

    const submit = () => {
        setTaxProfile({ country, residency, activities, riskLevel });
        onNext();
    };

    return (
        <Card className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Tax Profile</h2>

            <Select onValueChange={setCountry}>
                <SelectTrigger>
                    <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="SG">Singapore</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={setResidency}>
                <SelectTrigger>
                    <SelectValue placeholder="Tax Residency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="non-resident">Non-resident</SelectItem>
                </SelectContent>
            </Select>

            <div className="space-y-2">
                <p className="font-medium">Activities</p>
                {["trading", "defi", "nft"].map((a) => (
                    <label key={a} className="flex items-center gap-2">
                        <Checkbox onCheckedChange={() => toggle(a)} />
                        <span className="capitalize">{a}</span>
                    </label>
                ))}
            </div>

            <RadioGroup defaultValue="low" onValueChange={setRiskLevel}>
                <p className="font-medium">Risk Preference</p>
                {["low", "medium", "high"].map((r) => (
                    <label key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} />
                        <span className="capitalize">{r}</span>
                    </label>
                ))}
            </RadioGroup>

            <Button className="w-full" onClick={submit}>
                Start Analysis
            </Button>
        </Card>
    );
}

/* ---------------- Step 2: Analyzing ---------------- */

function AnalyzeStep({ onDone }: { onDone: () => void }) {
    const setStrategies = useAppStore((s) => s.setStrategies);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Fetching on-chain data…");

    useEffect(() => {
        const steps = [
            { p: 25, m: "Categorizing transactions…" },
            { p: 50, m: "Applying tax rules…" },
            { p: 75, m: "Generating strategies…" },
            { p: 100, m: "Finalizing report…" },
        ];

        let i = 0;
        const timer = setInterval(() => {
            setProgress(steps[i].p);
            setMessage(steps[i].m);
            i++;
            if (i === steps.length) {
                clearInterval(timer);

                setStrategies([
                    {
                        id: "A",
                        title: "Conservative Strategy",
                        risk: "Low",
                        description: "Highest compliance, lowest audit risk.",
                        pros: ["Clear documentation", "Low risk"],
                        cons: ["Higher taxable amount"],
                    },
                    {
                        id: "B",
                        title: "Optimized Strategy",
                        risk: "Medium",
                        description: "Balanced tax efficiency and compliance.",
                        pros: ["Lower tax burden"],
                        cons: ["More reporting work"],
                    },
                ]);

                setTimeout(onDone, 600);
            }
        }, 700);

        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="p-6 space-y-6 animate-in fade-in">
            <h2 className="text-xl font-semibold">Analyzing</h2>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">{message}</p>
        </Card>
    );
}

/* ---------------- Step 3: Result ---------------- */

function ResultStep() {
    const strategies = useAppStore((s) => s.strategies);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            {strategies.map((s) => (
                <Card key={s.id} className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{s.title}</h3>
                        <Badge>{s.risk} Risk</Badge>
                    </div>

                    <p className="text-sm">{s.description}</p>

                    <div className="text-sm">
                        <strong>Pros:</strong>
                        <ul className="list-disc pl-5">
                            {s.pros.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-sm">
                        <strong>Cons:</strong>
                        <ul className="list-disc pl-5">
                            {s.cons.map((c) => (
                                <li key={c}>{c}</li>
                            ))}
                        </ul>
                    </div>

                    <Button variant="outline">Generate Tax Report</Button>
                </Card>
            ))}
        </div>
    );
}

/* ---------------- Main Wizard Page ---------------- */

export default function TaxWizardPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    return (
        <div className="max-w-3xl mx-auto py-12">
            <StepIndicator step={step} />

            {step === 1 && <ProfileStep onNext={() => setStep(2)} />}
            {step === 2 && <AnalyzeStep onDone={() => setStep(3)} />}
            {step === 3 && <ResultStep />}
        </div>
    );
}
