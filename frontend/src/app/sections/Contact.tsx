import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, MessageCircle, Send } from 'lucide-react';
import Link from "next/link";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#3898EC]/10 rounded-full blur-3xl" />
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#3898EC]/30 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: 0,
                right: 0,
                animation: `scan ${3 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div 
            className={`glass-card rounded-3xl p-8 md:p-12 text-center border-gradient transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3898EC]/20 border border-[#3898EC]/30 mb-8">
              <MessageCircle className="w-4 h-4 text-[#3898EC]" />
              <span className="text-sm text-[#3898EC]">立即开始</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              准备好优化您的
              <span className="text-[#3898EC] text-glow"> 税务合规</span>
              了吗？
            </h2>

            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              加入数千名 Web3 用户的行列，体验实时、可信、无感的自动报税服务。
              在 2026 年全球 CARF 监管框架下，让资产在透明监管中安全流动。
            </p>

            {/* Email Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="输入您的邮箱地址"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3898EC] transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        免费开始
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-[#3898EC]/20 border border-[#3898EC]/30">
                <div className="flex items-center justify-center gap-3 text-[#3898EC]">
                  <div className="w-8 h-8 rounded-full bg-[#3898EC] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">感谢订阅！我们会尽快与您联系</span>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>免费试用 14 天</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>无需信用卡</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>随时取消</span>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {[
              { 
                title: '技术支持', 
                desc: '7×24 小时在线客服',
                action: '联系支持',
                href:"https://docs.gokite.ai"
              },
              { 
                title: '预约演示', 
                desc: '一对一产品讲解',
                action: '预约演示',
                href:"https://github.com/SPARKAIHackathon2026"
              },
              { 
                title: '开发者文档', 
                desc: 'API 与集成指南',
                action: '查看文档',
                href:"https://github.com/SPARKAIHackathon2026"
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="glass-card rounded-xl p-6 hover:border-[#3898EC]/30 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm mb-4">{item.desc}</p>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      <button className="inline-flex items-center gap-2 text-[#3898EC] text-sm font-medium group-hover:gap-3 transition-all border-none bg-transparent">
                          {item.action}
                          <ArrowRight className="w-4 h-4" />
                      </button>
                  </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
