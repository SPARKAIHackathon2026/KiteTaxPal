/**
 * API 客户端配置
 * 统一管理后端 API 的基础 URL 和请求方法
 */

import axios, { AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof config.data === "string") {
    try {
      config.data = JSON.parse(config.data);
    } catch {
      // ignore
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<any> | undefined;
    if (data && data.success === false) {
      const message =
        (typeof data.error === "string" && data.error) ||
        (typeof (data as any).message === "string" && (data as any).message) ||
        "Request failed";
      toast.error(message);
      return Promise.reject(new Error(message));
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      (typeof data?.error === "string" && data.error) ||
      (typeof data?.message === "string" && data.message) ||
      (typeof data === "string" && data) ||
      (error.code === "ECONNABORTED" ? "Request timeout" : error.message) ||
      (status ? `HTTP error! status: ${status}` : "Network error");

    toast.error(message);

    return Promise.reject(error);
  }
);

/**
 * API 端点定义
 */
export const API_ENDPOINTS = {
  // Wallet
  WALLET_BIND: "/api/wallet/bind",
  
  // Transactions
  GET_TRANSACTIONS: (userAddress: string) => `/api/transactions/${userAddress}`,
  
  // Tax Profile
  GET_TAX_PROFILE: (userAddress: string) => `/api/tax/profile/${userAddress}`,
  SAVE_TAX_PROFILE: "/api/tax/profile",
  
  // Tax Analysis
  ANALYZE_TAX: "/api/tax/analyze",
  COMPARE_STRATEGIES: "/api/tax/compare-strategies",
  
  // Tax Settlement
  SETTLE_TAX: "/api/tax/settle",
} as const;
