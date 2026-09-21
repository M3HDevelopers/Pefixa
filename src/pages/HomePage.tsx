import { Link } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory, toolRegistry } from '../lib/tools/registry';
import { useAppStore } from '../store';
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Globe,
  Layout,
  Edit3,
  FileText,
  ArrowRight as ArrowRightIcon,
  ArrowLeft,
  Minimize2,
  ScanText,
  Download,
  Search,
  Code,
  Eye,
  GitBranch,
  Plus,
  Wrench,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Layout, Edit3, FileText, ArrowRight: ArrowRightIcon, ArrowLeft, Minimize2, ScanText,
  Shield, Search, Download, Code, Zap, GitBranch, Plus, Eye,
};

const featuredTools = ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-jpg', 'rotate-pages', 'encrypt-pdf'];

export function HomePage() {
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const recentTools = useAppStore(s => s.recentTools);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1f1f1f] px-3 py-1.5 rounded-sm text-[11px] font-medium text-[#888] mb-6">
          <Zap size={12} className="text-white" />
          <span>286 PDF Tools — All in One Workspace</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          One workspace for{' '}
          <span className="text-white border-b-2 border-white pb-0.5">every PDF task</span>
        </h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
          Merge, split, compress, convert, edit, secure, inspect, and automate your PDF documents.
          All processing happens in your browser — your files never leave your device.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-16">
        {[
          { value: `${toolRegistry.length}+`, label: 'PDF Tools', color: 'text-white' },
          { value: toolRegistry.filter(t => t.capability === 'browser-ready').length, label: 'Browser Ready', color: 'text-[#4ade80]' },
          { value: categories.length, label: 'Categories', color: 'text-[#4da6ff]' },
          { value: '100%', label: 'Private & Local', color: 'text-[#a78bfa]' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 text-center">
            <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
            <p className="text-[11px] text-[#555] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Tools */}
      <div className="mb-16">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          {featuredTools.map(slug => {
            const tool = toolRegistry.find(t => t.slug === slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                to={`/tools/${slug}`}
                onClick={() => addRecentTool(slug)}
                className="card group p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center shrink-0" style={{ borderRadius: '2px' }}>
                  <Zap size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-[13px] group-hover:text-[#4da6ff] transition-colors">{tool.title}</p>
                  <p className="text-[11px] text-[#555] truncate">{tool.description}</p>
                </div>
                <ArrowRight size={14} className="text-[#333] group-hover:text-white transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-[#555]" />
            Recently Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentTools.map(slug => {
              const tool = toolRegistry.find(t => t.slug === slug);
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  to={`/tools/${slug}`}
                  className="px-3 py-1.5 bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#333] hover:text-white rounded-sm text-[12px] text-[#888] transition-all"
                >
                  {tool.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-16">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(cat => {
            const tools = getToolsByCategory(cat.slug);
            const Icon = iconMap[cat.icon] || Wrench;
            return (
              <Link
                key={cat.slug}
                to={`/tools?category=${cat.slug}`}
                className="card group p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center shrink-0" style={{ borderRadius: '2px' }}>
                    <Icon size={15} className="text-[#888] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-[13px] group-hover:text-[#4da6ff] transition-colors">{cat.title}</p>
                    <p className="text-[10px] text-[#555] truncate mt-0.5">{cat.description}</p>
                    <p className="text-[10px] text-[#444] mt-1.5">{tools.length} tools</p>
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
          { icon: Shield, title: 'Privacy First', desc: 'Files processed locally in your browser. Nothing uploaded to servers.', color: '#4ade80' },
          { icon: Globe, title: 'Works Offline', desc: 'Core tools work without internet. No account required.', color: '#4da6ff' },
          { icon: Zap, title: 'Workflow Ready', desc: 'Chain tools together. Save presets. Automate repetitive tasks.', color: '#a78bfa' },
        ].map((feature, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 bg-[#0d0d0d] border border-[#1f1f1f] flex items-center justify-center mx-auto mb-3" style={{ borderRadius: '2px' }}>
              <feature.icon size={20} style={{ color: feature.color }} />
            </div>
            <h3 className="font-medium text-white text-[13px] mb-1">{feature.title}</h3>
            <p className="text-[11px] text-[#555] leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
