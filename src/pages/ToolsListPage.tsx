import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { toolRegistry, getToolsByCategory } from '../lib/tools/registry';
import { getToolIcon, getCategoryIcon, getToolColor, getCategoryColor } from '../lib/tools/icons';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Scroll reveal hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export function ToolsListPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredCategories = categoryFilter
    ? categories.filter(c => c.slug === categoryFilter)
    : categories;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <RevealSection>
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
      </RevealSection>

      {/* Category Filters */}
      <RevealSection>
        <div className="flex flex-wrap gap-1.5 mb-10 pb-6 border-b border-white/5">
          <Link
            to="/tools"
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
              !categoryFilter ? 'btn-primary' : 'bg-[#0a0a0a] border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333]'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  categoryFilter === cat.slug ? 'btn-primary' : 'bg-[#0a0a0a] border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333]'
                }`}
              >
                <Icon size={11} color={categoryFilter === cat.slug ? '#000000' : getCategoryColor(cat.slug)} />
                <span>{cat.title}</span>
                <span className="text-[9px] opacity-60">({count})</span>
              </Link>
            );
          })}
        </div>
      </RevealSection>

      {/* Tools by Category */}
      {filteredCategories.map(cat => {
        const tools = getToolsByCategory(cat.slug);
        if (tools.length === 0) return null;
        const Icon = getCategoryIcon(cat.slug);

        return (
          <RevealSection key={cat.slug} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-box w-7 h-7">
                <Icon size={13} color={getCategoryColor(cat.slug)} />
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
                        <ToolIcon size={15} color={getToolColor(tool.slug)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-white text-[12px] group-hover:text-white truncate">
                            {tool.title}
                          </h3>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ${
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
                            <span className="text-[9px] text-[#666] bg-[#111] border border-[#1a1a1a] px-1.5 py-0.5 rounded-sm">Batch</span>
                          )}
                          {tool.supportsChaining && (
                            <span className="text-[9px] text-[#666] bg-[#111] border border-[#1a1a1a] px-1.5 py-0.5 rounded-sm">Chain</span>
                          )}
                          {tool.output.multiple && (
                            <span className="text-[9px] text-[#666] bg-[#111] border border-[#1a1a1a] px-1.5 py-0.5 rounded-sm">Multi</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </RevealSection>
        );
      })}
    </div>
  );
}
