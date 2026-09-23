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
  FileOutput,
  FilePlus2,
} from 'lucide-react';

const mainTabs = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Tools', path: '/tools', icon: Wrench, hasMegaMenu: true, menuType: 'all' },
  { label: 'Convert From PDF', path: '/tools?category=convert-from', icon: FileOutput, hasMegaMenu: true, menuType: 'convert-from' },
  { label: 'Convert To PDF', path: '/tools?category=convert-to', icon: FilePlus2, hasMegaMenu: true, menuType: 'convert-to' },
  { label: 'Workflows', path: '/workflows', icon: GitBranch },
  { label: 'History', path: '/history', icon: History },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug || '');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<number | undefined>(undefined);
  const activeMenuRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.length > 1 ? searchTools(searchQuery).slice(0, 6) : [];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (activeMenu || searchOpen) {
      document.documentElement.classList.add('menu-open');
    } else {
      document.documentElement.classList.remove('menu-open');
    }
    return () => document.documentElement.classList.remove('menu-open');
  }, [activeMenu, searchOpen]);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (activeMenuRef.current && !activeMenuRef.current.contains(e.target as Node) &&
          activeTabRef.current && !activeTabRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
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
        setActiveMenu(null);
        setActiveTool(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setActiveMenu(null);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleTabEnter = (menuType: string) => {
    if (menuTimeoutRef.current !== undefined) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = undefined;
    }
    setActiveMenu(menuType);
    
    // Set default category for this menu
    if (menuType === 'convert-from') {
      setActiveCategory('convert-from');
    } else if (menuType === 'convert-to') {
      setActiveCategory('convert-to');
    } else if (menuType === 'all') {
      setActiveCategory(categories[0]?.slug || '');
    }
  };

  const handleTabLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
      setActiveTool(null);
      menuTimeoutRef.current = undefined;
    }, 100);
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

  const selectTool = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setActiveMenu(null);
    setActiveTool(null);
    navigate(`/tools/${slug}`);
  };

  const activeCatTools = activeCategory ? getToolsByCategory(activeCategory) : [];
  const activeToolDef = activeTool ? toolRegistry.find(t => t.slug === activeTool) : null;

  // Get tools for specific category
  const getToolsForMenu = (menuType: string) => {
    if (menuType === 'convert-from') {
      return getToolsByCategory('convert-from');
    } else if (menuType === 'convert-to') {
      return getToolsByCategory('convert-to');
    }
    return [];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 top-bar">
      <div className="flex items-center h-14 px-6 max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mr-8">
          <img src="/pefixa-logo.svg" alt="Pefixa" className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-[15px] tracking-wide leading-none">PEFIXA</span>
            <span className="text-[9px] text-[#555] tracking-[0.2em] uppercase leading-none mt-0.5">PDF WORKSPACE</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="flex items-center gap-1">
          {mainTabs.map(tab => {
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            const hasMegaMenu = tab.hasMegaMenu;
            const menuType = tab.menuType;
            const isMenuOpen = activeMenu === menuType;

            if (hasMegaMenu) {
              return (
                <div
                  key={tab.path}
                  ref={isMenuOpen ? activeTabRef : undefined}
                  onMouseEnter={() => handleTabEnter(menuType!)}
                  onMouseLeave={handleTabLeave}
                  className="relative"
                >
                  <button
                    className={`nav-tab flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-md ${
                      isActive || isMenuOpen 
                        ? 'text-white bg-white/5' 
                        : 'text-[#888] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    <svg 
                      width="8" 
                      height="8" 
                      viewBox="0 0 8 8" 
                      className={`transition-transform duration-150 ${isMenuOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`nav-tab flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-md ${
                  isActive 
                    ? 'text-white bg-white/5' 
                    : 'text-[#888] hover:text-white hover:bg-white/5'
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
            onClick={() => { 
              setSearchOpen(!searchOpen); 
              setActiveMenu(null); 
              setTimeout(() => searchRef.current?.focus(), 50); 
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-[12px] text-[#888] hover:border-[#333] transition-colors"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Search 286 tools</span>
            <kbd className="hidden sm:inline text-[9px] text-[#555] bg-[#111] px-1.5 py-0.5 rounded border border-[#1a1a1a]">⌘K</kbd>
          </button>

          {searchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={() => setSearchOpen(false)}>
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative w-[500px] mega-menu animate-dropdown" onClick={e => e.stopPropagation()}>
                <div className="p-3 border-b border-[#1a1a1a]">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search tools, categories..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#000] border border-[#1a1a1a] rounded-md text-[13px] text-white placeholder:text-[#404040] focus:outline-none focus:border-[#333]"
                      autoFocus
                    />
                  </div>
                </div>
                {searchResults.length > 0 && (
                  <div className="max-h-[400px] overflow-y-auto py-2">
                    {searchResults.map(tool => {
                      const ToolIcon = getToolIcon(tool.slug);
                      return (
                        <button
                          key={tool.slug}
                          onClick={() => selectTool(tool.slug)}
                          className="mega-menu-item w-full flex items-center gap-3 px-4 py-2.5 text-left"
                        >
                          <div className="icon-box w-8 h-8 shrink-0">
                            <ToolIcon size={14} className="text-[#888]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-white truncate">{tool.title}</p>
                            <p className="text-[10px] text-[#555] truncate">{tool.description}</p>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
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
                  <div className="p-8 text-center text-[13px] text-[#555]">
                    No tools found for "{searchQuery}"
                  </div>
                )}
                {searchQuery.length <= 1 && (
                  <div className="p-3 border-t border-[#1a1a1a]">
                    <p className="text-[10px] text-[#404040] uppercase tracking-wider mb-2">Popular</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'rotate-pages'].map(slug => {
                        const tool = toolRegistry.find(t => t.slug === slug);
                        if (!tool) return null;
                        return (
                          <button
                            key={slug}
                            onClick={() => selectTool(slug)}
                            className="px-2.5 py-1 bg-[#111] hover:bg-[#1a1a1a] rounded-md text-[11px] text-[#888] hover:text-white"
                          >
                            {tool.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-0.5 ml-3">
          <Link 
            to="/presets" 
            className="p-2 text-[#888] hover:text-white rounded-md hover:bg-white/5" 
            title="Presets"
          >
            <Bookmark size={15} />
          </Link>
          <Link 
            to="/settings" 
            className="p-2 text-[#888] hover:text-white rounded-md hover:bg-white/5" 
            title="Settings"
          >
            <Settings size={15} />
          </Link>
        </div>
      </div>

      {/* Mega Menu for "Tools" (All Categories) */}
      {activeMenu === 'all' && (
        <div
          ref={activeMenuRef}
          onMouseEnter={() => handleTabEnter('all')}
          onMouseLeave={handleTabLeave}
          className="fixed left-0 right-0 z-40 animate-dropdown"
          style={{ top: '56px' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="mega-menu flex" style={{ height: '420px' }}>
              {/* Categories Column */}
              <div className="w-[220px] border-r border-[#1a1a1a] flex flex-col">
                <div className="px-3 py-2 border-b border-[#1a1a1a]">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#555] font-semibold">Categories</p>
                </div>
                <div className="flex-1 overflow-y-auto py-1.5">
                  {categories.map(cat => {
                    const tools = getToolsByCategory(cat.slug);
                    const isActive = activeCategory === cat.slug;
                    const CatIcon = getToolIcon(cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        onMouseEnter={() => handleCategoryEnter(cat.slug)}
                        onClick={() => { 
                          navigate(`/tools?category=${cat.slug}`); 
                          setActiveMenu(null); 
                        }}
                        className={`mega-menu-item w-full flex items-center gap-2 px-3 py-1.5 text-left ${
                          isActive ? 'bg-[#141414]' : ''
                        }`}
                      >
                        <div className={`icon-box w-6 h-6 shrink-0 ${
                          isActive ? 'bg-white border-white' : ''
                        }`}>
                          <CatIcon size={11} className={isActive ? 'text-black' : 'text-[#888]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-medium truncate ${
                            isActive ? 'text-white' : 'text-[#ccc]'
                          }`}>
                            {cat.title}
                          </p>
                          <p className="text-[9px] text-[#555]">{tools.length} tools</p>
                        </div>
                        <ChevronRight 
                          size={10} 
                          className={isActive ? 'text-white' : 'text-[#404040]'} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tools Column */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-3 py-2 border-b border-[#1a1a1a]">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#555] font-semibold">
                    {categories.find(c => c.slug === activeCategory)?.title}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto py-1.5">
                  {activeCatTools.map(tool => {
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
                          className={`mega-menu-item w-full flex items-center gap-2 px-3 py-1.5 text-left ${
                            isToolActive ? 'bg-[#141414]' : ''
                          }`}
                        >
                          <div className={`icon-box w-6 h-6 shrink-0 ${
                            isToolActive ? 'bg-white border-white' : ''
                          }`}>
                            <ToolIcon size={11} className={isToolActive ? 'text-black' : 'text-[#888]'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-medium truncate ${
                              isToolActive ? 'text-white' : 'text-[#ccc]'
                            }`}>
                              {tool.title}
                            </p>
                            <p className="text-[9px] text-[#555] truncate">{tool.description}</p>
                          </div>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                            tool.capability === 'browser-ready' ? 'badge-ready' :
                            tool.capability === 'browser-partial' ? 'badge-partial' :
                            tool.capability === 'ai-required' ? 'badge-ai' : 'badge-backend'
                          }`}>
                            {tool.capability === 'browser-ready' ? 'Local' :
                             tool.capability === 'browser-partial' ? 'Hybrid' :
                             tool.capability === 'ai-required' ? 'AI' : 'Cloud'}
                          </span>
                          {tool.options.length > 0 && (
                            <ChevronRight 
                              size={10} 
                              className={`text-[#404040] shrink-0 ${
                                isToolActive ? 'text-white' : ''
                              }`} 
                            />
                          )}
                        </button>
                      </div>
                    );
                  })}
                  <div className="px-3 py-2 border-t border-[#1a1a1a]">
                    <Link
                      to={`/tools?category=${activeCategory}`}
                      onClick={() => setActiveMenu(null)}
                      className="text-[10px] text-white hover:text-[#ccc] inline-flex items-center gap-1"
                    >
                      View all {activeCatTools.length} tools 
                      <ChevronRight size={9} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tool Details Submenu */}
              {activeToolDef && activeToolDef.options.length > 0 && (
                <div className="w-[200px] border-l border-[#1a1a1a] bg-[#0a0a0a] animate-submenu overflow-y-auto">
                  <div className="px-3 py-2 border-b border-[#1a1a1a]">
                    <p className="text-[11px] font-semibold text-white">{activeToolDef.title}</p>
                    <p className="text-[9px] text-[#555] mt-0.5">{activeToolDef.description}</p>
                  </div>
                  <div className="px-3 py-1.5">
                    <p className="text-[8px] uppercase tracking-wider text-[#555] font-semibold mb-1.5">Options</p>
                    {activeToolDef.options.slice(0, 6).map(opt => (
                      <div key={opt.key} className="py-1 text-[10px]">
                        <span className="text-[#666]">{opt.label}: </span>
                        <span className="text-[#aaa]">{String(opt.default)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-[#1a1a1a]">
                    <Link
                      to={`/tools/${activeToolDef.slug}`}
                      onClick={() => { 
                        setActiveMenu(null); 
                        setActiveTool(null); 
                      }}
                      className="text-[10px] text-white hover:text-[#ccc] inline-flex items-center gap-1"
                    >
                      Open full tool 
                      <ChevronRight size={9} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu for "Convert From PDF" */}
      {activeMenu === 'convert-from' && (
        <div
          ref={activeMenuRef}
          onMouseEnter={() => handleTabEnter('convert-from')}
          onMouseLeave={handleTabLeave}
          className="fixed left-0 right-0 z-40 animate-dropdown"
          style={{ top: '56px' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="mega-menu" style={{ height: 'auto', maxHeight: '500px' }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-white mb-1">Convert From PDF</h3>
                    <p className="text-[11px] text-[#888]">Transform PDF to other formats</p>
                  </div>
                  <Link
                    to="/tools?category=convert-from"
                    onClick={() => setActiveMenu(null)}
                    className="text-[10px] text-white hover:text-[#ccc] inline-flex items-center gap-1"
                  >
                    View all tools <ChevronRight size={9} />
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {getToolsForMenu('convert-from').map(tool => {
                    const ToolIcon = getToolIcon(tool.slug);
                    return (
                      <button
                        key={tool.slug}
                        onClick={() => selectTool(tool.slug)}
                        className="mega-menu-item flex items-center gap-2 px-3 py-2 text-left rounded-md"
                      >
                        <div className="icon-box w-6 h-6 shrink-0">
                          <ToolIcon size={11} className="text-[#888]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-[#ccc] truncate">{tool.title}</p>
                          <p className="text-[9px] text-[#555] truncate">{tool.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu for "Convert To PDF" */}
      {activeMenu === 'convert-to' && (
        <div
          ref={activeMenuRef}
          onMouseEnter={() => handleTabEnter('convert-to')}
          onMouseLeave={handleTabLeave}
          className="fixed left-0 right-0 z-40 animate-dropdown"
          style={{ top: '56px' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="mega-menu" style={{ height: 'auto', maxHeight: '500px' }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-white mb-1">Convert To PDF</h3>
                    <p className="text-[11px] text-[#888]">Create PDF from other formats</p>
                  </div>
                  <Link
                    to="/tools?category=convert-to"
                    onClick={() => setActiveMenu(null)}
                    className="text-[10px] text-white hover:text-[#ccc] inline-flex items-center gap-1"
                  >
                    View all tools <ChevronRight size={9} />
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {getToolsForMenu('convert-to').map(tool => {
                    const ToolIcon = getToolIcon(tool.slug);
                    return (
                      <button
                        key={tool.slug}
                        onClick={() => selectTool(tool.slug)}
                        className="mega-menu-item flex items-center gap-2 px-3 py-2 text-left rounded-md"
                      >
                        <div className="icon-box w-6 h-6 shrink-0">
                          <ToolIcon size={11} className="text-[#888]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-[#ccc] truncate">{tool.title}</p>
                          <p className="text-[9px] text-[#555] truncate">{tool.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
