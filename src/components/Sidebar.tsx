import { Link, useLocation } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory } from '../lib/tools/registry';
import { useAppStore } from '../store';
import {
  Home,
  Wrench,
  History,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Layout,
  Edit3,
  FileText,
  ArrowRight,
  ArrowLeft,
  Minimize2,
  ScanText,
  Shield,
  Search,
  Download,
  Brain,
  Zap,
  Plus,
  Code,
  GitCompare,
  Bookmark,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, any> = {
  Layout, Edit3, FileText, ArrowRight, ArrowLeft, Minimize2, ScanText,
  Shield, Search, Download, Brain, Zap, GitBranch, Plus, Code,
};

export function Sidebar() {
  const location = useLocation();
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setExpandedCats(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">PEFIXA</h1>
            <p className="text-[10px] text-gray-500 leading-tight">PDF Workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/tools"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/tools' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Wrench size={16} />
            <span>All Tools</span>
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/history' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History size={16} />
            <span>History</span>
          </Link>
          <Link
            to="/workflows"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/workflows' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GitBranch size={16} />
            <span>Workflows</span>
          </Link>
          <Link
            to="/viewer"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/viewer' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search size={16} />
            <span>Viewer</span>
          </Link>
          <Link
            to="/compare"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/compare' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GitCompare size={16} />
            <span>Compare</span>
          </Link>
          <Link
            to="/inspect"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/inspect' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search size={16} />
            <span>Inspect</span>
          </Link>
          <Link
            to="/presets"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/presets' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark size={16} />
            <span>Presets</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/settings' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>
        </div>

        <div className="mt-2 border-t border-gray-100 pt-2 px-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 mb-1">Categories</p>
          {categories.map(cat => {
            const tools = getToolsByCategory(cat.slug);
            const isExpanded = expandedCats.includes(cat.slug);
            const Icon = iconMap[cat.icon] || Wrench;

            return (
              <div key={cat.slug} className="mb-0.5">
                <button
                  onClick={() => toggleCategory(cat.slug)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={14} className="text-gray-400" />
                  <span className="flex-1 text-left">{cat.title}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{tools.length}</span>
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                {isExpanded && (
                  <div className="ml-4 border-l border-gray-100 pl-2 max-h-48 overflow-y-auto">
                    {tools.slice(0, 20).map(tool => (
                      <Link
                        key={tool.slug}
                        to={`/tools/${tool.slug}`}
                        className={`block px-3 py-1 rounded text-xs transition-colors truncate ${
                          location.pathname === `/tools/${tool.slug}`
                            ? 'text-blue-700 font-medium bg-blue-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tool.title}
                      </Link>
                    ))}
                    {tools.length > 20 && (
                      <Link
                        to={`/tools?category=${cat.slug}`}
                        className="block px-3 py-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        +{tools.length - 20} more...
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-[10px] text-gray-400 text-center">
          Pefixa v1.0 — 280+ PDF Tools
        </div>
      </div>
    </aside>
  );
}
