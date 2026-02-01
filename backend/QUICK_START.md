# 快速启动指南

## 🚀 5分钟快速开始

### 1. 启动后端

```bash
cd ~/projects/kite-payment

# 创建环境变量文件（如果还没有）
cp .env.example .env
# 编辑 .env，至少设置 PORT=3001

# 安装依赖（如果需要）
npm install

# 启动后端
npm start
```

后端应该运行在 `http://localhost:3001`

### 2. 启动前端

```bash
cd ~/projects/front-end

# 创建环境变量文件（如果还没有）
cp .env.example .env.local
# 确认 .env.local 中包含：
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# 安装依赖（如果需要）
npm install

# 启动前端
npm run dev
```

前端应该运行在 `http://localhost:3000`

### 3. 测试集成

1. 打开浏览器访问 `http://localhost:3000/dashboard`
2. 打开浏览器开发者工具（F12），切换到 Network 标签
3. 按照页面流程：
   - **Step 1**: 连接钱包
   - **Step 2**: 填写税务信息并保存
   - **Step 3**: 查看分析结果和策略对比
   - 点击"使用 Kite AI 支付"按钮测试支付

4. 在 Network 标签中验证：
   - ✅ `GET /api/transactions/0x...` - 获取交易数据
   - ✅ `POST /api/tax/profile` - 保存税务档案
   - ✅ `GET /api/tax/profile/0x...` - 加载税务档案
   - ✅ `POST /api/tax/analyze` - 税务分析
   - ✅ `POST /api/tax/compare-strategies` - 策略对比
   - ✅ `POST /api/tax/settle` - 支付结算
   - ✅ `POST /api/wallet/bind` - 钱包绑定

## 🔍 验证 API 是否正常工作

### 测试后端 API（使用 curl）

```bash
# 测试交易接口
curl http://localhost:3001/api/transactions/0x1234567890123456789012345678901234567890

# 测试税务分析接口
curl -X POST http://localhost:3001/api/tax/analyze \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"0x1234567890123456789012345678901234567890","strategy":"FIFO"}'

# 测试策略对比接口
curl -X POST http://localhost:3001/api/tax/compare-strategies \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"0x1234567890123456789012345678901234567890"}'
```

如果这些命令返回 JSON 数据，说明后端正常工作。

## ⚠️ 常见问题

### 端口被占用

**后端端口（3001）被占用：**
```bash
# 修改 .env 文件中的 PORT
PORT=3002

# 同时修改前端 .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

**前端端口（3000）被占用：**
```bash
# 修改 package.json 中的 dev 脚本
"dev": "next dev -p 3001"
```

### CORS 错误

如果浏览器控制台出现 CORS 错误，检查：
1. 后端是否运行在正确的端口
2. 前端 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL` 是否正确
3. 后端 `src/server.js` 中的 CORS 配置是否允许前端域名

### API 请求失败

1. **检查后端是否运行**：
   ```bash
   curl http://localhost:3001/api/tax/settle
   ```
   应该返回错误（因为缺少参数），但说明服务在运行

2. **检查前端环境变量**：
   ```bash
   # 在前端项目根目录
   cat .env.local
   ```
   确认 `NEXT_PUBLIC_API_BASE_URL` 正确

3. **检查浏览器控制台**：
   - 打开开发者工具（F12）
   - 查看 Console 和 Network 标签
   - 查看具体错误信息

## 📚 详细文档

- **集成指南**：`INTEGRATION_GUIDE.md` - 详细的阶段说明和验证方法
- **改动总结**：`CHANGES_SUMMARY.md` - 所有代码改动的详细列表

## ✅ 成功标志

如果一切正常，你应该能够：
- ✅ 在前端看到真实的后端数据（不再是硬编码）
- ✅ 在 Network 标签中看到所有 API 请求
- ✅ 保存的税务档案在刷新后仍然存在（直到后端重启）
- ✅ 切换策略时税额会变化
- ✅ 点击支付按钮会调用后端接口

---

**祝集成顺利！** 🎉
