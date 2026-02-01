import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Marquee from '@/components/Marquee';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Content */}
      <div className="content-layer relative z-10 pt-24 pb-12">
        {/* Main Hero Content */}
        <div className="section-padding flex flex-col items-center text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#3898EC] mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#3898EC]" />
            <span className="text-sm text-white/80">基于 Kite AI 基础设施构建</span>
          </div>

          {/* Main Title */}
          <h1 
            ref={titleRef}
            className={`text-responsive-hero font-bold mb-6 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-white">KiteTax</span>
            <span className="text-[#3898EC] text-glow"> Pal</span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className={`text-xl md:text-2xl text-white/70 max-w-3xl mb-4 transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Web3 自动化税务合规智能体
          </p>

          {/* Description */}
          <p 
            className={`text-base md:text-lg text-white/50 max-w-2xl mb-10 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            将复杂的税务合规由&quot;事后被动应对&quot;转变为&quot;交易发生时主动完成&quot;
            <br className="hidden md:block" />
            实现用户&quot;无感&quot;的自动报税体验
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
                  <button
                      onClick={() => router.push('/dashboard')}
                      className="cursor-pointer btn-primary flex items-center justify-center gap-2 group border-none"
                  >
                      开始申报
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
            <button 
              onClick={() => scrollToSection('#features')}
              className="btn-secondary flex items-center justify-center gap-2 border-white bg-transparent"
            >
              <Play className="w-5 h-5" />
              观看演示
            </button>
          </div>
        </div>

        {/* Marquee */}
        <div 
          className={`transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Marquee />
        </div>

        {/* Stats */}
        <div 
          className={`section-padding mt-16 transition-all duration-1000 delay-800 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '99.9%', label: '计算准确率' },
              { value: '< 1s', label: '实时响应' },
              { value: '50+', label: '支持链' },
              { value: '2026', label: 'CARF 就绪' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#3898EC] mb-2 group-hover:text-glow-subtle transition-all">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
