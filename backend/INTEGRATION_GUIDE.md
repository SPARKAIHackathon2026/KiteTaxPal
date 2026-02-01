# 前后端集成指南

本文档说明如何将 `front-end` 和 `kite-payment` 两个项目集成，逐步替换前端硬编码数据为真实后端 API。

## 📋 目录

1. [环境配置](#环境配置)
2. [阶段1：交易数据接口](#阶段1交易数据接口)
3. [阶段2：税务档案管理](#阶段2税务档案管理)
4. [阶段3：税务分析接口](#阶段3税务分析接口)
5. [阶段4：策略对比接口](#阶段4策略对比接口)
6. [阶段5：支付集成](#阶段5支付集成)
7. [验证方法](#验证方法)

---

## 环境配置

### 后端配置

1. 进入后端目录：
   ```bash
   cd ~/projects/kite-payment
   ```

2. 复制环境变量文件：
   ```bash
   cp .env.example .env
   ```

3. 编辑 `.env`，填入必要的配置（至少设置 `PORT=3001`）

4. 启动后端：
   ```bash
   npm start
   # 或
   node src/app.js
   ```

   后端应该运行在 `http://localhost:3001`

### 前端配置

1. 进入前端目录：
   ```bash
   cd ~/projects/front-end
   ```

2. 复制环境变量文件：
   ```bash
   cp .env.example .env.local
   ```

3. 确认 `.env.local` 中包含：
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

4. 启动前端：
   ```bash
   npm run dev
   ```

   前端应该运行在 `http://localhost:3000`

---

## 阶段1：交易数据接口

### 后端改动

**新增文件：**
- `src/api/transaction.controller.js` - 交易数据控制器

**修改文件：**
- `src/api/routes.js` - 添加 `GET /api/transactions/:userAddress` 路由
- `src/domain/transaction/transactionRepo.js` - 增强返回数据结构

### 前端改动

**新增文件：**
- `src/lib/api-client.ts` - API 客户端
- `src/lib/api/hooks.ts` - React Query hooks

**修改文件：**
- `src/app/dashboard/page.tsx` - 集成 `useTransactions` hook

### 验证方法

1. **启动前后端服务**

2. **打开浏览器开发者工具（Network 标签）**

3. **访问前端页面** `http://localhost:3000/dashboard`

4. **连接钱包**（Step 1）

5. **填写税务信息**（Step 2）

6. **进入 Step 3（分析页面）**

7. **验证：**
   - 在 Network 标签中应该看到请求：`GET http://localhost:3001/api/transactions/0x...`
   - 响应应该包含 `{ success: true, transactions: [...], count: 5 }`
   - 页面上的"交易笔数"应该显示为 `5`（而不是硬编码的 `1,240`）

**如果失败：**
- 检查后端是否运行在 3001 端口
- 检查前端 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL`
- 检查浏览器控制台是否有 CORS 错误（如果是，需要在后端添加 CORS 中间件）

---

## 阶段2：税务档案管理

### 后端改动

**新增文件：**
- `src/api/taxProfile.controller.js` - 税务档案控制器
- `src/domain/kyc/taxProfileRepo.js` - 税务档案存储

**修改文件：**
- `src/api/routes.js` - 添加 `GET /api/tax/profile/:userAddress` 和 `POST /api/tax/profile` 路由

### 前端改动

**修改文件：**
- `src/app/dashboard/page.tsx` - 集成 `useTaxProfile` 和 `useSaveTaxProfile` hooks

### 验证方法

1. **清空浏览器缓存或使用无痕模式**

2. **访问前端页面** `http://localhost:3000/dashboard`

3. **连接钱包**（Step 1）

4. **在 Step 2 填写税务信息：**
   - 姓名：`Test User`
   - 国家：`Singapore`
   - 税年：`2024`

5. **点击"开始 AI 分析"按钮**

6. **验证：**
   - 在 Network 标签中应该看到：`POST http://localhost:3001/api/tax/profile`
   - 请求体应该包含：`{ userAddress: "0x...", name: "Test User", country: "sg", ... }`
   - 响应应该包含：`{ success: true, profile: {...} }`

7. **刷新页面，重新连接钱包**

8. **验证：**
   - 在 Network 标签中应该看到：`GET http://localhost:3001/api/tax/profile/0x...`
   - Step 2 的表单应该自动填充之前保存的数据

---

## 阶段3：税务分析接口

### 后端改动

**新增文件：**
- `src/api/taxAnalysis.controller.js` - 税务分析控制器

**修改文件：**
- `src/api/routes.js` - 添加 `POST /api/tax/analyze` 路由
- `src/domain/tax/taxCalculator.js` - 添加 `calculateTaxWithStrategy` 函数支持策略

### 前端改动

**修改文件：**
- `src/app/dashboard/page.tsx` - 集成 `useTaxAnalysis` hook，替换硬编码的分析结果

### 验证方法

1. **访问前端页面，完成 Step 1 和 Step 2**

2. **进入 Step 3（分析页面）**

3. **验证：**
   - 在 Network 标签中应该看到：`POST http://localhost:3001/api/tax/analyze`
   - 请求体应该包含：`{ userAddress: "0x...", strategy: "FIFO" }`
   - 响应应该包含：
     ```json
     {
       "success": true,
       "transactionCount": 5,
       "totalVolume": 2600,
       "estimatedCapitalGains": 900,
       "taxAmount": 180,
       "strategy": "FIFO"
     }
     ```
   - 页面上的"交易笔数"、"总交易量"、"预估资本利得"应该显示为后端返回的值

4. **切换策略（点击 FIFO/HIFO/LIFO）**

5. **验证：**
   - 每次切换应该触发新的 `POST /api/tax/analyze` 请求
   - 请求体中的 `strategy` 字段应该对应选中的策略
   - 税额应该根据策略不同而变化

---

## 阶段4：策略对比接口

### 后端改动

**新增文件：**
- `src/api/taxStrategy.controller.js` - 策略对比控制器

**修改文件：**
- `src/api/routes.js` - 添加 `POST /api/tax/compare-strategies` 路由

### 前端改动

**修改文件：**
- `src/app/dashboard/page.tsx` - 集成 `useStrategyComparison` hook，替换硬编码的策略卡片

### 验证方法

1. **访问前端页面，完成 Step 1 和 Step 2**

2. **进入 Step 3（分析页面）**

3. **验证：**
   - 在 Network 标签中应该看到：`POST http://localhost:3001/api/tax/compare-strategies`
   - 请求体应该包含：`{ userAddress: "0x..." }`
   - 响应应该包含：
     ```json
     {
       "success": true,
       "strategies": [
         { "strategy": "FIFO", "taxAmount": 180, "capitalGains": 900 },
         { "strategy": "HIFO", "taxAmount": 153, "capitalGains": 765 },
         { "strategy": "LIFO", "taxAmount": 162, "capitalGains": 810 }
       ],
       "recommended": "HIFO"
     }
     ```
   - 三个策略卡片应该显示后端返回的税额
   - HIFO 卡片应该显示 "Best Value" 标签（如果它是 recommended）

4. **切换策略选择**

5. **验证：**
   - 底部"预计需缴税款"应该更新为选中策略的税额
   - 不需要重新请求 API（数据已缓存）

---

## 阶段5：支付集成

### 后端改动

**修改文件：**
- `src/api/tax.controller.js` - 已存在，无需修改
- `src/api/wallet.controller.js` - 修复导入问题

### 前端改动

**修改文件：**
- `src/app/dashboard/page.tsx` - 集成 `useSettleTax` 和 `useBindWallet` hooks

### 验证方法

1. **访问前端页面，完成 Step 1、Step 2、Step 3**

2. **选择一个策略（如 HIFO）**

3. **点击"使用 Kite AI 支付"按钮**

4. **验证：**
   - 在 Network 标签中应该看到：`POST http://localhost:3001/api/tax/settle`
   - 请求体应该包含：`{ userAddress: "0x...", amount: 153 }`（对应选中策略的税额）
   - 响应可能有两种情况：
     - **成功支付**：`{ success: true, mode: "on-chain", txHash: "0x...", ... }`
     - **需要初始化**：`{ success: true, mode: "initialization-required", aaWalletAddress: "0x...", instruction: "..." }`

5. **验证支付状态显示：**
   - 如果成功：显示"支付成功 ✓"，显示交易哈希
   - 如果需要初始化：显示黄色提示框，包含初始化说明和地址

6. **验证钱包绑定：**
   - 连接钱包后，在 Network 标签中应该看到：`POST http://localhost:3001/api/wallet/bind`
   - 请求体应该包含：`{ userAddress: "0x..." }`

---

## 常见问题排查

### CORS 错误

如果浏览器控制台出现 CORS 错误，需要在后端添加 CORS 中间件：

**修改 `src/server.js`：**
```javascript
import express from "express";
import cors from "cors"; // 需要安装: npm install cors
import routes from "./api/routes.js";

const app = express();

app.use(cors()); // 添加这行
app.use(express.json());
app.use("/api", routes);

export default app;
```

### 端口冲突

- **后端端口**：默认 3001，可在 `.env` 中修改 `PORT`
- **前端端口**：默认 3000，可在 `package.json` 中修改 `"dev": "next dev -p 3000"`

### API 请求失败

1. 检查后端是否运行：访问 `http://localhost:3001/api/tax/settle`（应该返回错误，但说明服务在运行）
2. 检查前端环境变量：确认 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL` 正确
3. 检查浏览器控制台：查看具体错误信息

### 数据不更新

- React Query 默认缓存数据，如果后端数据更新但前端没变化，可以：
  - 刷新页面
  - 在浏览器开发者工具中清除缓存
  - 修改 hooks 中的 `staleTime` 配置

---

## 下一步优化建议

1. **真实链上数据**：将 `transactionRepo.js` 中的 mock 数据替换为真实的链上查询
2. **数据库存储**：将内存存储（Map）替换为数据库（如 MongoDB、PostgreSQL）
3. **错误处理**：添加更完善的错误处理和用户提示
4. **加载状态**：优化加载状态的 UI 展示
5. **数据验证**：添加请求参数验证（使用 Joi 或 Zod）
6. **API 文档**：使用 Swagger/OpenAPI 生成 API 文档

---

## 总结

通过以上5个阶段的集成，前端已经：
- ✅ 从后端获取交易数据
- ✅ 保存和加载税务档案
- ✅ 使用后端进行税务分析
- ✅ 对比不同策略的税额
- ✅ 调用后端支付接口

所有硬编码的数据都已替换为真实的后端 API 调用！
