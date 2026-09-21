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
  Merge,
  ArrowLeftRight,
  Minimize2,
  Edit3,
  Layout,
  ScanText,
  Download,
  Search,
  GitCompare,
  FileText,
  Brain,
  Eye,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Merge, ArrowLeftRight, Minimize2, Edit3, Shield, Layout, ScanText,
  Download, Search, GitCompare, FileText, Brain, Zap, Eye,
};

const featuredTools = ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-jpg', 'rotate-pages', 'encrypt-pdf'];

export function HomePage() {
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const recentTools = useAppStore(s => s.recentTools);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
          <Zap size={12} />
          <span>30+ PDF Tools — All in One Workspace</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          One workspace for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">every PDF task</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Merge, split, compress, convert, edit, secure, inspect, and automate your PDF documents. 
          All processing happens in your browser — your files never leave your device.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">{toolRegistry.length}+</p>
          <p className="text-xs text-gray-500">PDF Tools</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">{toolRegistry.filter(t => t.capability === 'browser-ready').length}</p>
          <p className="text-xs text-gray-500">Browser Ready</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-purple-600">100%</p>
          <p className="text-xs text-gray-500">Private & Local</p>
        </div>
      </div>

      {/* Featured Tools */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          {featuredTools.map(slug => {
            const tool = toolRegistry.find(t => t.slug === slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                to={`/tools/${slug}`}
                onClick={() => addRecentTool(slug)}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Zap size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{tool.title}</p>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
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
                  className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-gray-600 transition-colors"
                >
                  {tool.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(cat => {
            const tools = getToolsByCategory(cat.slug);
            const Icon = iconMap[cat.icon] || Zap;
            return (
              <Link
                key={cat.slug}
                to={`/tools?category=${cat.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Icon size={16} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{cat.title}</p>
                    <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{tools.length} tools</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield size={20} className="text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">Privacy First</h3>
          <p className="text-xs text-gray-500">Files processed locally in your browser. Nothing uploaded to servers.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Globe size={20} className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">Works Offline</h3>
          <p className="text-xs text-gray-500">Core tools work without internet. No account required.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">Workflow Ready</h3>
          <p className="text-xs text-gray-500">Chain tools together. Save presets. Automate repetitive tasks.</p>
        </div>
      </div>
    </div>
  );
}
