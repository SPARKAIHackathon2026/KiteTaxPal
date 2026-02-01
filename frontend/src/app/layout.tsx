'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base, sepolia,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '6e66c10a608549958c19daea5e502d9c',
    chains: [mainnet, sepolia,polygon, optimism, arbitrum, base],
    ssr: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased m-0`}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                  {children}
                  <Toaster />
              </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
      </html>
  );
}
