import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { categories, CategoryInfo } from '../lib/tools/categories';
import { getToolsByCategory, searchTools, toolRegistry } from '../lib/tools/registry';
import { useAppStore } from '../store';
import {
  Search,
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
  Search as SearchIcon,
  Download,
  Code,
  Zap,
  GitBranch,
  Plus,
  Eye,
  Settings,
  Bookmark,
  History,
  Home,
  Wrench,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Layout, Edit3, FileText, ArrowRight, ArrowLeft, Minimize2, ScanText,
  Shield, Search: SearchIcon, Download, Code, Zap, GitBranch, Plus, Eye,
};

interface MegaMenuState {
  openCategory: string | null;
  openSubmenu: string | null;
}

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [megaMenu, setMegaMenu] = useState<MegaMenuState>({ openCategory: null, openSubmenu: null });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<number | undefined>(undefined);

  const searchResults = searchQuery.length > 1 ? searchTools(searchQuery).slice(0, 8) : [];

  const handleCategoryEnter = (slug: string) => {
    if (menuTimeoutRef.current !== undefined) {
      clearTimeout(menuTimeoutRef.current);
    }
    setMegaMenu({ openCategory: slug, openSubmenu: null });
  };

  const handleCategoryLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setMegaMenu({ openCategory: null, openSubmenu: null });
    }, 150);
  };

  const handleSubmenuEnter = (toolSlug: string) => {
    setMegaMenu(prev => ({ ...prev, openSubmenu: toolSlug }));
  };

  const handleSubmenuLeave = () => {
    setMegaMenu(prev => ({ ...prev, openSubmenu: null }));
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setMegaMenu({ openCategory: null, openSubmenu: null });
    }, 200);
  };

  const selectTool = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setMegaMenu({ openCategory: null, openSubmenu: null });
    navigate(`/tools/${slug}`);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMegaMenu({ openCategory: null, openSubmenu: null });
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

  const mainTabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Editor', path: '/editor', icon: Edit3 },
    { label: 'Viewer', path: '/viewer', icon: Eye },
    { label: 'Compare', path: '/compare', icon: GitBranch },
    { label: 'Workflows', path: '/workflows', icon: GitBranch },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#1f1f1f]">
      <div className="flex items-center h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-6 shrink-0">
          <div className="w-8 h-8 bg-white flex items-center justify-center" style={{ borderRadius: '2px' }}>
            <span className="text-black font-bold text-sm tracking-tight">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-[15px] tracking-wide leading-none">PEFIXA</span>
            <span className="text-[9px] text-[#666] tracking-widest uppercase leading-none mt-0.5">PDF Workspace</span>
          </div>
        </Link>

        {/* Main Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-0.5 mr-4">
          {mainTabs.map(tab => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
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

          {/* Category Mega Menu Tabs */}
          <div className="flex items-center" onMouseLeave={handleMenuLeave}>
            {categories.slice(0, 7).map(cat => {
              const Icon = iconMap[cat.icon] || Wrench;
              const isOpen = megaMenu.openCategory === cat.slug;
              const tools = getToolsByCategory(cat.slug);

              return (
                <div key={cat.slug} className="relative" onMouseEnter={() => handleCategoryEnter(cat.slug)}>
                  <button
                    className={`nav-tab flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium rounded-sm transition-colors ${
                      isOpen ? 'text-white' : 'text-[#888] hover:text-white'
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden xl:inline">{cat.title}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {isOpen && (
                    <div
                      className="mega-menu absolute top-full left-0 mt-0 w-[320px] animate-slide-down"
                      onMouseEnter={() => handleCategoryEnter(cat.slug)}
                    >
                      <div className="p-2 border-b border-[#1f1f1f]">
                        <p className="text-[10px] uppercase tracking-wider text-[#555] font-semibold px-2 py-1">
                          {cat.title} — {tools.length} tools
                        </p>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto py-1">
                        {tools.slice(0, 25).map(tool => (
                          <div
                            key={tool.slug}
                            className="relative"
                            onMouseEnter={() => handleSubmenuEnter(tool.slug)}
                            onMouseLeave={handleSubmenuLeave}
                          >
                            <button
                              onClick={() => selectTool(tool.slug)}
                              className="mega-menu-item w-full flex items-center gap-2 px-3 py-2 text-left"
                            >
                              <div className="w-6 h-6 bg-[#1a1a1a] flex items-center justify-center shrink-0" style={{ borderRadius: '2px' }}>
                                <Icon size={11} className="text-[#888]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-white truncate">{tool.title}</p>
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
                                <ChevronRight size={10} className="text-[#444]" />
                              )}
                            </button>

                            {/* Sub-menu on hover */}
                            {megaMenu.openSubmenu === tool.slug && tool.options.length > 0 && (
                              <div className="mega-menu absolute left-full top-0 ml-0.5 w-[220px] animate-slide-right z-50">
                                <div className="p-2 border-b border-[#1f1f1f]">
                                  <p className="text-[11px] font-medium text-white">{tool.title}</p>
                                  <p className="text-[10px] text-[#555]">Options</p>
                                </div>
                                <div className="py-1">
                                  {tool.options.slice(0, 6).map(opt => (
                                    <div key={opt.key} className="px-3 py-1.5 text-[11px] text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                                      <span className="text-[#555]">{opt.label}:</span>{' '}
                                      <span className="text-[#aaa]">{String(opt.default)}</span>
                                    </div>
                                  ))}
                                  <Link
                                    to={`/tools/${tool.slug}`}
                                    className="block px-3 py-2 text-[11px] text-[#4da6ff] hover:bg-[#1a1a1a] border-t border-[#1f1f1f] mt-1"
                                    onClick={() => setMegaMenu({ openCategory: null, openSubmenu: null })}
                                  >
                                    Open full tool →
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {tools.length > 25 && (
                          <Link
                            to={`/tools?category=${cat.slug}`}
                            className="block px-3 py-2 text-[11px] text-[#4da6ff] hover:bg-[#1a1a1a] border-t border-[#1f1f1f]"
                            onClick={() => setMegaMenu({ openCategory: null, openSubmenu: null })}
                          >
                            View all {tools.length} tools →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm text-[13px] text-[#888] hover:border-[#333] transition-colors"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline text-[10px] text-[#555] bg-[#111] px-1 py-0.5 rounded-sm border border-[#222]">⌘K</kbd>
          </button>

          {searchOpen && (
            <div className="absolute top-full right-0 mt-1 w-[400px] mega-menu animate-scale-in">
              <div className="p-2 border-b border-[#1f1f1f]">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search 286 tools..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#000] border border-[#1f1f1f] rounded-sm text-[13px] text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]"
                    autoFocus
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-[300px] overflow-y-auto py-1">
                  {searchResults.map(tool => (
                    <button
                      key={tool.slug}
                      onClick={() => selectTool(tool.slug)}
                      className="mega-menu-item w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <div className="w-6 h-6 bg-[#1a1a1a] flex items-center justify-center shrink-0" style={{ borderRadius: '2px' }}>
                        <FileText size={11} className="text-[#888]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white truncate">{tool.title}</p>
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
                  ))}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <div className="p-4 text-center text-[12px] text-[#555]">
                  No tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 ml-3">
          <Link to="/history" className="p-2 text-[#888] hover:text-white transition-colors rounded-sm hover:bg-[#1a1a1a]">
            <History size={15} />
          </Link>
          <Link to="/presets" className="p-2 text-[#888] hover:text-white transition-colors rounded-sm hover:bg-[#1a1a1a]">
            <Bookmark size={15} />
          </Link>
          <Link to="/settings" className="p-2 text-[#888] hover:text-white transition-colors rounded-sm hover:bg-[#1a1a1a]">
            <Settings size={15} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#888] hover:text-white ml-2"
        >
          <div className="flex flex-col gap-1">
            <span className="w-4 h-px bg-current"></span>
            <span className="w-4 h-px bg-current"></span>
            <span className="w-4 h-px bg-current"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1f1f1f] bg-black animate-slide-down">
          <div className="p-3 space-y-1">
            {mainTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#888] hover:text-white hover:bg-[#1a1a1a] rounded-sm"
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-[#1f1f1f] my-2" />
            {categories.map(cat => {
              const Icon = iconMap[cat.icon] || Wrench;
              const tools = getToolsByCategory(cat.slug);
              return (
                <details key={cat.slug} className="group">
                  <summary className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#888] hover:text-white cursor-pointer list-none">
                    <Icon size={14} />
                    <span className="flex-1">{cat.title}</span>
                    <span className="text-[10px] text-[#555]">{tools.length}</span>
                    <ChevronDown size={11} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="ml-6 border-l border-[#1f1f1f] pl-2 py-1">
                    {tools.slice(0, 10).map(tool => (
                      <Link
                        key={tool.slug}
                        to={`/tools/${tool.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-2 py-1 text-[11px] text-[#666] hover:text-white"
                      >
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
