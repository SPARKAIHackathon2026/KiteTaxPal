import { useEffect, useRef } from 'react';

interface MarqueeItem {
  zh: string;
  en: string;
}

const marqueeItems: MarqueeItem[] = [
  { zh: '多源数据对账', en: 'Multi-Source Data Reconciliation' },
  { zh: '确定性逻辑计税', en: 'Deterministic Tax Calculation' },
  { zh: '受控自主支付', en: 'Controlled Autonomous Payment' },
  { zh: '实时合规监控', en: 'Real-Time Compliance Monitoring' },
  { zh: '链上交易追踪', en: 'On-Chain Transaction Tracking' },
  { zh: '白名单安全机制', en: 'Whitelist Security Mechanism' },
  { zh: '最小授权原则', en: 'Principle of Least Privilege' },
  { zh: '不可篡改凭证', en: 'Tamper-Proof Certificates' },
];

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Duplicate content for seamless loop
    const content = container.querySelector('.marquee-content');
    if (content && container.children.length === 1) {
      const clone = content.cloneNode(true);
      container.appendChild(clone);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden bg-black/50 backdrop-blur-sm border-y border-[#3898EC]/20 py-4">
      <div 
        ref={containerRef}
        className="flex animate-marquee"
        style={{ width: 'max-content' }}
      >
        <div className="marquee-content flex items-center gap-8 px-4">
          {marqueeItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 whitespace-nowrap group cursor-default"
            >
              <span className="text-white/90 font-medium text-sm md:text-base">
                {item.zh}
              </span>
              <span className="text-[#3898EC]/60 text-xs">|</span>
              <span className="text-[#3898EC] font-light text-sm md:text-base group-hover:text-glow-subtle transition-all">
                {item.en}
              </span>
              <span className="text-[#3898EC]/30 mx-4">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
