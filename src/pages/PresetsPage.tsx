import { useState } from 'react';
import { toolRegistry } from '../lib/tools/registry';
import { Bookmark, Plus, Trash2, Save, Download, Upload, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { RevealSection } from '../components/RevealSection';

interface ToolPreset {
  id: string;
  toolSlug: string;
  name: string;
  options: Record<string, any>;
  createdAt: number;
}

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
    const preset: ToolPreset = {
      id: uuidv4(),
      toolSlug: newPreset.toolSlug,
      name: newPreset.name,
      options: newPreset.options,
      createdAt: Date.now(),
    };
    setPresets(prev => [...prev, preset]);
    setShowCreate(false);
    setNewPreset({ toolSlug: 'compress-pdf', name: '', options: {} });
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
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

  const importPresets = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            setPresets(prev => [...prev, ...imported]);
          } catch (err) {
            alert('Invalid preset file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <RevealSection>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Bookmark size={24} />
              Tool Presets
            </h1>
            <p className="text-[13px] text-[#888]">Save and reuse common tool configurations</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={importPresets}
              className="flex items-center gap-1 px-3 py-1.5 btn-secondary text-[11px]"
            >
              <Upload size={11} />
              Import
            </button>
            <button
              onClick={exportPresets}
              className="flex items-center gap-1 px-3 py-1.5 btn-secondary text-[11px]"
            >
              <Download size={11} />
              Export
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px]"
            >
              <Plus size={11} />
              New Preset
            </button>
          </div>
        </div>
      </RevealSection>

      {/* Create Form */}
      {showCreate && (
        <RevealSection className="mb-6">
          <div className="card p-5 animate-fade">
            <h3 className="text-[13px] font-medium text-white mb-4 flex items-center gap-2">
              <Settings size={14} />
              Create New Preset
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-[#888] mb-1.5 block">Preset Name</label>
                <input
                  type="text"
                  value={newPreset.name}
                  onChange={e => setNewPreset(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., High Quality Compress"
                  className="w-full px-3 py-2 input-dark text-[12px]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#888] mb-1.5 block">Tool</label>
                <select
                  value={newPreset.toolSlug}
                  onChange={e => setNewPreset(prev => ({ ...prev, toolSlug: e.target.value }))}
                  className="w-full px-3 py-2 input-dark text-[12px]"
                >
                  {toolRegistry.filter(t => t.options.length > 0).map(tool => (
                    <option key={tool.slug} value={tool.slug}>{tool.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={createPreset}
                  disabled={!newPreset.name.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px] disabled:opacity-50"
                >
                  <Save size={11} />
                  Save Preset
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 text-[#888] hover:bg-[#1a1a1a] rounded-md text-[11px] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      {/* Presets Grid */}
      <RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset, index) => {
            const tool = toolRegistry.find(t => t.slug === preset.toolSlug);
            return (
              <div 
                key={preset.id} 
                className="card p-4 animate-fade"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-[13px] mb-1">{preset.name}</h3>
                    <p className="text-[10px] text-[#666]">{tool?.title || preset.toolSlug}</p>
                  </div>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="p-1.5 hover:bg-[#1a1a1a] rounded-md transition-all"
                    title="Delete"
                  >
                    <Trash2 size={12} className="text-[#666]" />
                  </button>
                </div>
                
                {/* Options Preview */}
                {Object.keys(preset.options).length > 0 && (
                  <div className="pt-3 border-t border-[#1a1a1a]">
                    <p className="text-[9px] text-[#555] uppercase tracking-wider mb-2">Configuration</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(preset.options).slice(0, 4).map(([key, value]) => (
                        <span key={key} className="text-[9px] bg-[#111] text-[#888] px-2 py-1 rounded-md border border-[#1a1a1a]">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Use Preset Button */}
                <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                  <button className="w-full flex items-center justify-center gap-1 px-3 py-1.5 btn-secondary text-[11px]">
                    <Bookmark size={11} />
                    Use Preset
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </RevealSection>

      {presets.length === 0 && (
        <RevealSection>
          <div className="text-center py-16">
            <Bookmark size={48} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#888] text-[14px] mb-2">No presets yet</p>
            <p className="text-[#555] text-[12px] mb-4">Save tool configurations to reuse them later</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1 px-4 py-2 btn-primary text-[12px]"
            >
              <Plus size={12} />
              Create First Preset
            </button>
          </div>
        </RevealSection>
      )}
    </div>
  );
}
