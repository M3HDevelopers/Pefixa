import { Link } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory, toolRegistry } from '../lib/tools/registry';
import { getToolIcon, getCategoryIcon } from '../lib/tools/icons';
import { useAppStore } from '../store';
import { ArrowRight, Zap, Shield, Clock, Globe, Sparkles } from 'lucide-react';

// Top 10 most popular tools - shown prominently at top
const popularTools = [
  'merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-jpg',
  'rotate-pages', 'encrypt-pdf', 'watermark-text', 'page-numbers', 'ocr-pdf',
];

export function HomePage() {
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const recentTools = useAppStore(s => s.recentTools);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="hero-glow absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Hero Section */}
      <div className="text-center mb-20 relative animate-fade">
        <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-1.5 rounded-sm text-[11px] font-medium text-[#888] mb-6">
          <Sparkles size={11} className="text-white" />
          <span>286 PDF Tools — All in One Workspace</span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
          One workspace for
          <br />
          <span className="text-white">every PDF task</span>
        </h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
          Merge, split, compress, convert, edit, secure, inspect, and automate your PDF documents.
          All processing happens in your browser — your files never leave your device.
        </p>
      </div>

      {/* Most Popular Tools - TOP PRIORITY */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-[0.15em] flex items-center gap-2">
            <Zap size={13} className="text-white" />
            Most Popular
          </h2>
          <Link to="/tools" className="text-[11px] text-[#666] hover:text-white transition-colors">
            View all tools →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {popularTools.map((slug, idx) => {
            const tool = toolRegistry.find(t => t.slug === slug);
            if (!tool) return null;
            const Icon = getToolIcon(slug);
            return (
              <Link
                key={slug}
                to={`/tools/${slug}`}
                onClick={() => addRecentTool(slug)}
                className="card group p-4 relative stagger-item"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="popular-badge">Popular</div>
                <div className="icon-box w-10 h-10 mb-3">
                  <Icon size={18} className="text-[#888] transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-[13px] mb-1 group-hover:text-white">{tool.title}</h3>
                <p className="text-[10px] text-[#555] leading-relaxed line-clamp-2">{tool.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-[#666] group-hover:text-white transition-colors">
                  <span>Open</span>
                  <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-20">
        {[
          { value: `${toolRegistry.length}+`, label: 'PDF Tools' },
          { value: toolRegistry.filter(t => t.capability === 'browser-ready').length, label: 'Browser Ready' },
          { value: categories.length, label: 'Categories' },
          { value: '100%', label: 'Private & Local' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 text-center stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[10px] text-[#555] uppercase tracking-[0.15em]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <div className="mb-20">
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
            <Clock size={13} className="text-[#666]" />
            Recently Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentTools.map(slug => {
              const tool = toolRegistry.find(t => t.slug === slug);
              if (!tool) return null;
              const Icon = getToolIcon(slug);
              return (
                <Link
                  key={slug}
                  to={`/tools/${slug}`}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] rounded-sm text-[12px] text-[#888] hover:text-white transition-all"
                >
                  <Icon size={12} />
                  <span>{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-20">
        <h2 className="text-sm font-semibold text-white mb-5 uppercase tracking-[0.15em]">All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => {
            const tools = getToolsByCategory(cat.slug);
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                to={`/tools?category=${cat.slug}`}
                className="card group p-4 stagger-item"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="icon-box w-9 h-9 shrink-0">
                    <Icon size={15} className="text-[#888]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-[13px] group-hover:text-white">{cat.title}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">{tools.length} tools</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { icon: Shield, title: 'Privacy First', desc: 'Files processed locally in your browser. Nothing uploaded to servers.' },
          { icon: Globe, title: 'Works Offline', desc: 'Core tools work without internet. No account required.' },
          { icon: Zap, title: 'Workflow Ready', desc: 'Chain tools together. Save presets. Automate repetitive tasks.' },
        ].map((feature, i) => (
          <div key={i} className="text-center stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="icon-box w-12 h-12 mx-auto mb-3">
              <feature.icon size={20} className="text-white" />
            </div>
            <h3 className="font-medium text-white text-[13px] mb-1">{feature.title}</h3>
            <p className="text-[11px] text-[#555] leading-relaxed max-w-xs mx-auto">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
