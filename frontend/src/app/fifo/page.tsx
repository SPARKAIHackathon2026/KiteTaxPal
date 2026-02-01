'use client';
import { useState } from 'react';

export default function AccountingMethodsPage() {
    // 折叠面板状态管理
    const [expanded, setExpanded] = useState<string | null>('fifo');

    const toggleExpand = (method: string) => {
        setExpanded(expanded === method ? null : method);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            {/* 顶部导航栏 */}
            <nav className="bg-blue-600 text-white py-4 px-6 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">库存计价方法科普：HIFO/FIFO/LIFO</h1>
                    <div className="flex space-x-4">
                        <a href="#fifo" className="hover:text-blue-200 transition-colors">FIFO</a>
                        <a href="#lifo" className="hover:text-blue-200 transition-colors">LIFO</a>
                        <a href="#hifo" className="hover:text-blue-200 transition-colors">HIFO</a>
                        <a href="#comparison" className="hover:text-blue-200 transition-colors">对比总结</a>
                    </div>
                </div>
            </nav>

            {/* 主内容区 */}
            <main className="max-w-6xl mx-auto py-8 px-4 md:px-6">
                {/* 引言部分 */}
                <section className="mb-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">什么是库存计价方法？</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        在会计、库存管理和加密货币交易等场景中，当同一类资产（如商品、代币）有多个不同的买入价格时，
                        计算「卖出成本」和「利润」需要遵循特定规则——这就是「库存计价方法」。
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        常见的三大核心方法：<span className="font-semibold text-blue-600">FIFO（先进先出）</span>、
                        <span className="font-semibold text-orange-600">LIFO（后进先出）</span>、
                        <span className="font-semibold text-green-600">HIFO（最高入价先出）</span>，
                        它们直接影响成本核算、税务申报和利润表现。
                    </p>
                </section>

                {/* 三大方法详情 */}
                <section className="grid gap-6 mb-12">
                    {/* FIFO 部分 */}
                    <div
                        id="fifo"
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div
                            className="p-6 cursor-pointer flex justify-between items-center bg-blue-50"
                            onClick={() => toggleExpand('fifo')}
                        >
                            <h3 className="text-xl font-bold text-blue-700 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">1</span>
                                FIFO：先进先出（First-In, First-Out）
                            </h3>
                            <span className="text-blue-600">
                {expanded === 'fifo' ? '收起 ▲' : '展开 ▼'}
              </span>
                        </div>

                        {expanded === 'fifo' && (
                            <div className="p-6 border-t border-gray-100">
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold mb-2 text-gray-800">核心定义</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        按「买入顺序」计价：最早买入的资产，优先被视为「已卖出」，卖出成本按最早的买入价格计算。
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold mb-3 text-gray-800">原理图解</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                            <div className="text-center">
                                                <div className="bg-blue-100 p-3 rounded border border-blue-200 mb-2">买入1：10件 × 10元 = 100元（最早）</div>
                                                <div className="bg-blue-100 p-3 rounded border border-blue-200 mb-2">买入2：8件 × 12元 = 96元</div>
                                                <div className="bg-blue-100 p-3 rounded border border-blue-200">买入3：5件 × 15元 = 75元（最晚）</div>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-400">→</div>
                                            <div className="text-center">
                                                <div className="bg-green-100 p-3 rounded border border-green-200">卖出12件 → 优先扣除「买入1全部+买入2部分」</div>
                                                <div className="text-gray-600 mt-2">卖出成本 = (10×10) + (2×12) = 124元</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold mb-3 text-gray-800">实际例子（咖啡店库存）</h4>
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-3 text-left">日期</th>
                                            <th className="border border-gray-300 p-3 text-left">操作</th>
                                            <th className="border border-gray-300 p-3 text-left">数量（包）</th>
                                            <th className="border border-gray-300 p-3 text-left">单价（元）</th>
                                            <th className="border border-gray-300 p-3 text-left">库存余量（包）</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                            <td className="border border-gray-300 p-3">1月1日</td>
                            <td className="border border-gray-300 p-3">买入</td>
                            <td className="border border-gray-300 p-3">10</td>
                            <td className="border border-gray-300 p-3">50</td>
                            <td className="border border-gray-300 p-3">10</td>
                            </tr>
                            <tr>
                            <td className="border border-gray-300 p-3">1月5日</td>
                            <td className="border border-gray-300 p-3">买入</td>
                            <td className="border border-gray-300 p-3">8</td>
                            <td className="border border-gray-300 p-3">55</td>
                            <td className="border border-gray-300 p-3">18</td>
                            </tr>
                            <tr>
                            <td className="border border-gray-300 p-3">1月10日</td>
                            <td className="border border-gray-300 p-3">卖出</td>
                            <td className="border border-gray-300 p-3">12</td>
                            <td className="border border-gray-300 p-3">按FIFO：10×50 + 2×55</td>
                            <td className="border border-gray-300 p-3">6</td>
                            </tr>
                            </tbody>
                            </table>
                            <p className="text-gray-600 mt-3 text-sm">
                            卖出成本 = 10×50 + 2×55 = 610元 → 利润 = 卖出收入 - 610元
                            </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="text-lg font-semibold mb-2 text-green-700">优点</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>符合实际货物流转逻辑（如生鲜、保质期短的商品）</li>
                            <li>库存价值接近当前市场价格（期末库存是较新买入的资产）</li>
                            <li>国际财务报告准则（IFRS）和中国会计准则均允许</li>
                            </ul>
                            </div>
                            <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="text-lg font-semibold mb-2 text-red-700">缺点</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>通胀时期，早期买入成本低 → 利润偏高 → 缴纳更多所得税</li>
                            <li>价格波动大时，成本核算与当前市场成本偏差较大</li>
                            </ul>
                            </div>
                            </div>
                            </div>
                            )}
</div>

{/* LIFO 部分 */}
<div
    id="lifo"
    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
>
    <div
        className="p-6 cursor-pointer flex justify-between items-center bg-orange-50"
        onClick={() => toggleExpand('lifo')}
    >
        <h3 className="text-xl font-bold text-orange-700 flex items-center">
            <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center mr-3">2</span>
            LIFO：后进先出（Last-In, First-Out）
        </h3>
        <span className="text-orange-600">
                {expanded === 'lifo' ? '收起 ▲' : '展开 ▼'}
              </span>
    </div>

    {expanded === 'lifo' && (
        <div className="p-6 border-t border-gray-100">
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">核心定义</h4>
                <p className="text-gray-700 leading-relaxed">
                    按「买入逆序」计价：最晚买入的资产，优先被视为「已卖出」，卖出成本按最新的买入价格计算。
                </p>
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">原理图解</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="text-center">
                            <div className="bg-orange-100 p-3 rounded border border-orange-200 mb-2">买入1：10件 × 10元 = 100元（最早）</div>
                            <div className="bg-orange-100 p-3 rounded border border-orange-200 mb-2">买入2：8件 × 12元 = 96元</div>
                            <div className="bg-orange-100 p-3 rounded border border-orange-200">买入3：5件 × 15元 = 75元（最晚）</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-400">→</div>
                        <div className="text-center">
                            <div className="bg-green-100 p-3 rounded border border-green-200">卖出12件 → 优先扣除「买入3全部+买入2全部+买入1部分」</div>
                            <div className="text-gray-600 mt-2">卖出成本 = (5×15) + (8×12) + (1×10) = 181元</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">实际例子（咖啡店库存）</h4>
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left">日期</th>
                        <th className="border border-gray-300 p-3 text-left">操作</th>
                        <th className="border border-gray-300 p-3 text-left">数量（包）</th>
                        <th className="border border-gray-300 p-3 text-left">单价（元）</th>
                        <th className="border border-gray-300 p-3 text-left">库存余量（包）</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td className="border border-gray-300 p-3">1月1日</td>
        <td className="border border-gray-300 p-3">买入</td>
        <td className="border border-gray-300 p-3">10</td>
        <td className="border border-gray-300 p-3">50</td>
        <td className="border border-gray-300 p-3">10</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3">1月5日</td>
        <td className="border border-gray-300 p-3">买入</td>
        <td className="border border-gray-300 p-3">8</td>
        <td className="border border-gray-300 p-3">55</td>
        <td className="border border-gray-300 p-3">18</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3">1月10日</td>
        <td className="border border-gray-300 p-3">卖出</td>
        <td className="border border-gray-300 p-3">12</td>
        <td className="border border-gray-300 p-3">按LIFO：8×55 + 4×50</td>
        <td className="border border-gray-300 p-3">6</td>
        </tr>
        </tbody>
        </table>
        <p className="text-gray-600 mt-3 text-sm">
        卖出成本 = 8×55 + 4×50 = 640元 → 利润 = 卖出收入 - 640元（比FIFO少30元）
        </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="text-lg font-semibold mb-2 text-green-700">优点</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>通胀时期，最新买入成本高 → 利润偏低 → 缴纳更少所得税（税务优化）</li>
        <li>卖出成本接近当前市场价格，匹配当期收入与成本</li>
        </ul>
        </div>
        <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100">
        <h4 className="text-lg font-semibold mb-2 text-red-700">缺点</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>不符合实际货物流转逻辑（很少有企业先卖最新进货）</li>
        <li>期末库存价值偏低（剩余的是早期低价资产）</li>
        <li>国际财务报告准则（IFRS）禁止使用，仅美国GAAP允许</li>
        </ul>
        </div>
        </div>
        </div>
        )}
        </div>

        {/* HIFO 部分 */}
        <div
        id="hifo"
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
        <div
        className="p-6 cursor-pointer flex justify-between items-center bg-green-50"
        onClick={() => toggleExpand('hifo')}
        >
        <h3 className="text-xl font-bold text-green-700 flex items-center">
        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mr-3">3</span>
        HIFO：最高入价先出（Highest-In, First-Out）
        </h3>
        <span className="text-green-600">
        {expanded === 'hifo' ? '收起 ▲' : '展开 ▼'}
        </span>
        </div>

        {expanded === 'hifo' && (
        <div className="p-6 border-t border-gray-100">
        <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">核心定义</h4>
        <p className="text-gray-700 leading-relaxed">
        按「买入价格从高到低」计价：买入价格最高的资产，优先被视为「已卖出」，卖出成本按最高买入价计算。
        </p>
        <p className="text-gray-600 mt-2 text-sm">
        ✨ 常见于加密货币交易（税务优化场景），部分地区允许用于税务申报。
        </p>
        </div>

        <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">原理图解</h4>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="text-center">
        <div className="bg-green-100 p-3 rounded border border-green-200 mb-2">买入1：10件 × 10元 = 100元（最低价）</div>
        <div className="bg-green-100 p-3 rounded border border-green-200 mb-2">买入2：8件 × 12元 = 96元</div>
        <div className="bg-green-100 p-3 rounded border border-green-200">买入3：5件 × 15元 = 75元（最高价）</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">→</div>
        <div className="text-center">
        <div className="bg-green-100 p-3 rounded border border-green-200">卖出12件 → 优先扣除「买入3（最高价）+ 买入2（次高价）+ 买入1（低价）」</div>
        <div className="text-gray-600 mt-2">卖出成本 = (5×15) + (8×12) + (1×10) = 181元（与LIFO结果一致，但逻辑不同）</div>
        </div>
        </div>
        </div>
        </div>

        <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">实际例子（加密货币交易）</h4>
        <table className="min-w-full border-collapse">
        <thead>
        <tr className="bg-gray-100">
        <th className="border border-gray-300 p-3 text-left">日期</th>
        <th className="border border-gray-300 p-3 text-left">操作</th>
        <th className="border border-gray-300 p-3 text-left">数量（BTC）</th>
        <th className="border border-gray-300 p-3 text-left">买入价（USD）</th>
        <th className="border border-gray-300 p-3 text-left">库存余量（BTC）</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td className="border border-gray-300 p-3">2月1日</td>
        <td className="border border-gray-300 p-3">买入</td>
        <td className="border border-gray-300 p-3">0.5</td>
        <td className="border border-gray-300 p-3">40,000</td>
        <td className="border border-gray-300 p-3">0.5</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3">2月10日</td>
        <td className="border border-gray-300 p-3">买入</td>
        <td className="border border-gray-300 p-3">0.3</td>
        <td className="border border-gray-300 p-3">45,000（最高价）</td>
        <td className="border border-gray-300 p-3">0.8</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3">2月15日</td>
        <td className="border border-gray-300 p-3">买入</td>
        <td className="border border-gray-300 p-3">0.2</td>
        <td className="border border-gray-300 p-3">42,000</td>
        <td className="border border-gray-300 p-3">1.0</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3">2月20日</td>
        <td className="border border-gray-300 p-3">卖出</td>
        <td className="border border-gray-300 p-3">0.6</td>
        <td className="border border-gray-300 p-3">按HIFO：0.3×45000 + 0.2×42000 + 0.1×40000</td>
        <td className="border border-gray-300 p-3">0.4</td>
        </tr>
        </tbody>
        </table>
        <p className="text-gray-600 mt-3 text-sm">
        卖出成本 = 0.3×45000 + 0.2×42000 + 0.1×40000 = 25,900 USD → 利润最低，税务最少
        </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="text-lg font-semibold mb-2 text-green-700">优点</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>税务优化效果最强（卖出成本最高 → 利润最低 → 税负最少）</li>
        <li>适合资产价格波动大的场景（如加密货币、股票）</li>
        <li>部分国家/地区（如美国、新加坡）允许用于税务申报</li>
        </ul>
        </div>
        <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100">
        <h4 className="text-lg font-semibold mb-2 text-red-700">缺点</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>不符合常规库存流转逻辑，仅适用于特定场景（非实物资产为主）</li>
        <li>会计核算复杂，需跟踪每笔买入的价格并排序</li>
        <li>部分地区不允许用于财务报表（仅允许税务申报）</li>
        </ul>
        </div>
        </div>
        </div>
        )}
        </div>
        </section>

        {/* 对比总结部分 */}
        <section id="comparison" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">三大方法核心对比</h2>

        <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
        <thead>
        <tr className="bg-gray-100">
        <th className="border border-gray-300 p-3 text-left">对比维度</th>
        <th className="border border-gray-300 p-3 text-left bg-blue-50 text-blue-700">FIFO</th>
        <th className="border border-gray-300 p-3 text-left bg-orange-50 text-orange-700">LIFO</th>
        <th className="border border-gray-300 p-3 text-left bg-green-50 text-green-700">HIFO</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td className="border border-gray-300 p-3 font-semibold">计价逻辑</td>
        <td className="border border-gray-300 p-3">最早买入先卖出</td>
        <td className="border border-gray-300 p-3">最晚买入先卖出</td>
        <td className="border border-gray-300 p-3">最高价格先卖出</td>
        </tr>
        <tr className="bg-gray-50">
        <td className="border border-gray-300 p-3 font-semibold">卖出成本</td>
        <td className="border border-gray-300 p-3">最低（通胀期）</td>
        <td className="border border-gray-300 p-3">较高</td>
        <td className="border border-gray-300 p-3">最高</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3 font-semibold">利润表现</td>
        <td className="border border-gray-300 p-3">最高（通胀期）</td>
        <td className="border border-gray-300 p-3">较低</td>
        <td className="border border-gray-300 p-3">最低</td>
        </tr>
        <tr className="bg-gray-50">
        <td className="border border-gray-300 p-3 font-semibold">税务影响</td>
        <td className="border border-gray-300 p-3">税负最高</td>
        <td className="border border-gray-300 p-3">税负较低</td>
        <td className="border border-gray-300 p-3">税负最低</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3 font-semibold">库存价值</td>
        <td className="border border-gray-300 p-3">接近市场价</td>
        <td className="border border-gray-300 p-3">偏低</td>
        <td className="border border-gray-300 p-3">偏低（剩余低价资产）</td>
        </tr>
        <tr className="bg-gray-50">
        <td className="border border-gray-300 p-3 font-semibold">适用场景</td>
        <td className="border border-gray-300 p-3">实物商品、生鲜、通用会计报表</td>
        <td className="border border-gray-300 p-3">美国企业、通胀期税务优化</td>
        <td className="border border-gray-300 p-3">加密货币、股票、税务优化</td>
        </tr>
        <tr>
        <td className="border border-gray-300 p-3 font-semibold">准则允许性</td>
        <td className="border border-gray-300 p-3">IFRS + 中国会计准则 + GAAP</td>
        <td className="border border-gray-300 p-3">仅GAAP（美国）</td>
        <td className="border border-gray-300 p-3">部分地区税务申报允许</td>
        </tr>
        </tbody>
        </table>
        </div>

        <div className="mt-8 bg-blue-50 p-5 rounded-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-700 mb-3">如何选择合适的计价方法？</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>✅ 实物商品（尤其是保质期短）→ 优先FIFO（符合实际流转）</li>
        <li>✅ 美国企业 + 通胀环境 → 可选择LIFO（税务优化）</li>
        <li>✅ 加密货币/股票交易 → 优先HIFO（合法税务最小化）</li>
        <li>⚠️ 注意：一旦选择计价方法，通常需保持一致性（会计原则），变更需符合准则要求并披露。</li>
        </ul>
        </div>
        </section>
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
        <p>© 2025 库存计价方法科普笔记 | 基于 Next.js + Tailwind CSS 构建</p>
        <p className="mt-2 text-sm">注：本文仅为科普，不构成会计或税务建议，请咨询专业人士获取具体指导</p>
        </div>
        </footer>
        </div>
    );
}