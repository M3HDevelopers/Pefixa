import { useState } from 'react';
import { toolRegistry } from '../lib/tools/registry';
import { Bookmark, Plus, Trash2, Save, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ToolPreset { id: string; toolSlug: string; name: string; options: Record<string, any>; createdAt: number; }

const defaultPresets: ToolPreset[] = [
  { id: '1', toolSlug: 'compress-pdf', name: 'High Compression', options: { level: 'high' }, createdAt: Date.now() },
  { id: '2', toolSlug: 'compress-pdf', name: 'Best Quality', options: { level: 'low' }, createdAt: Date.now() },
  { id: '3', toolSlug: 'watermark-text', name: 'Confidential Stamp', options: { text: 'CONFIDENTIAL', opacity: 0.5, rotation: 45 }, createdAt: Date.now() },
  { id: '4', toolSlug: 'encrypt-pdf', name: 'Basic Protection', options: { userPassword: '', ownerPassword: '' }, createdAt: Date.now() },
  { id: '5', toolSlug: 'page-numbers', name: 'Bottom Center', options: { position: 'bottom-center', format: 'number', startFrom: 1 }, createdAt: Date.now() },
  { id: '6', toolSlug: 'bates-numbering', name: 'Legal Standard', options: { prefix: 'BATES-', start: 1, padding: 6, position: 'top-right' }, createdAt: Date.now() },
];

export function PresetsPage() {
  const [presets, setPresets] = useState<ToolPreset[]>(defaultPresets);
  const [showCreate, setShowCreate] = useState(false);
  const [newPreset, setNewPreset] = useState({ toolSlug: 'compress-pdf', name: '', options: {} });

  const createPreset = () => {
    if (!newPreset.name.trim()) return;
    const preset: ToolPreset = { id: uuidv4(), toolSlug: newPreset.toolSlug, name: newPreset.name, options: newPreset.options, createdAt: Date.now() };
    setPresets(prev => [...prev, preset]);
    setShowCreate(false);
    setNewPreset({ toolSlug: 'compress-pdf', name: '', options: {} });
  };

  const exportPresets = () => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pefixa-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bookmark size={22} />Tool Presets</h1>
          <p className="text-[13px] text-[#888]">Save and reuse common tool configurations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPresets} className="flex items-center gap-1 px-3 py-1.5 btn-secondary text-[11px]"><Download size={11} />Export</button>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px]"><Plus size={11} />New Preset</button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 card p-4 animate-fade-in-up">
          <h3 className="text-[12px] font-medium text-white mb-3">Create Preset</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-[#888]">Preset Name</label>
              <input type="text" value={newPreset.name} onChange={e => setNewPreset(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., High Quality Compress" className="w-full mt-1 px-3 py-2 input-dark text-[12px]" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#888]">Tool</label>
              <select value={newPreset.toolSlug} onChange={e => setNewPreset(prev => ({ ...prev, toolSlug: e.target.value }))} className="w-full mt-1 px-3 py-2 input-dark text-[12px]">
                {toolRegistry.filter(t => t.options.length > 0).map(tool => (<option key={tool.slug} value={tool.slug}>{tool.title}</option>))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={createPreset} disabled={!newPreset.name.trim()} className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px] disabled:bg-[#1a1a1a] disabled:text-[#444]"><Save size={11} />Save Preset</button>
              <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-[#888] hover:bg-[#1a1a1a] rounded-sm text-[11px]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {presets.map(preset => {
          const tool = toolRegistry.find(t => t.slug === preset.toolSlug);
          return (
            <div key={preset.id} className="card p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white text-[12px]">{preset.name}</h3>
                  <p className="text-[10px] text-[#555]">{tool?.title || preset.toolSlug}</p>
                </div>
                <button onClick={() => setPresets(prev => prev.filter(p => p.id !== preset.id))} className="p-1 hover:bg-[#1a1a1a] rounded-sm"><Trash2 size={11} className="text-[#444]" /></button>
              </div>
              {Object.keys(preset.options).length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#1a1a1a]">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(preset.options).slice(0, 4).map(([key, value]) => (
                      <span key={key} className="text-[9px] bg-[#111] text-[#666] px-1.5 py-0.5 rounded-sm">{key}: {String(value)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {presets.length === 0 && (
        <div className="text-center py-16">
          <Bookmark size={36} className="mx-auto text-[#222] mb-3" />
          <p className="text-[#888] text-[13px]">No presets yet</p>
          <p className="text-[#555] text-[11px] mt-1">Save tool configurations to reuse them later</p>
        </div>
      )}
    </div>
  );
}
