import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { toolRegistry, getToolsByCategory } from '../lib/tools/registry';
import {
  Layout, Edit3, FileText, ArrowRight, ArrowLeft, Minimize2, ScanText,
  Shield, Search, Download, Code, Zap, GitBranch, Plus, Eye, Wrench,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Layout, Edit3, FileText, ArrowRight, ArrowLeft, Minimize2, ScanText,
  Shield, Search, Download, Code, Zap, GitBranch, Plus, Eye, Wrench,
};

export function ToolsListPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredCategories = categoryFilter
    ? categories.filter(c => c.slug === categoryFilter)
    : categories;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">All PDF Tools</h1>
        <p className="text-[#888] text-[13px]">
          {toolRegistry.length} tools across {categories.length} categories.
          {categoryFilter && (
            <span className="ml-2">
              Filtered: <span className="text-[#4da6ff]">{categories.find(c => c.slug === categoryFilter)?.title}</span>
              <Link to="/tools" className="ml-2 text-[11px] text-[#555] hover:text-white">(clear)</Link>
            </span>
          )}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        <Link
          to="/tools"
          className={`px-3 py-1.5 rounded-sm text-[11px] font-medium transition-colors ${
            !categoryFilter ? 'bg-white text-black' : 'bg-[#0d0d0d] text-[#888] border border-[#1f1f1f] hover:border-[#333]'
          }`}
        >
          All ({toolRegistry.length})
        </Link>
        {categories.map(cat => {
          const count = getToolsByCategory(cat.slug).length;
          return (
            <Link
              key={cat.slug}
              to={`/tools?category=${cat.slug}`}
              className={`px-3 py-1.5 rounded-sm text-[11px] font-medium transition-colors ${
                categoryFilter === cat.slug ? 'bg-white text-black' : 'bg-[#0d0d0d] text-[#888] border border-[#1f1f1f] hover:border-[#333]'
              }`}
            >
              {cat.title} ({count})
            </Link>
          );
        })}
      </div>

      {/* Tools by Category */}
      {filteredCategories.map(cat => {
        const tools = getToolsByCategory(cat.slug);
        if (tools.length === 0) return null;
        const Icon = iconMap[cat.icon] || Wrench;

        return (
          <div key={cat.slug} className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-[#555]" />
              <h2 className="text-sm font-semibold text-white">{cat.title}</h2>
              <span className="text-[10px] text-[#444]">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tools.map(tool => (
                <Link
                  key={tool.slug}
                  to={`/tools/${tool.slug}`}
                  className="card group p-3"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-medium text-white text-[12px] group-hover:text-[#4da6ff] transition-colors">
                      {tool.title}
                    </h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${
                      tool.capability === 'browser-ready' ? 'badge-ready' :
                      tool.capability === 'browser-partial' ? 'badge-partial' :
                      tool.capability === 'ai-required' ? 'badge-ai' : 'badge-backend'
                    }`}>
                      {tool.capability === 'browser-ready' ? 'Local' :
                       tool.capability === 'browser-partial' ? 'Hybrid' :
                       tool.capability === 'ai-required' ? 'AI' : 'Cloud'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555] mb-2">{tool.description}</p>
                  <div className="flex items-center gap-1.5">
                    {tool.inputMode === 'multiple' && (
                      <span className="text-[9px] text-[#444] bg-[#111] px-1.5 py-0.5 rounded-sm">Batch</span>
                    )}
                    {tool.supportsChaining && (
                      <span className="text-[9px] text-[#444] bg-[#111] px-1.5 py-0.5 rounded-sm">Chain</span>
                    )}
                    {tool.output.multiple && (
                      <span className="text-[9px] text-[#444] bg-[#111] px-1.5 py-0.5 rounded-sm">Multi</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
