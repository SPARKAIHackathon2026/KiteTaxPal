# Kite AI 自动税务结算 Agent（Payment Track Demo）

## 一、项目背景与设计动机

随着区块链与 Web3 生态的发展，链上交易呈现出 **高频化、自动化、币种高度多样化** 的趋势。对于普通用户而言：

- 单个地址可能在一个征税周期内产生 **大量交易记录**；
- 涉及 **多种加密资产**，盈亏计算复杂；
- 各国税务制度不同，人工申报成本高、出错风险大；
- 一旦申报错误，可能面临合规与监管风险。

本项目尝试回答一个现实且前沿的问题：

> **是否可以让 AI Agent 自动完成“链上税务结算 + 支付”，从而实现用户无感的合规缴税？**

在本次 **Kite AI Payment Track 黑客松** 中，我们基于 Kite AI 提供的 **Agent Account、稳定币支付与权限控制能力**，构建了一个可运行的 Demo：

- 用户授权一个 Tax Agent；
- Agent 自动分析（mock）链上交易收益；
- 根据（mock）KYC / 税务身份计算应缴税额；
- 在权限与额度控制下，**自动向税务机构地址完成链上支付**。

该项目当前为 **概念验证（PoC）/ MVP 级别实现**，重点在于跑通完整流程，而非真实税法或真实税务系统对接。

---

## 二、核心能力与黑客松赛道对齐

本项目完整命中 Kite AI Payment Track 的核心要求：

- ✅ **Agent 身份系统**：使用 Kite Agent Account 执行支付；
- ✅ **链上支付**：Agent 通过 UserOperation 发起链上转账（支持 **Kite 测试网原生 KITE 代币** 或 **测试网 USDT**，可配置）；
- ✅ **权限 / 额度控制**：白名单税务地址 + 最大缴税额度限制；
- ✅ **可复现 Demo**：提供完整后端 API 与配套前端（Next.js）。

一句话总结：

> **这是一个“以合规为目标场景”的 AI Agent 自动支付 Demo。**

---

## 三、系统整体架构

系统采用 **前后端分离** 架构：后端提供 REST API 与 Agent 支付逻辑，前端提供钱包连接、税务档案、分析报告与一键支付流程。

```
┌─────────────────────────────────────────────────────────────────┐
│  前端 (Next.js, 默认 http://localhost:3000)                        │
│  - 钱包连接 (RainbowKit)  税务档案  税务分析  策略对比  一键支付     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP (默认 baseURL: http://localhost:3001)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  后端 (Express, 默认 PORT=3000，建议与前端对接时设为 3001)          │
│  API Controller → TaxSettlementService（业务编排）                  │
│       ↓                                                           │
│  mock KYC / 交易记录 / 税额计算 / 权限校验                           │
│       ↓                                                           │
│  Kite AI Agent Account → 链上支付（KITE 或 USDT，测试网）            │
└─────────────────────────────────────────────────────────────────┘
```

- **后端**：`kite-payment`，入口 `src/app.js` 或 `npm start`，监听 `process.env.PORT`（无则 3000）。
- **前端**：`front-end`，通过 `NEXT_PUBLIC_API_BASE_URL` 指定后端地址，默认 `http://localhost:3001`。  
  若后端未设置端口，前端需将后端改为 `PORT=3001` 启动，或把前端的 `NEXT_PUBLIC_API_BASE_URL` 设为 `http://localhost:3000`。

---

## 四、支付代币说明：KITE 与 USDT 切换

### 当前默认行为（KITE 测试币）

`POST /api/tax/settle` 的链上支付逻辑在 **`src/agent/paymentAA.js`** 的 `sendPayment` 中实现：

- **代币类型**：默认使用 **Kite 测试网原生代币（KITE）**，即链上 `value` 转账（18 位小数）。
- **具体实现**：  
  - `target` = 收款地址（税务机构）；  
  - `value` = `ethers.parseEther(amount)`（原生币数量）；  
  - `callData` = `"0x"`。  

因此，当前接口是“用 KITE 测试币支付”，而不是用测试网 USDT。

### 改为使用 Kite 测试网 USDT 支付

已支持通过配置切换为 **Kite 测试网 USDT（ERC20）** 支付：

1. **配置项**（`src/config/kite.js`）  
   - `paymentToken`：`"KITE"`（默认）或 `"USDT"`；  
   - `usdtContractAddress`：Kite 测试网 USDT 合约地址（仅当 `paymentToken === "USDT"` 时必填）。

2. **环境变量（可选）**  
   - `PAYMENT_TOKEN=USDT`  
   - `KITE_TESTNET_USDT_ADDRESS=<Kite 测试网 USDT 合约地址>`

3. **逻辑说明**（`src/agent/paymentAA.js`）  
   - 当 `paymentToken === "USDT"` 时：  
     - `target` = USDT 合约地址；  
     - `value` = `"0"`；  
     - `callData` = ERC20 `transfer(收款地址, amount)` 编码（金额按 USDT 6 位小数 `parseUnits(amount, 6)`）。  
   - 当为 `"KITE"` 时，保持原有原生 KITE 转账逻辑。

4. **你需要做的**    
   - 在 `.env` 中设置 `PAYMENT_TOKEN=USDT` 和`KITE_TESTNET_USDT_ADDRESS=0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63`。

权限与额度校验（`src/agent/permission.js`）仍针对**收款地址**做白名单与金额上限检查，与使用 KITE 或 USDT 无关，无需修改。

---

## 五、项目目录结构说明

### 后端（kite-payment）

```
kite-payment/
├── index.js                    # 脚本入口（可选，用于本地测试 Agent/支付）
├── src/
│   ├── app.js                  # 后端 HTTP 服务启动入口
│   ├── server.js               # Express 应用定义（CORS、路由挂载）
│   │
│   ├── config/                 # 全局配置
│   │   ├── kite.js             # Kite 网络 / RPC / Bundler / 支付代币（KITE 或 USDT）
│   │   └── tax.js              # mock 税率、税务机构地址、最大缴税限额
│   │
│   ├── agent/                  # Kite Agent 相关逻辑
│   │   ├── agentFactory.js     # 创建 Tax Agent 的统一入口
│   │   ├── accountAA.js        # Kite Agent Account 初始化（gokite-aa-sdk）
│   │   ├── paymentAA.js        # 基于 Agent Account 的链上支付（KITE 或 USDT）
│   │   └── permission.js       # 支付白名单与额度校验
│   │
│   ├── domain/                 # 业务领域逻辑（当前多为 mock）
│   │   ├── transaction/        # 交易记录（transactionRepo.js）
│   │   ├── kyc/                # KYC（kycRepo.js）、税务档案（taxProfileRepo.js）
│   │   ├── tax/                # 税额计算（taxCalculator.js）、税务机构解析（taxResolver.js）
│   │   └── wallet/             # 钱包绑定（walletRepo.js）
│   │
│   ├── services/               # 业务编排层
│   │   └── taxSettlementService.js   # 税务结算流程：权限校验 → 调用 paymentAA 支付
│   │
│   ├── api/                    # HTTP API 层
│   │   ├── routes.js           # 路由注册
│   │   ├── tax.controller.js           # /tax/settle
│   │   ├── taxAnalysis.controller.js   # /tax/analyze
│   │   ├── taxProfile.controller.js    # /tax/profile GET & POST
│   │   ├── taxStrategy.controller.js   # /tax/compare-strategies
│   │   ├── transaction.controller.js  # /transactions/:userAddress
│   │   └── wallet.controller.js       # /wallet/bind
│   │
│   └── utils/
│       └── logger.js
│
├── .env                        # 私钥、PORT、PAYMENT_TOKEN、KITE_TESTNET_USDT_ADDRESS 等（勿提交）
├── package.json
└── README.md
```

### 前端（front-end，独立仓库/目录）

- **技术栈**：Next.js、React、Tailwind、RainbowKit（钱包）、React Query、Zustand、Motion。
- **主要页面**：首页、Dashboard（连接钱包 → 税务身份 → 智能方案 → 支付完成）、税务向导（wizard）、税表页等。
- **与后端对接**：`src/lib/api-client.ts` 配置 `baseURL`（默认 `http://localhost:3001`），`src/lib/api/hooks.ts` 封装各 API 的 React Query hooks（交易、税务档案、分析、策略对比、结算、绑定钱包）。

---

## 六、后端 API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/wallet/bind` | 绑定用户钱包与 Agent（body: `userAddress`, `agentAddress?`, `chainId?`） |
| GET  | `/api/transactions/:userAddress` | 获取用户交易列表（当前 mock） |
| GET  | `/api/tax/profile/:userAddress` | 获取用户税务档案 |
| POST | `/api/tax/profile` | 保存/更新税务档案（body: `userAddress`, `country`, `taxResidency`, `taxYear`, `name?`, `filingStatus?`） |
| POST | `/api/tax/analyze` | 税务分析（body: `userAddress`, `strategy?`，默认 FIFO） |
| POST | `/api/tax/compare-strategies` | 对比 FIFO / HIFO / LIFO 策略（body: `userAddress`） |
| POST | `/api/tax/settle` | **税务结算（链上支付）**（body: `userAddress`, `amount?`, `to?`） |

### POST /api/tax/settle 说明

- **请求体示例**：  
  `{ "userAddress": "0x...", "amount": 5, "to": "0x103034dbd47AfaeF830Df2F9147a05149992377d" }`  
  `amount`、`to` 可选；不传时使用默认金额与配置中的税务机构地址。
- **返回示例**：  
  `{ "success": true, "mode": "on-chain", "taxAmount", "authority", "txHash", "userAddress" }`  
  若 AA 钱包未部署，可能返回 `mode: "initialization-required"` 及 `aaWalletAddress`、`instruction` 等提示。

---

## 七、核心模块功能说明

### 1. Agent 层（`src/agent`）

- **accountAA.js**：使用 Kite AA SDK 创建 Agent Account，返回 `sdk` / `wallet` / `ownerAddress` / `accountAddress`。
- **paymentAA.js**：根据 `config/kite.js` 的 `paymentToken` 选择 **原生 KITE** 或 **USDT ERC20**，通过 UserOperation 完成链上支付。
- **permission.js**：支付前校验金额 > 0、不超过最大限额、收款地址在税务机构白名单内。

### 2. Domain 层（`src/domain`）

- **transactionRepo.js**：mock 链上交易列表。  
- **kycRepo.js** / **taxProfileRepo.js**：mock 或内存中的用户税务身份/档案。  
- **taxCalculator.js**：按收益与税率计算税额，支持 FIFO/HIFO/LIFO 策略。  
- **taxResolver.js**：根据 KYC/税务居民地解析税务机构与税率。  
- **walletRepo.js**：内存存储用户与 Agent 绑定关系。

### 3. Service 层（`taxSettlementService.js`）

- 确定税额与收款地址（请求参数或默认）；
- 调用 `permission.js` 做白名单与额度校验；
- 调用 `paymentAA.js` 的 `sendPayment` 执行链上支付；
- 若遇 AA 钱包未部署等错误，返回友好提示（如需先向 AA 地址转入 Gas 费）。

### 4. API 层

- 各 controller 对应上表路由，校验参数后调用 domain/service/agent，将结果以 JSON 返回。

---

## 八、如何运行与测试

### 环境要求

- Node.js（建议 18+）
- 后端：`kite-payment` 目录；前端：`front-end` 目录

### 后端

1. 在 `kite-payment` 下配置 `.env`，例如：  
   `PRIVATE_KEY=0x...`  
   可选：`PORT=3001`、`PAYMENT_TOKEN=USDT`、`KITE_TESTNET_USDT_ADDRESS=0x...`、`KITE_RPC=...`
2. 安装依赖：`npm install`
3. 启动：`npm start` 或 `node src/app.js`  
   若需与默认前端对接，请使用 `PORT=3001`。

### 前端

1. 在 `front-end` 下安装依赖：`pnpm install`（或 npm）
2. 启动：`pnpm dev`（或 `npm run dev`），默认访问 http://localhost:3000
3. 确保 `NEXT_PUBLIC_API_BASE_URL` 与后端端口一致（默认 `http://localhost:3001`）

### 接口测试示例

```bash
# 税务结算（按需修改 userAddress / amount / to）
curl -X POST http://localhost:3001/api/tax/settle \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"0xYourAddress","amount":5}'
```

---

## 九、当前状态与后续工作

### 已完成

- ✅ Agent Account 初始化（Kite AA SDK）
- ✅ 链上支付：支持 **Kite 测试网 KITE 代币** 与 **测试网 USDT**（可配置）
- ✅ mock 税务计算、策略对比与税务机构解析
- ✅ 权限与额度控制（白名单 + 最大金额）
- ✅ 完整后端 API（钱包绑定、交易、税务档案、分析、策略对比、结算）
- ✅ 前端 Dashboard：连接钱包 → 身份 → 分析 → 策略选择 → 一键支付

### 可扩展方向

- 🔄 接入真实链上 Indexer 替代 mock 交易
- 🔄 多税务身份 / 多税务机构自动拆分支付
- 🔄 更多稳定币或主网配置与汇率换算
- 🔄 合规与审计日志、前端向导与后端分析流程深度联动

---

## 十、免责声明

本项目仅为 **技术 Demo / 概念验证**，不构成任何法律、税务或合规建议。
