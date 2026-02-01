# KiteTax Pal
> Web3 自动化税务合规智能体 - 让复杂税务合规变得简单透明

<div align="center">
  <img src="/public/home.png" alt="KiteTax Pal - Web3 自动化税务合规智能体" width="800"/>
</div>


## 📋 项目概述

KiteTax Pal 是基于 Kite AI 基础设施构建的 Web3 自动化税务合规解决方案，致力于将复杂的税务合规从"事后被动应对"转变为"交易发生时主动完成"，实现用户"无感"的自动报税体验。

### 🎯 核心价值

- **实时合规**：交易发生时自动完成税务计算与申报
- **无感体验**：用户无需专业知识，系统自动处理复杂税务逻辑
- **全球框架**：为 2026 年全球 CARF 监管框架做好准备
- **高准确率**：99.9% 计算准确率，<1s 实时响应

## 🌐 商业背景

随着全球加密货币监管日趋严格，特别是 2026 年 CARF（加密资产报告框架）的全面实施，Web3 用户面临着前所未有的税务合规挑战：

- **监管压力**：全球 50+ 主要国家已建立加密货币税务监管框架
- **计算复杂**：多币种、跨链、DeFi 协议等场景税务计算极其复杂
- **合规成本**：传统税务服务成本高昂，且缺乏 Web3 专业能力
- **风险隐患**：错误申报可能导致法律风险和财务损失

KiteTax Pal 应运而生，为 Web3 用户提供专业、高效、低成本的税务合规解决方案。

## ⚡ 核心功能

### 🔍 多源数据对账
穿透式整合碎片化的链上交易数据，自动识别并归类多币种、跨链交易，构建完整的税务数据视图。

### 🧮 确定性逻辑计税
利用经过审计的确定性算法自动完成计税，确保每一笔交易的税务计算准确无误，避免人工计算的错误风险。

### 🛡️ 受控自主支付
严格遵循"最小授权"与"白名单支付"原则，用户仅需授权专用纳税钱包，智能体自动将税金划转至官方验证地址。

### 📄 不可篡改凭证
生成不可篡改的链上交易记录作为完税凭证，所有税务数据永久保存在区块链上，随时可供审计查验。

### 💰 多币种支持
支持 BTC、ETH、USDT 等主流加密货币及各类 DeFi 代币，自动获取实时汇率，精确计算法币等值税额。

### 🌍 全球合规框架
为 2026 年全球 CARF 监管框架做好准备，实时更新各国税务法规，确保您的资产在透明监管中安全流动。

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 16.1.6 (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 4.x + 自定义设计系统
- **UI 组件**: Radix UI + shadcn/ui
- **状态管理**: Zustand
- **动画**: GSAP + Framer Motion
- **3D 渲染**: Three.js + React Three Fiber

### Web3 集成
- **钱包连接**: RainbowKit + Wagmi
- **智能合约交互**: Viem
- **MetaMask 集成**: MetaMask SDK

### 数据处理
- **HTTP 客户端**: Axios
- **数据验证**: Zod
- **表单处理**: React Hook Form + @hookform/resolvers

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + TypeScript
- **构建优化**: Next.js React Compiler
- **样式处理**: PostCSS + Tailwind CSS

## 🚀 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- pnpm 8.x 或更高版本

### 安装依赖
```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境启动
```bash
# 启动开发服务器
pnpm dev

# 或使用其他包管理器
npm run dev
yarn dev
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 代码检查
```bash
# 运行 ESLint 检查
pnpm lint
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── sections/          # 页面区块组件
│   │   ├── Hero.tsx       # 首页英雄区域
│   │   ├── Features.tsx   # 功能特性展示
│   │   ├── Team.tsx       # 团队介绍
│   │   └── ...
│   ├── dashboard/         # 税务仪表板
│   ├── kitetax/          # KiteTax 主要功能
│   └── ...
├── components/            # 可复用组件
│   ├── ui/               # 基础 UI 组件
│   ├── FluidBackground.tsx # 3D 流体背景
│   └── ...
├── lib/                  # 工具库和配置
│   ├── api/             # API 客户端
│   └── ...
├── store/               # 状态管理
└── types/               # TypeScript 类型定义
```

## 🔧 配置说明

### Tailwind CSS 自定义主题
项目使用自定义的 Tailwind 配置，包含：
- 品牌色彩系统 (#3898EC 为主色调)
- 自定义动画效果
- 响应式设计断点
- 玻璃态效果样式

## 🧪 核心算法

### 税务计算引擎
支持：
- **美国税务**: 资本利得税 + 普通收入税
- **新加坡税务**: 投资意图区分 + 交易所得税
- **多国支持**: 可扩展的税务规则框架

### 数据处理流程
1. **数据采集**: 多源链上数据聚合
2. **交易分类**: AI 驱动的交易类型识别
3. **税务计算**: 确定性算法计算应纳税额
4. **合规检查**: 多维度合规性验证
5. **自动申报**: 链上完税凭证生成

## 🎨 设计系统

### 视觉风格
- **主色调**: 科技蓝 (#3898EC)
- **背景**: 深色主题 + 3D 流体效果
- **交互**: 玻璃态卡片 + 平滑动画
- **字体**: Inter 字体系统

### 响应式设计
- 移动端优先设计理念
- 支持桌面、平板、手机全设备适配
- 流体布局自适应不同屏幕尺寸

## 🔒 安全特性

- **最小授权原则**: 仅请求必要的钱包权限
- **白名单支付**: 税金只能划转至官方验证地址
- **数据加密**: 敏感数据端到端加密
- **审计追踪**: 所有操作链上可查

## 🌟 性能优化

- **代码分割**: Next.js 自动代码分割
- **图片优化**: Next.js Image 组件优化
- **缓存策略**: 智能缓存机制
- **懒加载**: 组件和资源按需加载

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **项目主页**: [https://github.com/SPARKAIHackathon2026/front-end](https://github.com/SPARKAIHackathon2026/front-end)

---

**让 Web3 税务合规变得简单透明** 🚀
