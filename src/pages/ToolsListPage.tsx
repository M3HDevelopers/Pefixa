import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { toolRegistry, getToolsByCategory } from '../lib/tools/registry';
import { getToolIcon, getCategoryIcon } from '../lib/tools/icons';
import { ArrowRight } from 'lucide-react';

export function ToolsListPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredCategories = categoryFilter
    ? categories.filter(c => c.slug === categoryFilter)
    : categories;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-fade">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">All PDF Tools</h1>
        <p className="text-[#888] text-[13px]">
          {toolRegistry.length} tools across {categories.length} categories.
          {categoryFilter && (
            <span className="ml-2">
              Filtered: <span className="text-white">{categories.find(c => c.slug === categoryFilter)?.title}</span>
              <Link to="/tools" className="ml-2 text-[11px] text-[#555] hover:text-white">(clear)</Link>
            </span>
          )}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1.5 mb-10 pb-6 border-b border-[#1a1a1a]">
        <Link
          to="/tools"
          className={`px-3 py-1.5 rounded-sm text-[11px] font-medium transition-all ${
            !categoryFilter ? 'bg-white text-black' : 'bg-[#0a0a0a] text-[#888] border border-[#1a1a1a] hover:border-[#333] hover:text-white'
          }`}
        >
          All ({toolRegistry.length})
        </Link>
        {categories.map(cat => {
          const count = getToolsByCategory(cat.slug).length;
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.slug}
              to={`/tools?category=${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-medium transition-all ${
                categoryFilter === cat.slug ? 'bg-white text-black' : 'bg-[#0a0a0a] text-[#888] border border-[#1a1a1a] hover:border-[#333] hover:text-white'
              }`}
            >
              <Icon size={11} />
              <span>{cat.title}</span>
              <span className="text-[9px] opacity-60">({count})</span>
            </Link>
          );
        })}
      </div>

      {/* Tools by Category */}
      {filteredCategories.map(cat => {
        const tools = getToolsByCategory(cat.slug);
        if (tools.length === 0) return null;
        const Icon = getCategoryIcon(cat.slug);

        return (
          <div key={cat.slug} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-box w-7 h-7">
                <Icon size={13} className="text-[#888]" />
              </div>
              <h2 className="text-sm font-semibold text-white">{cat.title}</h2>
              <span className="text-[10px] text-[#555]">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {tools.map((tool) => {
                const ToolIcon = getToolIcon(tool.slug);
                return (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="card group p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="icon-box w-9 h-9 shrink-0">
                        <ToolIcon size={15} className="text-[#888]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-white text-[12px] group-hover:text-white truncate">
                            {tool.title}
                          </h3>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium shrink-0 ${
                            tool.capability === 'browser-ready' ? 'badge-ready' :
                            tool.capability === 'browser-partial' ? 'badge-partial' :
                            tool.capability === 'ai-required' ? 'badge-ai' : 'badge-backend'
                          }`}>
                            {tool.capability === 'browser-ready' ? 'Local' :
                             tool.capability === 'browser-partial' ? 'Hybrid' :
                             tool.capability === 'ai-required' ? 'AI' : 'Cloud'}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#555] line-clamp-2 leading-relaxed">{tool.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          {tool.inputMode === 'multiple' && (
                            <span className="text-[9px] text-[#666] bg-[#111] px-1.5 py-0.5 rounded-sm">Batch</span>
                          )}
                          {tool.supportsChaining && (
                            <span className="text-[9px] text-[#666] bg-[#111] px-1.5 py-0.5 rounded-sm">Chain</span>
                          )}
                          {tool.output.multiple && (
                            <span className="text-[9px] text-[#666] bg-[#111] px-1.5 py-0.5 rounded-sm">Multi</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
