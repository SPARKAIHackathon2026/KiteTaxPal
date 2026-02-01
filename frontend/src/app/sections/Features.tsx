import { useEffect, useRef, useState } from 'react';
import { 
  Database, 
  Calculator, 
  Shield, 
  FileCheck, 
  Coins, 
  Globe,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Database,
    title: '多源数据对账',
    titleEn: 'Multi-Source Reconciliation',
    description: '穿透式整合碎片化的链上交易数据，自动识别并归类多币种、跨链交易，构建完整的税务数据视图。',
    image: '/feature-1.jpg',
  },
  {
    icon: Calculator,
    title: '确定性逻辑计税',
    titleEn: 'Deterministic Calculation',
    description: '利用经过审计的确定性算法自动完成计税，确保每一笔交易的税务计算准确无误，避免人工计算的错误风险。',
    image: '/feature-2.jpg',
  },
  {
    icon: Shield,
    title: '受控自主支付',
    titleEn: 'Controlled Payment',
    description: '严格遵循"最小授权"与"白名单支付"原则，用户仅需授权专用纳税钱包，智能体自动将税金划转至官方验证地址。',
    image: '/feature-3.jpg',
  },
  {
    icon: FileCheck,
    title: '不可篡改凭证',
    titleEn: 'Tamper-Proof Records',
    description: '生成不可篡改的链上交易记录作为完税凭证，所有税务数据永久保存在区块链上，随时可供审计查验。',
    image: '/feature-4.jpg',
  },
  {
    icon: Coins,
    title: '多币种支持',
    titleEn: 'Multi-Currency Support',
    description: '支持 BTC、ETH、USDT 等主流加密货币及各类 DeFi 代币，自动获取实时汇率，精确计算法币等值税额。',
    image: '/feature-5.jpg',
  },
  {
    icon: Globe,
    title: '全球合规框架',
    titleEn: 'Global Compliance',
    description: '为 2026 年全球 CARF 监管框架做好准备，实时更新各国税务法规，确保您的资产在透明监管中安全流动。',
    image: '/feature-6.jpg',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="relative py-24 md:py-32"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#3898EC]/30 mb-6">
            <span className="text-sm text-[#3898EC]">核心功能</span>
          </div>
          <h2 className="text-responsive-section font-bold text-white mb-6">
            三大核心能力，<span className="text-[#3898EC]">一站式</span>税务合规
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            KiteTax Pal 集成了多源数据对账、确定性逻辑计税、受控自主支付三项核心功能，
            为 Web3 用户提供实时、可信的合规护航。
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.has(index);
            
            return (
              <div
                key={index}
                data-index={index}
                className={`feature-card glass-card rounded-2xl overflow-hidden card-hover group transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden img-zoom">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Icon overlay */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-[#3898EC]/20 backdrop-blur-sm flex items-center justify-center border border-[#3898EC]/30">
                    <Icon className="w-6 h-6 text-[#3898EC]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#3898EC] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#3898EC]/60 uppercase tracking-wider">
                      {feature.titleEn}
                    </p>
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <button className="inline-flex items-center gap-2 text-[#3898EC] text-sm font-medium group/link border-none bg-transparent">
                    了解更多
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
