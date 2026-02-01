/**
 * React Query hooks for API calls
 * 使用 @tanstack/react-query 管理 API 状态
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, type ApiResponse, API_ENDPOINTS } from "../api-client";

// ==================== Types ====================

export interface Transaction {
  token: string;
  profit: number;
  amount?: number;
  timestamp?: number;
  type?: string;
}

export interface TaxProfile {
  userAddress: string;
  country: string;
  taxResidency: string;
  taxYear: string;
  name?: string;
  filingStatus?: string;
  updatedAt?: string;
}

export interface TaxAnalysisResult {
  transactionCount: number;
  totalVolume: number;
  estimatedCapitalGains: number;
  taxAmount: number;
  strategy: string;
  authority: string;
  taxRate: number;
}

export interface StrategyComparison {
  strategy: string;
  taxAmount: number;
  capitalGains: number;
}

export interface CompareStrategiesResult {
  strategies: StrategyComparison[];
  recommended: string;
}

export interface SettleTaxResult {
  success: boolean;
  mode: "on-chain" | "initialization-required";
  taxAmount: number;
  authority: string;
  txHash: string;
  userAddress: string;
  aaWalletAddress?: string;
  message?: string;
  instruction?: string;
}

// ==================== Query Keys ====================

export const queryKeys = {
  transactions: (address: string) => ["transactions", address],
  taxProfile: (address: string) => ["taxProfile", address],
  taxAnalysis: (address: string, strategy: string) => ["taxAnalysis", address, strategy],
  strategyComparison: (address: string) => ["strategyComparison", address],
} as const;

// ==================== Hooks ====================

/**
 * 获取交易列表
 */
export function useTransactions(
  userAddress: string | null,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: queryKeys.transactions(userAddress || ""),
    queryFn: async () => {
      if (!userAddress) throw new Error("userAddress is required");
      const res = await axiosInstance.get<
        ApiResponse<{ transactions: Transaction[]; count: number }>
      >(API_ENDPOINTS.GET_TRANSACTIONS(userAddress));
      return res.data;
    },
    enabled: !!userAddress && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取税务档案
 */
export function useTaxProfile(userAddress: string | null) {
  return useQuery({
    queryKey: queryKeys.taxProfile(userAddress || ""),
    queryFn: async () => {
      if (!userAddress) throw new Error("userAddress is required");
      const res = await axiosInstance.get<ApiResponse<{ profile: TaxProfile }>>(
        API_ENDPOINTS.GET_TAX_PROFILE(userAddress)
      );
      return res.data;
    },
    enabled: !!userAddress,
    retry: false, // 如果不存在，不重试
  });
}

/**
 * 保存税务档案
 */
export function useSaveTaxProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Partial<TaxProfile> & { userAddress: string }) => {
      const res = await axiosInstance.post<ApiResponse<{ profile: TaxProfile }>>(
        API_ENDPOINTS.SAVE_TAX_PROFILE,
        profile
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      // 更新缓存
      queryClient.setQueryData(
        queryKeys.taxProfile(variables.userAddress),
        data
      );
    },
  });
}

/**
 * 分析税务
 */
export function useTaxAnalysis(
  userAddress: string | null,
  strategy: string = "FIFO",
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: queryKeys.taxAnalysis(userAddress || "", strategy),
    queryFn: async () => {
      if (!userAddress) throw new Error("userAddress is required");
      const res = await axiosInstance.post<ApiResponse<TaxAnalysisResult>>(
        API_ENDPOINTS.ANALYZE_TAX,
        { userAddress, strategy }
      );
      return res.data;
    },
    enabled: !!userAddress && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 对比策略
 */
export function useStrategyComparison(
  userAddress: string | null,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: queryKeys.strategyComparison(userAddress || ""),
    queryFn: async () => {
      if (!userAddress) throw new Error("userAddress is required");
      const res = await axiosInstance.post<
        ApiResponse<CompareStrategiesResult> | (CompareStrategiesResult & { success: boolean })
      >(
        API_ENDPOINTS.COMPARE_STRATEGIES,
        { userAddress }
      );

      const payload: any = res.data;
      const normalized: CompareStrategiesResult | undefined = payload?.strategies
        ? {
            strategies: payload.strategies,
            recommended: payload.recommended,
          }
        : payload?.data?.strategies
          ? {
              strategies: payload.data.strategies,
              recommended: payload.data.recommended,
            }
          : undefined;

      if (!normalized) {
        throw new Error("Invalid strategy comparison response");
      }

      return normalized;
    },
    enabled: !!userAddress && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 结算税务（支付）
 */
export function useSettleTax() {
  return useMutation({
    mutationFn: async (params: {
      userAddress: string;
      amount?: number;
      to?: string;
    }) => {
      const res = await axiosInstance.post<ApiResponse<SettleTaxResult>>(
        API_ENDPOINTS.SETTLE_TAX,
        params
      );
      return res.data;
    },
  });
}

/**
 * 绑定钱包
 */
export function useBindWallet() {
  return useMutation({
    mutationFn: async (params: {
      userAddress: string;
      agentAddress?: string;
      chainId?: number;
    }) => {
      const res = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
        API_ENDPOINTS.WALLET_BIND,
        params
      );
      return res.data;
    },
  });
}
