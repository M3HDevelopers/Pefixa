import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { toolRegistry, getToolsByCategory } from '../lib/tools/registry';
import {
  Merge, ArrowLeftRight, Minimize2, Edit3, Shield, Layout, ScanText,
  Download, Search, GitCompare, FileText, Brain, Zap, Eye, Wrench,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Merge, ArrowLeftRight, Minimize2, Edit3, Shield, Layout, ScanText,
  Download, Search, GitCompare, FileText, Brain, Zap, Eye, Wrench,
};

export function ToolsListPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredCategories = categoryFilter
    ? categories.filter(c => c.slug === categoryFilter)
    : categories;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All PDF Tools</h1>
        <p className="text-gray-600 text-sm">
          {toolRegistry.length} tools across {categories.length} categories. 
          {categoryFilter && (
            <span className="ml-2">
              Filtered by: <span className="font-medium text-blue-600">{categories.find(c => c.slug === categoryFilter)?.title}</span>
              <Link to="/tools" className="ml-2 text-xs text-gray-500 hover:text-gray-700">(clear filter)</Link>
            </span>
          )}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          to="/tools"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !categoryFilter ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                categoryFilter === cat.slug ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
        const Icon = iconMap[cat.icon] || Zap;

        return (
          <div key={cat.slug} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} className="text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">{cat.title}</h2>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tools.map(tool => (
                <Link
                  key={tool.slug}
                  to={`/tools/${tool.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                      {tool.title}
                    </h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      tool.capability === 'browser-ready' ? 'bg-green-100 text-green-700' :
                      tool.capability === 'browser-partial' ? 'bg-yellow-100 text-yellow-700' :
                      tool.capability === 'ai-required' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {tool.capability === 'browser-ready' ? 'Ready' :
                       tool.capability === 'browser-partial' ? 'Partial' :
                       tool.capability === 'ai-required' ? 'AI' : 'Backend'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{tool.description}</p>
                  <div className="flex items-center gap-2">
                    {tool.inputMode === 'multiple' && (
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">Batch</span>
                    )}
                    {tool.supportsChaining && (
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">Chainable</span>
                    )}
                    {tool.output.multiple && (
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">Multi-output</span>
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
