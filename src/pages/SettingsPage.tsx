import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Eye, HardDrive, Bell } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    localOnly: true,
    clearHistory: false,
    maxConcurrent: 2,
    defaultPageSize: 'a4',
    theme: 'dark',
    notifications: true,
    privacyMode: true,
    workerCount: 2,
    maxMemoryMB: 512,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><SettingsIcon size={22} className="text-[#888]" />Settings</h1>
        <p className="text-[13px] text-[#888]">Configure processing, privacy, and application preferences</p>
      </div>

      <div className="space-y-4">
        <section className="card p-4">
          <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><Shield size={13} className="text-[#4ade80]" />Privacy & Security</h2>
          <div className="space-y-3">
            {[
              { key: 'localOnly', label: 'Local-only processing', desc: 'Process eligible documents entirely in browser' },
              { key: 'privacyMode', label: 'Privacy mode', desc: 'Never upload files for page count or metadata' },
              { key: 'clearHistory', label: 'Clear history on exit', desc: 'Remove job metadata when closing browser' },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <div><p className="text-[12px] text-white">{item.label}</p><p className="text-[10px] text-[#555]">{item.desc}</p></div>
                <input type="checkbox" checked={(settings as any)[item.key]} onChange={e => updateSetting(item.key, e.target.checked)} className="rounded-sm border-[#333] bg-[#0a0a0a] text-white focus:ring-0" />
              </label>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><Cpu size={13} className="text-[#4da6ff]" />Processing</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#888]">Max concurrent jobs</label>
              <select value={settings.maxConcurrent} onChange={e => updateSetting('maxConcurrent', parseInt(e.target.value))} className="block mt-1 w-full px-3 py-2 input-dark text-[12px]">
                <option value={1}>1 (Sequential)</option><option value={2}>2 Parallel</option><option value={4}>4 Parallel</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#888]">Web Workers</label>
              <select value={settings.workerCount} onChange={e => updateSetting('workerCount', parseInt(e.target.value))} className="block mt-1 w-full px-3 py-2 input-dark text-[12px]">
                <option value={1}>1 Worker</option><option value={2}>2 Workers</option><option value={4}>4 Workers</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#888]">Max memory (MB)</label>
              <input type="number" value={settings.maxMemoryMB} onChange={e => updateSetting('maxMemoryMB', parseInt(e.target.value))} className="block mt-1 w-full px-3 py-2 input-dark text-[12px]" />
            </div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><Eye size={13} className="text-[#a78bfa]" />Display</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#888]">Default page size</label>
              <select value={settings.defaultPageSize} onChange={e => updateSetting('defaultPageSize', e.target.value)} className="block mt-1 w-full px-3 py-2 input-dark text-[12px]">
                <option value="a4">A4</option><option value="letter">Letter</option><option value="a3">A3</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><HardDrive size={13} className="text-[#888]" />Storage</h2>
          <div className="text-[11px] text-[#555] space-y-1">
            <p>• Raw PDFs are never persisted by default</p>
            <p>• Only job metadata is stored locally</p>
            <p>• Object URLs are cleared after download</p>
            <p>• Worker resources are released after completion</p>
          </div>
        </section>
      </div>
    </div>
  );
}
