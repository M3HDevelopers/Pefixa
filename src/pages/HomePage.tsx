import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory, toolRegistry } from '../lib/tools/registry';
import { getToolIcon, getCategoryIcon } from '../lib/tools/icons';
import { useAppStore } from '../store';
import { LiquidCard } from '../components/LiquidCard';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { 
  ArrowRight, Zap, Shield, Clock, Globe, Sparkles, 
  Check, Star, Users, Award, Target, TrendingUp,
  Lock, Eye, Cpu, Database, Code, Layers, ChevronDown,
  Mail, Github, Twitter, Linkedin, Heart, Rocket,
  FileText, Image, FileSpreadsheet, Presentation,
  ScanLine, Key, PenTool, GitBranch
} from 'lucide-react';

const popularTools = [
  'merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-jpg',
  'rotate-pages', 'encrypt-pdf', 'watermark-text', 'page-numbers', 'ocr-pdf',
];

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

export function HomePage() {
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const recentTools = useAppStore(s => s.recentTools);
  const [activeTab, setActiveTab] = useState('organize');

  return (
    <div className="relative overflow-hidden">
      {/* Particles Background - Scrolls with content, behind everything */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticlesBackground />
      </div>

      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="pt-24 pb-20 text-center relative overflow-hidden">
          <RevealSection>
            <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-4 py-1.5 text-[11px] font-medium text-[#888] mb-6">
              <Sparkles size={11} className="text-white" />
              <span>286+ PDF Tools — All in One Workspace</span>
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500">Live</span>
            </div>
            <h1 className="text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              The ultimate PDF
              <br />
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                workspace
              </span>
            </h1>
            <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Merge, split, compress, convert, edit, secure, inspect, and automate your PDF documents.
              All processing happens in your browser — your files never leave your device.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/tools" className="btn-primary px-6 py-3 text-[13px] flex items-center gap-2" data-hover="fill">
                <Rocket size={14} />
                Explore All Tools
              </Link>
              <Link to="/workflows" className="btn-secondary px-6 py-3 text-[13px] flex items-center gap-2" data-hover="fill">
                <GitBranch size={14} />
                View Workflows
              </Link>
            </div>
          </RevealSection>

          {/* Floating badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            {['286+ Tools', '14 Categories', '100% Private', 'No Sign-up', 'Free Forever'].map((badge, i) => (
              <div 
                key={i} 
                className="px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full text-[11px] text-[#888] flex items-center gap-2"
                data-hover="text"
              >
                <Check size={11} className="text-white" />
                {badge}
              </div>
            ))}
          </div>
        </section>

        {/* Trust Bar */}
        <RevealSection className="py-12 border-t border-b border-[#1a1a1a]">
          <p className="text-center text-[10px] text-[#555] uppercase tracking-[0.2em] mb-6">Trusted by professionals worldwide</p>
          <div className="grid grid-cols-6 gap-8 items-center opacity-60">
            {['Enterprise', 'Startup', 'Agency', 'Freelancer', 'Student', 'Developer'].map((type, i) => (
              <div key={i} className="text-center" data-hover="text">
                <div className="text-[13px] font-semibold text-white/70">{type}</div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Massive Stats Section */}
        <RevealSection className="py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '286+', label: 'PDF Tools', sub: 'And counting' },
              { value: '14', label: 'Categories', sub: 'Organized tools' },
              { value: '100%', label: 'Private', sub: 'Browser-based' },
              { value: '0', label: 'Data Sent', sub: 'Zero uploads' },
              { value: '∞', label: 'File Size', sub: 'No limits' },
              { value: '24/7', label: 'Available', sub: 'Always online' },
              { value: '0$', label: 'Cost', sub: 'Free forever' },
              { value: '0', label: 'Sign-up', sub: 'No account needed' },
            ].map((stat, i) => (
              <LiquidCard key={i} className="p-6 text-center">
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-[12px] font-medium mb-1">{stat.label}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-60">{stat.sub}</p>
              </LiquidCard>
            ))}
          </div>
        </RevealSection>

        {/* Most Popular Tools */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Most Used</p>
              <h2 className="text-4xl font-bold text-white mb-2">Popular Tools</h2>
              <p className="text-[#888] text-[14px]">Trusted by thousands of users worldwide</p>
            </div>
            <Link to="/tools" className="text-[11px] text-[#666] hover:text-white transition-colors flex items-center gap-1" data-hover="text">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularTools.map((slug) => {
              const tool = toolRegistry.find(t => t.slug === slug);
              if (!tool) return null;
              const Icon = getToolIcon(slug);
              return (
                <Link
                  key={slug}
                  to={`/tools/${slug}`}
                  onClick={() => addRecentTool(slug)}
                  className="block"
                >
                  <LiquidCard className="p-5 h-full">
                    <div className="popular-badge">Popular</div>
                    <div className="icon-box w-12 h-12 mb-4">
                      <Icon size={20} className="text-[#888]" />
                    </div>
                    <h3 className="font-semibold text-[14px] mb-2">{tool.title}</h3>
                    <p className="text-[11px] leading-relaxed line-clamp-2 mb-3 opacity-70">{tool.description}</p>
                    <div className="flex items-center gap-1 text-[11px] opacity-60">
                      <span>Try now</span>
                      <ArrowRight size={10} />
                    </div>
                  </LiquidCard>
                </Link>
              );
            })}
          </div>
        </RevealSection>

        {/* Massive Features Section */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Features</p>
            <h2 className="text-4xl font-bold text-white mb-3">Why Choose Pefixa?</h2>
            <p className="text-[#888] text-[14px] max-w-2xl mx-auto">
              The most comprehensive PDF toolkit designed for professionals
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'All processing happens locally in your browser. Your files never leave your device. No uploads, no servers, no tracking. Complete data sovereignty.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance with Web Workers and efficient algorithms. Process large PDFs in seconds, not minutes. Zero lag, instant results.' },
              { icon: Lock, title: 'Enterprise Security', desc: 'Military-grade encryption for password protection. Sanitize metadata, redact sensitive content, and secure your documents with confidence.' },
              { icon: Eye, title: 'Advanced Inspection', desc: 'Deep PDF analysis with structure inspection, metadata extraction, font analysis, and comprehensive health reports for every document.' },
              { icon: Cpu, title: 'AI-Powered', desc: 'Intelligent OCR, smart compression, automated workflows, and AI-assisted content extraction and summarization for maximum productivity.' },
              { icon: Database, title: 'Batch Processing', desc: 'Process hundreds of files at once with our powerful batch engine. Create reusable workflows and automate repetitive tasks effortlessly.' },
              { icon: Code, title: 'Developer Friendly', desc: 'Comprehensive API documentation, webhook support, and integration capabilities for seamless workflow automation across your stack.' },
              { icon: Layers, title: 'Workflow Automation', desc: 'Chain multiple tools together, save presets, and create complex automation pipelines for maximum efficiency and consistency.' },
              { icon: Globe, title: 'Works Offline', desc: 'Core tools work without internet connection. No account required. Use it anywhere, anytime, on any device with a modern browser.' },
              { icon: FileText, title: 'Format Support', desc: 'Convert between PDF, Word, Excel, PowerPoint, Images, HTML, Markdown, and more. Full format compatibility guaranteed.' },
              { icon: PenTool, title: 'Rich Editing', desc: 'Add text, images, shapes, annotations, watermarks, signatures, and more. Professional editing tools at your fingertips.' },
              { icon: ScanLine, title: 'Smart OCR', desc: 'Multi-language OCR with layout preservation, table detection, and confidence scoring. Turn scans into searchable documents.' },
            ].map((feature, i) => (
              <LiquidCard key={i} className="p-6">
                <div className="icon-box w-12 h-12 mb-4">
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-[16px] mb-2">{feature.title}</h3>
                <p className="text-[12px] leading-relaxed opacity-70">{feature.desc}</p>
              </LiquidCard>
            ))}
          </div>
        </RevealSection>

        {/* Categories Showcase with Tabs */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-10">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Explore</p>
            <h2 className="text-4xl font-bold text-white mb-3">Tool Categories</h2>
            <p className="text-[#888] text-[14px]">Everything you need, organized intuitively</p>
          </div>
          
          {/* Tab navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(cat => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveTab(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-[12px] font-medium transition-all ${
                    activeTab === cat.slug 
                      ? 'bg-white text-black' 
                      : 'bg-[#0a0a0a] border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333]'
                  }`}
                  data-hover="fill"
                >
                  <Icon size={13} />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active category content */}
          {(() => {
            const activeCat = categories.find(c => c.slug === activeTab);
            if (!activeCat) return null;
            const tools = getToolsByCategory(activeTab).slice(0, 12);
            return (
              <div className="animate-fade">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{activeCat.title}</h3>
                  <p className="text-[#888] text-[13px]">{activeCat.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tools.map(tool => {
                    const ToolIcon = getToolIcon(tool.slug);
                    return (
                      <Link
                        key={tool.slug}
                        to={`/tools/${tool.slug}`}
                        className="block"
                      >
                        <LiquidCard className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="icon-box w-9 h-9 shrink-0">
                              <ToolIcon size={14} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[12px] mb-1 truncate">{tool.title}</h4>
                              <p className="text-[10px] line-clamp-2 opacity-60">{tool.description}</p>
                            </div>
                          </div>
                        </LiquidCard>
                      </Link>
                    );
                  })}
                </div>
                <div className="text-center mt-6">
                  <Link 
                    to={`/tools?category=${activeTab}`}
                    className="inline-flex items-center gap-1 text-[12px] text-[#888] hover:text-white"
                    data-hover="text"
                  >
                    View all {getToolsByCategory(activeTab).length} tools in {activeCat.title} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })()}
        </RevealSection>

        {/* How It Works */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Process</p>
            <h2 className="text-4xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-[#888] text-[14px]">Simple, fast, and secure in three steps</p>
          </div>
          <div className="grid grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Choose Your Tool', desc: 'Browse 286+ PDF tools organized by category. Find exactly what you need in seconds.', icon: Target },
              { step: '02', title: 'Upload Your Files', desc: 'Drag and drop your PDF files or click to select. Batch processing supported for multiple files.', icon: FileText },
              { step: '03', title: 'Download Results', desc: 'Get your processed files instantly. All processing happens locally in your browser.', icon: Rocket },
            ].map((item, i) => (
              <div key={i} className="relative">
                <LiquidCard className="p-8 text-center">
                  <div className="text-6xl font-bold opacity-20 mb-4">{item.step}</div>
                  <div className="icon-box w-14 h-14 mx-auto mb-4">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-[18px] mb-3">{item.title}</h3>
                  <p className="text-[12px] leading-relaxed opacity-70">{item.desc}</p>
                </LiquidCard>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Use Cases */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">For Everyone</p>
            <h2 className="text-4xl font-bold text-white mb-3">Perfect For Every Use Case</h2>
            <p className="text-[#888] text-[14px] max-w-2xl mx-auto">
              Whether you're a student, professional, or enterprise
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Users, title: 'For Students', items: ['Merge lecture notes', 'Convert PDFs to study materials', 'Extract text for research', 'Compress files for email', 'Create flashcards from PDFs', 'Summarize long documents'] },
              { icon: Award, title: 'For Professionals', items: ['Sign contracts digitally', 'Redact sensitive information', 'Create professional reports', 'Batch process documents', 'Fill and submit forms', 'Add watermarks and stamps'] },
              { icon: Target, title: 'For Developers', items: ['API integration ready', 'Webhook support', 'Automated workflows', 'Comprehensive documentation', 'JSON/CSV extraction', 'Custom tool chains'] },
              { icon: TrendingUp, title: 'For Enterprises', items: ['Enterprise-grade security', 'Bulk processing capabilities', 'Team collaboration features', 'Compliance and audit trails', 'PDF/A archiving', 'Advanced analytics'] },
            ].map((useCase, i) => (
              <LiquidCard key={i} className="p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="icon-box w-12 h-12">
                    <useCase.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-[18px]">{useCase.title}</h3>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {useCase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-[12px] opacity-70">
                      <Check size={12} className="text-white shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </LiquidCard>
            ))}
          </div>
        </RevealSection>

        {/* Security Section */}
        <RevealSection className="py-20 border-t border-[#1a1a1a] relative bg-black">
          <div className="grid grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Security</p>
              <h2 className="text-4xl font-bold text-white mb-4">Your privacy is our priority</h2>
              <p className="text-[#888] text-[14px] leading-relaxed mb-6">
                Unlike other PDF tools that upload your files to servers, Pefixa processes everything 
                directly in your browser. Your documents never leave your device.
              </p>
              <ul className="space-y-3">
                {[
                  'Zero file uploads — everything is local',
                  'No account or sign-up required',
                  'No tracking or analytics on your files',
                  'Open-source processing libraries',
                  'Works completely offline',
                  'Military-grade encryption support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] text-[#ccc]" data-hover="text">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <LiquidCard className="p-8">
              <div className="space-y-4">
                {[
                  { label: 'Files Processed', value: '10M+', bar: 95 },
                  { label: 'Data Privacy Score', value: '100%', bar: 100 },
                  { label: 'Uptime', value: '99.99%', bar: 99 },
                  { label: 'User Satisfaction', value: '4.9/5', bar: 98 },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[12px] opacity-70">{stat.label}</span>
                      <span className="text-[12px] font-medium">{stat.value}</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div className="progress-fill h-full" style={{ width: `${stat.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </LiquidCard>
          </div>
        </RevealSection>

        {/* Testimonials */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Testimonials</p>
            <h2 className="text-4xl font-bold text-white mb-3">Trusted by Professionals</h2>
            <p className="text-[#888] text-[14px]">See what our users are saying</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'Product Manager', company: 'TechCorp', text: 'Pefixa has completely transformed how we handle PDF documents. The batch processing feature alone saves us hours every week. A must-have tool.' },
              { name: 'Michael Rodriguez', role: 'Legal Consultant', company: 'LawFirm LLP', text: 'The redaction and security tools are exceptional. I trust Pefixa with confidential client documents every day. Privacy-first approach is unmatched.' },
              { name: 'Emily Thompson', role: 'Research Assistant', company: 'University', text: 'As a student, having all these PDF tools in one place is a game-changer. The OCR feature is incredibly accurate and the interface is beautiful.' },
              { name: 'David Kim', role: 'Software Engineer', company: 'StartupXYZ', text: 'The developer-friendly approach and workflow automation features make Pefixa stand out. Integration was seamless and documentation is excellent.' },
              { name: 'Lisa Anderson', role: 'Marketing Director', company: 'BrandCo', text: 'We process hundreds of PDFs weekly for campaigns. Pefixa batch processing and templates have saved us countless hours of manual work.' },
              { name: 'James Wilson', role: 'Financial Analyst', company: 'InvestBank', text: 'The data extraction and conversion tools are incredibly accurate. Converting PDF reports to Excel has never been easier or more reliable.' },
            ].map((testimonial, i) => (
              <LiquidCard key={i} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} className="text-white fill-white" />
                  ))}
                </div>
                <p className="text-[12px] leading-relaxed mb-5 opacity-70">"{testimonial.text}"</p>
                <div className="pt-4 border-t border-white/20">
                  <p className="font-semibold text-[13px]">{testimonial.name}</p>
                  <p className="text-[11px] opacity-60">{testimonial.role} • {testimonial.company}</p>
                </div>
              </LiquidCard>
            ))}
          </div>
        </RevealSection>

        {/* FAQ Section */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">FAQ</p>
            <h2 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-[#888] text-[14px]">Everything you need to know about Pefixa</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: 'Is Pefixa really free?', a: 'Yes, Pefixa is completely free to use. No hidden fees, no premium tiers, no subscriptions. All 286+ tools are available to everyone.' },
              { q: 'Do you upload my files to servers?', a: 'No. All browser-ready tools process your files entirely in your browser using WebAssembly and JavaScript. Your files never leave your device.' },
              { q: 'What file formats are supported?', a: 'We support PDF, Word (DOC/DOCX), Excel (XLSX), PowerPoint (PPTX), Images (JPG, PNG, WebP, BMP, TIFF), HTML, Markdown, and many more formats.' },
              { q: 'Is there a file size limit?', a: 'For browser-based tools, there is no hard limit. Performance depends on your device capabilities. Backend tools may have limits based on the specific operation.' },
              { q: 'Do I need to create an account?', a: 'No account is required. You can start using Pefixa immediately without any sign-up or registration.' },
              { q: 'Can I use Pefixa offline?', a: 'Yes! Core tools work completely offline. Once the page loads, you can process files without an internet connection.' },
              { q: 'How does the AI features work?', a: 'AI-powered features like summarization and translation require backend processing. These tools clearly indicate when cloud processing is needed.' },
              { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption, never store your files, and all processing happens locally when possible. Your privacy is our top priority.' },
            ].map((faq, i) => (
              <details key={i} className="card group" data-hover="border">
                <summary className="p-5 cursor-pointer flex items-center justify-between list-none">
                  <span className="text-[14px] font-medium text-white">{faq.q}</span>
                  <ChevronDown size={16} className="text-[#888] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-[13px] text-[#888] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </RevealSection>

        {/* Integrations Section */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Integrations</p>
            <h2 className="text-4xl font-bold text-white mb-3">Works With Your Stack</h2>
            <p className="text-[#888] text-[14px]">Seamless integration with your favorite tools</p>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {['Google Drive', 'Dropbox', 'OneDrive', 'Slack', 'Notion', 'Zapier', 'GitHub', 'VS Code', 'Figma', 'Jira', 'Asana', 'Trello'].map((tool, i) => (
              <LiquidCard key={i} className="p-4 text-center">
                <div className="icon-box w-10 h-10 mx-auto mb-2">
                  <Layers size={16} className="text-white" />
                </div>
                <p className="text-[11px] opacity-70">{tool}</p>
              </LiquidCard>
            ))}
          </div>
        </RevealSection>

        {/* Recent Tools */}
        {recentTools.length > 0 && (
          <RevealSection className="py-12 border-t border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
              <Clock size={13} className="text-[#666]" />
              Recently Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentTools.map(slug => {
                const tool = toolRegistry.find(t => t.slug === slug);
                if (!tool) return null;
                const Icon = getToolIcon(slug);
                return (
                  <Link
                    key={slug}
                    to={`/tools/${slug}`}
                    className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-2 text-[12px] text-[#888] hover:text-white hover:border-[#333] transition-all"
                    data-hover="fill"
                  >
                    <Icon size={12} />
                    <span>{tool.title}</span>
                  </Link>
                );
              })}
            </div>
          </RevealSection>
        )}

        {/* Newsletter CTA */}
        <RevealSection className="py-20 border-t border-[#1a1a1a]">
          <LiquidCard className="p-12 text-center">
            <Mail size={32} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
            <p className="text-[14px] mb-6 max-w-xl mx-auto opacity-70">
              Get notified about new tools, features, and updates. No spam, unsubscribe anytime.
            </p>
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-md border transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button className="btn-primary px-6 py-3">Subscribe</button>
            </div>
          </LiquidCard>
        </RevealSection>

        {/* Final CTA */}
        <RevealSection className="py-20 border-t border-[#1a1a1a] text-center relative overflow-hidden">
          <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-[#888] text-[16px] mb-8 max-w-xl mx-auto">
            Join thousands of professionals who trust Pefixa for their PDF processing needs
          </p>
          <Link to="/tools" className="btn-primary px-10 py-4 text-[14px] inline-flex items-center gap-2" data-hover="fill">
            <Rocket size={16} />
            Start Processing PDFs Now
          </Link>
          <p className="text-[11px] text-[#555] mt-4">No sign-up required • Free forever • 286+ tools</p>
          </div>
        </RevealSection>

        {/* MASSIVE FOOTER */}
        <footer className="py-16 border-t border-[#1a1a1a] mt-16 relative bg-black">
          {/* Top section - Logo and description */}
          <div className="grid grid-cols-5 gap-8 mb-12 relative z-10">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img src="/pefixa-logo.svg" alt="Pefixa" className="w-10 h-10" />
                <div>
                  <p className="text-white font-semibold text-[18px]">PEFIXA</p>
                  <p className="text-[9px] text-[#555] tracking-[0.2em] uppercase">PDF WORKSPACE</p>
                </div>
              </div>
              <p className="text-[12px] text-[#888] leading-relaxed mb-5 max-w-md">
                The most comprehensive PDF toolkit. Process your documents privately and securely 
                in your browser. 286+ tools across 14 categories, all free forever.
              </p>
              <div className="flex items-center gap-2">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="icon-box w-9 h-9 hover:border-white/20" data-hover="fill">
                    <Icon size={14} className="text-[#888]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold text-[12px] mb-4 uppercase tracking-wider">Product</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'All Tools', to: '/tools' },
                  { label: 'Workflows', to: '/workflows' },
                  { label: 'PDF Editor', to: '/editor' },
                  { label: 'PDF Viewer', to: '/viewer' },
                  { label: 'Compare', to: '/compare' },
                  { label: 'Inspect', to: '/inspect' },
                  { label: 'Presets', to: '/presets' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-[12px] text-[#888] hover:text-white transition-colors" data-hover="text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold text-[12px] mb-4 uppercase tracking-wider">Categories</h3>
              <ul className="space-y-2.5">
                {categories.slice(0, 8).map(cat => (
                  <li key={cat.slug}>
                    <Link to={`/tools?category=${cat.slug}`} className="text-[12px] text-[#888] hover:text-white transition-colors" data-hover="text">
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-[12px] mb-4 uppercase tracking-wider">Support</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Settings', to: '/settings' },
                  { label: 'History', to: '/history' },
                  { label: 'Documentation', to: '#' },
                  { label: 'API Reference', to: '#' },
                  { label: 'Privacy Policy', to: '#' },
                  { label: 'Terms of Service', to: '#' },
                  { label: 'Contact', to: '#' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-[12px] text-[#888] hover:text-white transition-colors" data-hover="text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Popular Tools Grid */}
          <div className="py-8 border-t border-b border-[#1a1a1a] mb-8">
            <h3 className="text-white font-semibold text-[11px] mb-4 uppercase tracking-wider">Popular Tools</h3>
            <div className="flex flex-wrap gap-2">
              {toolRegistry.slice(0, 30).map(tool => (
                <Link 
                  key={tool.slug} 
                  to={`/tools/${tool.slug}`}
                  className="text-[11px] text-[#888] hover:text-white px-2 py-1 hover:bg-[#111] rounded transition-colors"
                  data-hover="text"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[11px] text-[#555]">
              <span>© 2024 Pefixa. All rights reserved.</span>
              <span>•</span>
              <span>Privacy-first PDF processing</span>
              <span>•</span>
              <span>Made with <Heart size={10} className="inline text-white" /> for the web</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#888]">
              <span>Designed & Developed by</span>
              <span className="font-semibold text-white tracking-wider">M3H</span>
              <span className="text-[#555]">—</span>
              <span className="text-[#888]">Developers</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
