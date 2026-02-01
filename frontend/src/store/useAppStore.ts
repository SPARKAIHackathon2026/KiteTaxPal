import { create } from "zustand";

export type TaxProfile = {
    country: string;
    residency: string;
    activities: string[];
    riskLevel: string;
};

export type Strategy = {
    id: string;
    title: string;
    risk: "Low" | "Medium" | "High";
    description: string;
    pros: string[];
    cons: string[];
};

type AppState = {
    taxProfile: TaxProfile | null;
    strategies: Strategy[];
    setTaxProfile: (profile: TaxProfile) => void;
    setStrategies: (s: Strategy[]) => void;
};

export const useAppStore = create<AppState>((set) => ({
    taxProfile: null,
    strategies: [],
    setTaxProfile: (profile) => set({ taxProfile: profile }),
    setStrategies: (strategies) => set({ strategies }),
}));
