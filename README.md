# KiteTax Pal — 项目总体说明

> **KiteTax Pal** 是基于 Kite AI 的 Web3 自动化税务合规与链上支付 Demo，参与 **Kite AI 支付赛道（Payment Track）**。本文档为项目总体说明，涵盖前后端架构、功能、环境搭建与运行步骤。


### Demo可运行地址：[KiteTax Pal官网](https://front-end-mu-ten-40.vercel.app)
---

## 一、项目简介

### 1.1 项目名称与定位

- **项目名称**：KiteTax Pal  
- **定位**：AI Agent 驱动的链上税务结算与自动支付 Demo（PoC / MVP）  
- **赛道**：Kite AI — 支付（Payment Track）  
- **仓库结构**：  
  - **后端**：`kite-payment`（Express + Kite AA SDK）  
  - **前端**：`front-end`（Next.js + RainbowKit + React Query）

### 1.2 一句话总结

> 用户连接钱包、填写税务身份后，由 **Kite Agent** 自动完成链上交易分析（mock）、税额计算、策略对比，并在 **权限与额度控制** 下，向白名单税务机构地址发起 **真实/测试网链上支付**（KITE 或 USDT 可配置），实现「创建 Agent → 发起支付 → 成功到账」的完整闭环。

---

## 二、黑客松赛道要求对应

### 2.1 赛道目标与技术使用范围

| 赛道要求 | 本项目实现 |
|----------|------------|
| **AI 智能体在链上完成真实或测试网稳定币支付** | ✅ 使用 Kite Agent Account 通过 UserOperation 在 Kite 测试网完成链上支付；支持 **Kite 测试网原生 KITE 代币** 或 **测试网 USDT（ERC20）**，可通过配置切换。 |
| **展示自动化结算与基础风控能力** | ✅ 后端根据用户地址、税务身份与策略自动完成税额计算与结算；支付前进行白名单与最大金额校验（`permission.js`）。 |
| **基于 Kite AI 文档完成集成** | ✅ 使用官方 **gokite-aa-sdk** 创建 Agent Account、发送 UserOperation，网络与 Bundler 配置符合 Kite 文档。 |
| **至少使用以下能力之一** | ✅ **Agent 身份系统** + **稳定币/链上支付** + **支付权限/额度控制** + **官方 SDK** 均已使用。 |

### 2.2 新人入门最低实现要求（获奖门槛）

| 项目 | 要求 | 本项目 |
|------|------|--------|
| **链上支付** | 至少完成 1 笔真实或测试网稳定币转账 | ✅ `POST /api/tax/settle` 调用 Kite AA SDK 在测试网发起链上转账（KITE 或 USDT）；前端「使用 Kite AI 支付」按钮触发该流程。 |
| **Agent 身份** | 使用 Kite Agent 或身份体系 | ✅ 使用 **Kite Agent Account**（`accountAA.js` + `agentFactory.js`），由 SDK 根据 owner 私钥派生 AA 钱包并执行支付。 |
| **权限控制** | 设置基础支付额度/规则 | ✅ 白名单税务机构地址（`config/tax.js`）+ 最大缴税金额上限（如 1000）+ 支付前校验（`permission.js`）。 |
| **可复现性** | 提供完整运行说明或演示 | ✅ 本文档及子项目 README 提供环境搭建、配置与运行步骤；可选提供演示视频或在线 Demo。 |

### 2.3 作品提交规范对应

- **项目代码仓库**：后端 `kite-payment`、前端 `front-end`（可为同一 monorepo 下两个目录或两个独立仓库）。  
- **项目说明文档（README）**：本文档（总体）+ `kite-payment/README.md`（后端）+ `front-end/README.md`（前端），包含环境搭建、运行步骤、核心功能说明。  
- **演示视频或 Demo 链接**：可选，建议录制「连接钱包 → 填写身份 → 查看分析 → 一键支付」全流程。

---

## 三、项目背景与设计动机

随着区块链与 Web3 生态发展，链上交易呈现 **高频化、自动化、币种多样化** 的特点，用户面临：

- 单地址在征税周期内 **交易记录众多**；  
- **多资产** 盈亏计算复杂；  
- 各国税务制度不同，人工申报成本高、出错风险大；  
- 申报错误可能带来合规与监管风险。

KiteTax Pal 尝试回答：

> **能否让 AI Agent 自动完成「链上税务结算 + 支付」，实现用户无感的合规缴税？**

在 Kite AI Payment Track 中，我们基于 **Agent Account、链上支付与权限控制** 实现：

- 用户授权一个 **Tax Agent**；  
- Agent 自动分析（当前为 mock）链上交易收益；  
- 根据（mock）KYC/税务身份计算应缴税额；  
- 在 **白名单 + 额度** 控制下，自动向税务机构地址完成链上支付。

当前为 **概念验证（PoC）/ MVP**，重点在于跑通「创建 Agent → 发起支付 → 成功到账」流程，而非对接真实税法或税务系统。

---

## 四、系统架构

### 4.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│  前端 front-end (Next.js)  默认 http://localhost:3000                │
│  - 钱包连接 (RainbowKit)  税务档案  税务分析  策略对比  一键支付       │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP  (默认 baseURL: http://localhost:3001)
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  后端 kite-payment (Express)  建议 PORT=3001 与前端对接                │
│  API 路由 → Controller → Service / Domain → Agent                     │
│  - mock 交易/KYC/税务计算  权限校验  Kite Agent Account 链上支付      │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Kite AA SDK (UserOperation)
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Kite 测试网 — 链上支付（KITE 或 USDT）                                │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 后端（kite-payment）分层

- **API 层**：`src/api/routes.js` + 各 `*.controller.js`，处理 HTTP 请求与参数校验。  
- **Service 层**：`src/services/taxSettlementService.js`，编排结算流程（权限校验 → 调用 Agent 支付）。  
- **Domain 层**：`src/domain/` — 交易、KYC/税务档案、税额计算、税务机构解析、钱包绑定（当前多为 mock/内存）。  
- **Agent 层**：`src/agent/` — Kite Agent Account 创建、链上支付（KITE 或 USDT）、支付权限与额度校验。  
- **Config**：`src/config/kite.js`（网络、RPC、Bundler、支付代币类型与 USDT 合约）、`tax.js`（税率、税务机构白名单、最大金额）。

### 4.3 前端（front-end）与后端对接

- **API 客户端**：`src/lib/api-client.ts`，`baseURL` 默认 `http://localhost:3001`，由 `NEXT_PUBLIC_API_BASE_URL` 覆盖。  
- **数据请求**：`src/lib/api/hooks.ts` 使用 React Query 封装：交易列表、税务档案、税务分析、策略对比、结算支付、钱包绑定等。  
- **主流程页**：`src/app/dashboard/page.tsx` — 四步流程（连接钱包 → 身份信息 → 智能方案 → 支付完成），直接调用上述 API。

---

## 五、核心功能说明

### 5.1 后端核心能力

| 能力 | 说明 |
|------|------|
| **Agent 身份与支付** | 使用 `gokite-aa-sdk` 创建 Agent Account，通过 UserOperation 在 Kite 测试网发起转账（原生 KITE 或 ERC20 USDT）。 |
| **权限与额度控制** | 仅允许向 `config/tax.js` 中配置的税务机构地址付款；单笔金额不得超过 `maxTaxPayment`（如 1000）。 |
| **税务分析** | 基于 mock 交易与用户税务档案，按 FIFO/HIFO/LIFO 策略计算税额与资本利得（`taxCalculator.js` + `taxResolver.js`）。 |
| **REST API** | 钱包绑定、交易列表、税务档案 CRUD、税务分析、策略对比、税务结算（链上支付）。 |

### 5.2 前端核心能力

| 能力 | 说明 |
|------|------|
| **钱包连接** | RainbowKit + Wagmi，支持常见钱包连接与链上身份。 |
| **税务档案** | 填写/保存国家、税务居民地、税年等，与后端 `POST/GET /api/tax/profile` 同步。 |
| **分析与策略** | 请求后端分析接口与策略对比接口，展示交易笔数、税额、资本利得及 FIFO/HIFO/LIFO 推荐。 |
| **一键支付** | 「使用 Kite AI 支付」触发 `POST /api/tax/settle`，展示交易哈希或「需初始化 AA 钱包」等提示。 |
| **页面结构** | 首页、Dashboard（主流程）、税务向导（wizard）、税表页、kitetax 等（见 `src/app/`）。 |

### 5.3 支付代币：KITE 与 USDT

- **默认**：使用 Kite 测试网 **原生 KITE 代币**（18 位小数，`value` 转账）。  
- **可选**：通过配置切换为 Kite 测试网 **USDT（ERC20）**：  
  - 后端 `kite-payment`：在 `.env` 中设置 `PAYMENT_TOKEN=USDT` 和 `KITE_TESTNET_USDT_ADDRESS=0x...`（或于 `src/config/kite.js` 中配置）。  
  - 逻辑在 `src/agent/paymentAA.js`：当 `paymentToken === "USDT"` 时，对 USDT 合约调用 `transfer(收款地址, amount)`（6 位小数）。  

具体说明见 `kite-payment/README.md` 第四节。

---

## 六、技术栈概览

### 6.1 后端（kite-payment）

- **运行环境**：Node.js（建议 18+），ES Module。  
- **框架**：Express。  
- **核心依赖**：`gokite-aa-sdk`、`ethers`、`dotenv`。  
- **入口**：`src/app.js`，监听 `process.env.PORT`（默认 3000，与前端对接建议 3001）。

### 6.2 前端（front-end）

- **框架**：Next.js（App Router）、React、TypeScript。  
- **样式**：Tailwind CSS。  
- **Web3**：RainbowKit、Wagmi、Viem。  
- **数据与状态**：React Query（API）、Zustand、Axios。  
- **UI 与动效**：Radix UI、Motion 等。  
- **开发**：pnpm/npm，默认端口 3000。

---

## 七、项目目录结构（概要）

```
projects/
├── README.md                 # 本文件 — KiteTax Pal 总体说明
├── kite-payment/              # 后端
│   ├── src/
│   │   ├── app.js             # 服务入口
│   │   ├── server.js          # Express 应用与 CORS
│   │   ├── config/            # kite.js, tax.js
│   │   ├── agent/             # Agent Account、支付、权限
│   │   ├── api/               # 路由与 Controller
│   │   ├── domain/            # 交易、KYC、税务、钱包
│   │   └── services/          # taxSettlementService
│   ├── .env                   # 私钥、PORT、支付代币等（勿提交）
│   ├── package.json
│   └── README.md              # 后端详细说明
│
└── front-end/                 # 前端
    ├── src/
    │   ├── app/               # 页面：dashboard, home, tax, wizard, kitetax 等
    │   ├── components/        # UI 与业务组件
    │   ├── lib/               # api-client, api/hooks
    │   └── store/
    ├── .env.local             # NEXT_PUBLIC_API_BASE_URL 等（可选）
    ├── package.json
    └── README.md              # 前端详细说明
```

更细的目录与 API 列表见 `kite-payment/README.md` 与 `front-end/README.md`。

---

## 八、环境搭建与配置

### 8.1 环境要求

- **Node.js**：18.x 或更高（前后端通用）。  
- **包管理**：后端 `npm`；前端 `pnpm` 或 `npm`。

### 8.2 后端（kite-payment）初始化与配置

1. **进入目录**
   ```bash
   cd ~/projects/kite-payment
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境变量**  
   在项目根目录创建 `.env`（勿提交到版本库），至少包含：
   - `PRIVATE_KEY=0x...` — 用于 Kite Agent Account 的 owner 私钥（测试网建议使用测试钱包）。  
   - `PORT=3001` — 与前端默认 `NEXT_PUBLIC_API_BASE_URL` 一致时使用 3001。  

   可选：
   - `PAYMENT_TOKEN=USDT` — 使用 USDT 支付时填写。  
   - `KITE_TESTNET_USDT_ADDRESS=0x...` — Kite 测试网 USDT 合约地址（使用 USDT 时必填）。  
   - `KITE_RPC=...` — 覆盖默认 RPC（如需要）。

4. **启动**
   ```bash
   npm start
   # 或
   node src/app.js
   ```
   服务默认监听 `http://localhost:3001`（若 `PORT=3001`）。

### 8.3 前端（front-end）初始化与配置

1. **进入目录**
   ```bash
   cd ~/projects/front-end
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或 npm install
   ```

3. **环境变量（可选）**  
   在项目根目录创建 `.env.local`，用于覆盖默认后端地址：
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```
   若后端使用其他端口或域名，在此修改。

4. **启动**
   ```bash
   pnpm dev
   # 或 npm run dev
   ```
   浏览器访问 `http://localhost:3000`。

---

## 九、运行步骤与验证

### 9.1 推荐启动顺序

1. 先启动 **后端**（`kite-payment`），确认无报错、监听端口正确。  
2. 再启动 **前端**（`front-end`），确认能打开首页与 Dashboard。

### 9.2 完整流程验证（与赛道「创建 Agent → 发起支付 → 成功到账」对应）

1. 打开 `http://localhost:3000/dashboard`。  
2. **Step 1**：连接钱包（RainbowKit）。  
3. **Step 2**：填写税务身份（国家、税务居民地、税年等）并保存。  
4. **Step 3**：等待分析完成，查看交易笔数、税额与 FIFO/HIFO/LIFO 策略对比，选择一档税额。  
5. 点击 **「使用 Kite AI 支付」**：  
   - 后端会创建/使用 Kite Agent Account 并发起链上支付；  
   - 成功则返回 `txHash`，前端展示；  
   - 若 AA 钱包未部署，会返回 `mode: "initialization-required"` 及说明，按提示向 AA 地址转入 Gas 后可再次支付。  
6. **Step 4**：查看支付结果与历史记录。

### 9.3 接口自测（可选）

```bash
# 后端健康/接口可达（会因缺参数返回错误，但说明服务在运行）
curl -X POST http://localhost:3001/api/tax/settle -H "Content-Type: application/json" -d '{}'

# 税务结算（替换为实际地址）
curl -X POST http://localhost:3001/api/tax/settle \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"0xYourAddress","amount":5}'
```

更多接口说明与示例见 `kite-payment/README.md` 与 `kite-payment/QUICK_START.md`。

---

## 十、常见问题

- **端口**：前端默认 3000，后端建议 3001；若修改后端端口，需同步修改前端 `NEXT_PUBLIC_API_BASE_URL`。  
- **CORS**：后端 `server.js` 已允许 `http://localhost:3000`，若前端端口或域名变更，需在后端调整 CORS 配置。  
- **支付失败**：检查 `.env` 中 `PRIVATE_KEY` 与网络；若为 USDT，确认 `KITE_TESTNET_USDT_ADDRESS` 正确且 AA 钱包有足够 USDT 与 Gas。  
- **前端请求 404/网络错误**：确认后端已启动且 `NEXT_PUBLIC_API_BASE_URL` 与后端地址一致。

更详细的排查见 `kite-payment/QUICK_START.md` 与 `kite-payment/INTEGRATION_GUIDE.md`。

---

## 十一、相关文档索引

| 文档 | 说明 |
|------|------|
| **本 README** | KiteTax Pal 总体说明、赛道对应、架构、配置与运行。 |
| `kite-payment/README.md` | 后端详细说明：API、支付代币（KITE/USDT）、目录结构、运行与测试。 |
| `kite-payment/QUICK_START.md` | 后端与前端快速启动、验证步骤、常见问题。 |
| `kite-payment/INTEGRATION_GUIDE.md` | 前后端接口对接与分阶段验证说明。 |
| `front-end/README.md` | 前端技术栈、功能、目录与运行说明。 |

---

## 十二、免责声明

本项目为 **技术 Demo / 概念验证**，不构成任何法律、税务或合规建议。链上支付使用测试网与测试代币，请勿将私钥或主网资产用于未审核环境。

---

**KiteTax Pal** — 让 AI Agent 完成链上税务结算与支付，跑通「创建 Agent → 发起支付 → 成功到账」全流程。
