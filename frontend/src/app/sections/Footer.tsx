import { Wallet, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { label: '功能介绍', href: '#features' },
      { label: '定价方案', href: '#' },
      { label: 'API 文档', href: '#' },
      { label: '更新日志', href: '#' },
    ],
  },
  company: {
    title: '公司',
    links: [
      { label: '关于我们', href: '#team' },
      { label: '加入我们', href: '#' },
      { label: '新闻动态', href: '#' },
      { label: '联系我们', href: '#contact' },
    ],
  },
  resources: {
    title: '资源',
    links: [
      { label: '帮助中心', href: '#' },
      { label: '税务指南', href: '#' },
      { label: '合规框架', href: '#' },
      { label: '博客', href: '#' },
    ],
  },
  legal: {
    title: '法律',
    links: [
      { label: '隐私政策', href: '#' },
      { label: '服务条款', href: '#' },
      { label: 'Cookie 政策', href: '#' },
      { label: '安全声明', href: '#' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 mb-6 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3898EC] flex items-center justify-center group-hover:glow-blue transition-all">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  KiteTax<span className="text-[#3898EC]"> Pal</span>
                </span>
              </a>
              
              <p className="text-white/50 text-sm mb-6 max-w-xs">
                基于 Kite AI 基础设施的自动化税务合规智能体，
                为 Web3 用户提供实时、可信的合规护航。
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#3898EC]/20 hover:border-[#3898EC]/50 border border-transparent transition-all"
                    >
                      <Icon className="w-5 h-5 text-white/60 hover:text-[#3898EC] transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link Columns */}
            {Object.values(footerLinks).map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="mb-2 text-white/50 text-sm hover:text-[#3898EC] transition-colors relative group border-none bg-transparent"
                      >
                        {link.label}
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#3898EC] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} KiteTax Pal. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <span className="text-white/40 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                系统正常运行
              </span>
              <span className="text-white/30 text-sm">
                Powered by Kite AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
