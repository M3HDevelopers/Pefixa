import { useAppStore } from '../store';
import { Menu, Search, Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTools } from '../lib/tools/registry';

export function Header() {
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const setSearchQuery = useAppStore(s => s.setSearchQuery);
  const [localQuery, setLocalQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const results = localQuery.length > 1 ? searchTools(localQuery) : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const selectTool = (slug: string) => {
    setShowResults(false);
    setLocalQuery('');
    setSearchQuery('');
    navigate(`/tools/${slug}`);
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 max-w-xl relative">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools... (e.g., merge, compress, convert)"
            value={localQuery}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {results.map(tool => (
              <button
                key={tool.slug}
                onClick={() => selectTool(tool.slug)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{tool.title}</p>
                  <p className="text-xs text-gray-500">{tool.description}</p>
                </div>
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
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">U</span>
        </div>
      </div>
    </header>
  );
}
