import { Link } from 'react-router-dom';
import { categories } from '../lib/tools/categories';
import { getToolsByCategory, toolRegistry } from '../lib/tools/registry';
import { getToolIcon, getCategoryIcon } from '../lib/tools/icons';
import { useAppStore } from '../store';
import { 
  ArrowRight, Zap, Shield, Clock, Globe, Sparkles, 
  Check, Star, Users, Award, Target, TrendingUp,
  Lock, Eye, Cpu, Database, Code, Layers
} from 'lucide-react';

const popularTools = [
  'merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-jpg',
  'rotate-pages', 'encrypt-pdf', 'watermark-text', 'page-numbers', 'ocr-pdf',
];

export function HomePage() {
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const recentTools = useAppStore(s => s.recentTools);

  return (
    <div className="max-w-7xl mx-auto px-8">
      {/* Hero Section */}
      <section className="py-20 text-center relative">
        <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-1.5 text-[11px] font-medium text-[#888] mb-6">
          <Sparkles size={11} className="text-white" />
          <span>286+ PDF Tools — All in One Workspace</span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
          One workspace for
          <br />
          <span className="text-white">every PDF task</span>
        </h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Merge, split, compress, convert, edit, secure, inspect, and automate your PDF documents.
          All processing happens in your browser — your files never leave your device.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/tools" className="btn-primary px-6 py-3 text-[13px]">
            Explore All Tools
          </Link>
          <Link to="/workflows" className="btn-secondary px-6 py-3 text-[13px]">
            View Workflows
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-b border-[#1a1a1a]">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">286+</p>
            <p className="text-[11px] text-[#555] uppercase tracking-[0.15em]">PDF Tools</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">14</p>
            <p className="text-[11px] text-[#555] uppercase tracking-[0.15em]">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">100%</p>
            <p className="text-[11px] text-[#555] uppercase tracking-[0.15em]">Private & Secure</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">Free</p>
            <p className="text-[11px] text-[#555] uppercase tracking-[0.15em]">No Sign-up Required</p>
          </div>
        </div>
      </section>

      {/* Most Popular Tools */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Most Popular Tools</h2>
            <p className="text-[#888] text-[13px]">Trusted by thousands of users worldwide</p>
          </div>
          <Link to="/tools" className="text-[11px] text-[#666] hover:text-white transition-colors flex items-center gap-1">
            View all tools <ArrowRight size={10} />
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
                className="card group p-4 relative"
              >
                <div className="popular-badge">Popular</div>
                <div className="icon-box w-10 h-10 mb-3">
                  <Icon size={18} className="text-[#888]" />
                </div>
                <h3 className="font-semibold text-white text-[13px] mb-1">{tool.title}</h3>
                <p className="text-[10px] text-[#555] leading-relaxed line-clamp-2">{tool.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-[#666] group-hover:text-white">
                  <span>Open</span>
                  <ArrowRight size={10} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-[#1a1a1a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Choose Pefixa?</h2>
          <p className="text-[#888] text-[14px] max-w-2xl mx-auto">
            The most comprehensive PDF toolkit designed for professionals who value privacy, speed, and reliability
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Privacy First', desc: 'All processing happens locally in your browser. Your files never leave your device. No uploads, no servers, no tracking.' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance with Web Workers and efficient algorithms. Process large PDFs in seconds, not minutes.' },
            { icon: Lock, title: 'Enterprise Security', desc: 'Military-grade encryption for password protection. Sanitize metadata, redact sensitive content, and secure your documents.' },
            { icon: Eye, title: 'Advanced Inspection', desc: 'Deep PDF analysis with structure inspection, metadata extraction, font analysis, and comprehensive health reports.' },
            { icon: Cpu, title: 'AI-Powered', desc: 'Intelligent OCR, smart compression, automated workflows, and AI-assisted content extraction and summarization.' },
            { icon: Database, title: 'Batch Processing', desc: 'Process hundreds of files at once with our powerful batch engine. Create reusable workflows and automate repetitive tasks.' },
            { icon: Code, title: 'Developer Friendly', desc: 'Comprehensive API documentation, webhook support, and integration capabilities for seamless workflow automation.' },
            { icon: Layers, title: 'Workflow Automation', desc: 'Chain multiple tools together, save presets, and create complex automation pipelines for maximum efficiency.' },
            { icon: Globe, title: 'Works Offline', desc: 'Core tools work without internet connection. No account required. Use it anywhere, anytime, on any device.' },
          ].map((feature, i) => (
            <div key={i} className="card p-6">
              <div className="icon-box w-12 h-12 mb-4">
                <feature.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-[15px] mb-2">{feature.title}</h3>
              <p className="text-[12px] text-[#888] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-t border-[#1a1a1a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Comprehensive Tool Categories</h2>
          <p className="text-[#888] text-[14px] max-w-2xl mx-auto">
            Everything you need to work with PDFs, organized into intuitive categories
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const tools = getToolsByCategory(cat.slug);
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                to={`/tools?category=${cat.slug}`}
                className="card group p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="icon-box w-10 h-10 shrink-0">
                    <Icon size={16} className="text-[#888]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-[13px] mb-1">{cat.title}</h3>
                    <p className="text-[10px] text-[#555]">{tools.length} tools</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#888] leading-relaxed">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t border-[#1a1a1a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-[#888] text-[14px]">Simple, fast, and secure PDF processing in three easy steps</p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Choose Your Tool', desc: 'Browse our comprehensive library of 286+ PDF tools organized by category. Find exactly what you need.' },
            { step: '02', title: 'Upload Your Files', desc: 'Drag and drop your PDF files or click to select. We support batch processing for multiple files.' },
            { step: '03', title: 'Download Results', desc: 'Get your processed files instantly. All processing happens locally in your browser for maximum privacy.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-[#1a1a1a] mb-4">{item.step}</div>
              <h3 className="font-semibold text-white text-[16px] mb-2">{item.title}</h3>
              <p className="text-[12px] text-[#888] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 border-t border-[#1a1a1a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Perfect For Every Use Case</h2>
          <p className="text-[#888] text-[14px] max-w-2xl mx-auto">
            Whether you're a student, professional, or enterprise, Pefixa has the tools you need
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { icon: Users, title: 'For Students', items: ['Merge lecture notes', 'Convert PDFs to study materials', 'Extract text for research', 'Compress files for email'] },
            { icon: Award, title: 'For Professionals', items: ['Sign contracts digitally', 'Redact sensitive information', 'Create professional reports', 'Batch process documents'] },
            { icon: Target, title: 'For Developers', items: ['API integration ready', 'Webhook support', 'Automated workflows', 'Comprehensive documentation'] },
            { icon: TrendingUp, title: 'For Enterprises', items: ['Enterprise-grade security', 'Bulk processing capabilities', 'Team collaboration features', 'Compliance and audit trails'] },
          ].map((useCase, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box w-10 h-10">
                  <useCase.icon size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-[15px]">{useCase.title}</h3>
              </div>
              <ul className="space-y-2">
                {useCase.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-[12px] text-[#888]">
                    <Check size={12} className="text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-[#1a1a1a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Trusted by Professionals</h2>
          <p className="text-[#888] text-[14px]">See what our users are saying</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: 'Sarah Chen', role: 'Product Manager', text: 'Pefixa has completely transformed how we handle PDF documents. The batch processing feature alone saves us hours every week.' },
            { name: 'Michael Rodriguez', role: 'Legal Consultant', text: 'The redaction and security tools are exceptional. I trust Pefixa with confidential client documents every day.' },
            { name: 'Emily Thompson', role: 'Research Assistant', text: 'As a student, having all these PDF tools in one place is a game-changer. The OCR feature is incredibly accurate.' },
          ].map((testimonial, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="text-white fill-white" />
                ))}
              </div>
              <p className="text-[12px] text-[#888] leading-relaxed mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-white text-[13px]">{testimonial.name}</p>
                <p className="text-[11px] text-[#555]">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <section className="py-12 border-t border-[#1a1a1a]">
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
                >
                  <Icon size={12} />
                  <span>{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 border-t border-[#1a1a1a] text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
        <p className="text-[#888] text-[14px] mb-6 max-w-xl mx-auto">
          Join thousands of professionals who trust Pefixa for their PDF processing needs
        </p>
        <Link to="/tools" className="btn-primary px-8 py-3 text-[13px] inline-block">
          Start Processing PDFs Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1a1a1a] mt-16">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/pefixa-logo.svg" alt="Pefixa" className="w-8 h-8" />
              <div>
                <p className="text-white font-semibold text-[14px]">PEFIXA</p>
                <p className="text-[8px] text-[#555] tracking-[0.2em] uppercase">PDF WORKSPACE</p>
              </div>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">
              The most comprehensive PDF toolkit. Process your documents privately and securely in your browser.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[12px] mb-3 uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/tools" className="text-[11px] text-[#888] hover:text-white transition-colors">All Tools</Link></li>
              <li><Link to="/workflows" className="text-[11px] text-[#888] hover:text-white transition-colors">Workflows</Link></li>
              <li><Link to="/editor" className="text-[11px] text-[#888] hover:text-white transition-colors">PDF Editor</Link></li>
              <li><Link to="/viewer" className="text-[11px] text-[#888] hover:text-white transition-colors">PDF Viewer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[12px] mb-3 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.slug}>
                  <Link to={`/tools?category=${cat.slug}`} className="text-[11px] text-[#888] hover:text-white transition-colors">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-[12px] mb-3 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/settings" className="text-[11px] text-[#888] hover:text-white transition-colors">Settings</Link></li>
              <li><Link to="/presets" className="text-[11px] text-[#888] hover:text-white transition-colors">Presets</Link></li>
              <li><Link to="/history" className="text-[11px] text-[#888] hover:text-white transition-colors">History</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1a1a1a] flex items-center justify-between">
          <p className="text-[10px] text-[#555]">© 2024 Pefixa. All rights reserved.</p>
          <p className="text-[10px] text-[#555]">Privacy-first PDF processing</p>
        </div>
      </footer>
    </div>
  );
}
