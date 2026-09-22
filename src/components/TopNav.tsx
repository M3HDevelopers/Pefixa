import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory, searchTools, toolRegistry } from '../lib/tools/registry';
import { getToolIcon } from '../lib/tools/icons';
import {
  Search,
  ChevronRight,
  Home,
  Wrench,
  GitBranch,
  History,
  Settings,
  Bookmark,
  Layers,
} from 'lucide-react';

const mainTabs = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Tools', path: '/tools', icon: Wrench, hasMegaMenu: true },
  { label: 'Workflows', path: '/workflows', icon: GitBranch },
  { label: 'History', path: '/history', icon: History },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<number | undefined>(undefined);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.length > 1 ? searchTools(searchQuery).slice(0, 6) : [];

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
        setActiveCategory(null);
        setActiveTool(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMegaMenuOpen(false);
        setActiveCategory(null);
        setActiveTool(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleToolsTabEnter = () => {
    if (menuTimeoutRef.current !== undefined) clearTimeout(menuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleToolsTabLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveCategory(null);
      setActiveTool(null);
    }, 200);
  };

  const handleCategoryEnter = (slug: string) => {
    setActiveCategory(slug);
    setActiveTool(null);
  };

  const handleToolEnter = (slug: string) => {
    setActiveTool(slug);
  };

  const handleToolLeave = () => {
    setActiveTool(null);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveCategory(null);
      setActiveTool(null);
    }, 250);
  };

  const selectTool = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setMegaMenuOpen(false);
    setActiveCategory(null);
    setActiveTool(null);
    navigate(`/tools/${slug}`);
  };

  const activeCatTools = activeCategory ? getToolsByCategory(activeCategory) : [];
  const activeToolDef = activeTool ? toolRegistry.find(t => t.slug === activeTool) : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#1a1a1a]">
      <div className="flex items-center h-14 px-6 max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-8 shrink-0 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center transition-transform group-hover:scale-105" style={{ borderRadius: '3px' }}>
            <span className="text-black font-bold text-sm tracking-tighter">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-[14px] tracking-wide leading-none">PEFIXA</span>
            <span className="text-[8px] text-[#555] tracking-[0.2em] uppercase leading-none mt-0.5">PDF WORKSPACE</span>
          </div>
        </Link>

        {/* Main Navigation - Clean & Minimal */}
        <nav className="flex items-center gap-1">
          {mainTabs.map(tab => {
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            const isToolsTab = tab.hasMegaMenu;

            if (isToolsTab) {
              return (
                <div
                  key={tab.path}
                  ref={megaMenuRef}
                  onMouseEnter={handleToolsTabEnter}
                  onMouseLeave={handleMenuLeave}
                  className="relative"
                >
                  <button
                    className={`nav-tab flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-sm transition-colors ${
                      isActive || megaMenuOpen ? 'text-white' : 'text-[#888] hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    <svg width="8" height="8" viewBox="0 0 8 8" className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}>
                      <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Mega Menu */}
                  {megaMenuOpen && (
                    <div className="mega-menu absolute top-full left-0 mt-2 flex animate-dropdown" style={{ width: '720px' }}>
                      {/* Categories Column */}
                      <div className="w-[240px] border-r border-[#1a1a1a] p-2">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#404040] font-semibold px-3 py-2">Categories</p>
                        <div className="space-y-0.5">
                          {categories.map((cat, idx) => {
                            const tools = getToolsByCategory(cat.slug);
                            const isActive = activeCategory === cat.slug;
                            const CatIcon = getToolIcon(cat.slug);
                            return (
                              <button
                                key={cat.slug}
                                onMouseEnter={() => handleCategoryEnter(cat.slug)}
                                onClick={() => navigate(`/tools?category=${cat.slug}`)}
                                className={`mega-menu-item w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-sm stagger-item`}
                                style={{ animationDelay: `${idx * 20}ms` }}
                              >
                                <div className={`icon-box w-7 h-7 shrink-0 ${isActive ? 'bg-white border-white' : ''}`}>
                                  <CatIcon size={13} className={isActive ? 'text-black' : 'text-[#888]'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[12px] font-medium truncate ${isActive ? 'text-white' : 'text-[#ccc]'}`}>{cat.title}</p>
                                  <p className="text-[10px] text-[#555]">{tools.length} tools</p>
                                </div>
                                <ChevronRight size={11} className={`transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-[#404040]'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tools Column */}
                      <div className="flex-1 p-2 min-h-[400px] max-h-[500px] overflow-y-auto">
                        {activeCategory ? (
                          <>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-[#404040] font-semibold px-3 py-2">
                              {categories.find(c => c.slug === activeCategory)?.title}
                            </p>
                            <div className="space-y-0.5">
                              {activeCatTools.map((tool, idx) => {
                                const ToolIcon = getToolIcon(tool.slug);
                                const isToolActive = activeTool === tool.slug;
                                return (
                                  <div
                                    key={tool.slug}
                                    onMouseEnter={() => handleToolEnter(tool.slug)}
                                    onMouseLeave={handleToolLeave}
                                    className="relative"
                                  >
                                    <button
                                      onClick={() => selectTool(tool.slug)}
                                      className={`mega-menu-item w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-sm stagger-item`}
                                      style={{ animationDelay: `${idx * 15}ms` }}
                                    >
                                      <div className={`icon-box w-7 h-7 shrink-0 ${isToolActive ? 'bg-white border-white' : ''}`}>
                                        <ToolIcon size={13} className={isToolActive ? 'text-black' : 'text-[#888]'} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-[12px] font-medium truncate ${isToolActive ? 'text-white' : 'text-[#ccc]'}`}>{tool.title}</p>
                                        <p className="text-[10px] text-[#555] truncate">{tool.description}</p>
                                      </div>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium shrink-0 ${
                                        tool.capability === 'browser-ready' ? 'badge-ready' :
                                        tool.capability === 'browser-partial' ? 'badge-partial' :
                                        tool.capability === 'ai-required' ? 'badge-ai' : 'badge-backend'
                                      }`}>
                                        {tool.capability === 'browser-ready' ? 'Local' :
                                         tool.capability === 'browser-partial' ? 'Hybrid' :
                                         tool.capability === 'ai-required' ? 'AI' : 'Cloud'}
                                      </span>
                                      {tool.options.length > 0 && (
                                        <ChevronRight size={10} className="text-[#404040]" />
                                      )}
                                    </button>

                                    {/* Tool Details Submenu */}
                                    {isToolActive && tool.options.length > 0 && (
                                      <div className="mega-menu absolute left-full top-0 ml-1 w-[220px] animate-submenu-right z-50 p-2">
                                        <div className="px-2 py-1.5 border-b border-[#1a1a1a] mb-1">
                                          <p className="text-[11px] font-semibold text-white">{tool.title}</p>
                                          <p className="text-[10px] text-[#555]">{tool.description}</p>
                                        </div>
                                        <p className="text-[9px] uppercase tracking-wider text-[#404040] font-semibold px-2 py-1">Options</p>
                                        {tool.options.slice(0, 5).map(opt => (
                                          <div key={opt.key} className="px-2 py-1.5 text-[11px] hover:bg-[#141414] rounded-sm">
                                            <span className="text-[#666]">{opt.label}: </span>
                                            <span className="text-[#aaa]">{String(opt.default)}</span>
                                          </div>
                                        ))}
                                        <Link
                                          to={`/tools/${tool.slug}`}
                                          onClick={() => { setMegaMenuOpen(false); setActiveCategory(null); setActiveTool(null); }}
                                          className="block mt-1 px-2 py-2 text-[11px] text-white border-t border-[#1a1a1a] hover:bg-[#141414] rounded-sm"
                                        >
                                          Open full tool →
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              <Link
                                to={`/tools?category=${activeCategory}`}
                                onClick={() => { setMegaMenuOpen(false); setActiveCategory(null); }}
                                className="block mt-2 px-3 py-2 text-[11px] text-white border-t border-[#1a1a1a] hover:bg-[#141414] rounded-sm"
                              >
                                View all {activeCatTools.length} tools →
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-[#404040] text-[12px]">
                            Hover a category to see tools
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`nav-tab flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-sm transition-colors ${
                  isActive ? 'text-white' : 'text-[#888] hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm text-[12px] text-[#888] hover:border-[#333] transition-all"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Search 286 tools</span>
            <kbd className="hidden sm:inline text-[9px] text-[#555] bg-[#111] px-1 py-0.5 rounded-sm border border-[#1a1a1a]">⌘K</kbd>
          </button>

          {searchOpen && (
            <div className="absolute top-full right-0 mt-2 w-[420px] mega-menu animate-scale">
              <div className="p-2 border-b border-[#1a1a1a]">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search tools, categories..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#000] border border-[#1a1a1a] rounded-sm text-[12px] text-white placeholder:text-[#404040] focus:outline-none focus:border-[#333]"
                    autoFocus
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-[320px] overflow-y-auto py-1">
                  {searchResults.map((tool, idx) => {
                    const ToolIcon = getToolIcon(tool.slug);
                    return (
                      <button
                        key={tool.slug}
                        onClick={() => selectTool(tool.slug)}
                        className="mega-menu-item w-full flex items-center gap-2.5 px-3 py-2 text-left stagger-item"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div className="icon-box w-7 h-7 shrink-0">
                          <ToolIcon size={13} className="text-[#888]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white truncate">{tool.title}</p>
                          <p className="text-[10px] text-[#555] truncate">{tool.description}</p>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${
                          tool.capability === 'browser-ready' ? 'badge-ready' :
                          tool.capability === 'browser-partial' ? 'badge-partial' :
                          tool.capability === 'ai-required' ? 'badge-ai' : 'badge-backend'
                        }`}>
                          {tool.capability === 'browser-ready' ? 'Local' :
                           tool.capability === 'browser-partial' ? 'Hybrid' :
                           tool.capability === 'ai-required' ? 'AI' : 'Cloud'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <div className="p-6 text-center text-[12px] text-[#555]">
                  No tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-0.5 ml-3">
          <Link to="/presets" className="p-2 text-[#888] hover:text-white transition-colors rounded-sm hover:bg-[#111]" title="Presets">
            <Bookmark size={15} />
          </Link>
          <Link to="/settings" className="p-2 text-[#888] hover:text-white transition-colors rounded-sm hover:bg-[#111]" title="Settings">
            <Settings size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
