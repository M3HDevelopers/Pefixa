import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Eye, HardDrive, Bell, Moon, Sun } from 'lucide-react';
import { RevealSection } from '../components/RevealSection';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    localOnly: true,
    clearHistory: false,
    maxConcurrent: 2,
    defaultPageSize: 'a4',
    theme: 'dark',
    notifications: true,
    autoSave: false,
    privacyMode: true,
    workerCount: 2,
    maxMemoryMB: 512,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <RevealSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <SettingsIcon size={28} />
            Settings
          </h1>
          <p className="text-[13px] text-[#888]">Configure processing, privacy, and application preferences</p>
        </div>
      </RevealSection>

      <div className="space-y-4">
        {/* Privacy & Security */}
        <RevealSection>
          <div className="card p-6">
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-[#4ade80]" />
              Privacy & Security
            </h2>
            <div className="space-y-4">
              <ToggleSetting
                label="Local-only processing"
                description="Process eligible documents entirely in browser"
                checked={settings.localOnly}
                onChange={(value) => updateSetting('localOnly', value)}
              />
              <ToggleSetting
                label="Privacy mode"
                description="Never upload files for page count or metadata"
                checked={settings.privacyMode}
                onChange={(value) => updateSetting('privacyMode', value)}
              />
              <ToggleSetting
                label="Clear history on exit"
                description="Remove job metadata when closing browser"
                checked={settings.clearHistory}
                onChange={(value) => updateSetting('clearHistory', value)}
              />
            </div>
          </div>
        </RevealSection>

        {/* Processing */}
        <RevealSection>
          <div className="card p-6">
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-[#60a5fa]" />
              Processing
            </h2>
            <div className="space-y-4">
              <SelectSetting
                label="Max concurrent jobs"
                description="Number of files to process simultaneously"
                value={settings.maxConcurrent}
                options={[
                  { value: 1, label: '1 (Sequential)' },
                  { value: 2, label: '2 Parallel' },
                  { value: 4, label: '4 Parallel' },
                ]}
                onChange={(value) => updateSetting('maxConcurrent', value)}
              />
              <SelectSetting
                label="Web Workers"
                description="Background threads for processing"
                value={settings.workerCount}
                options={[
                  { value: 1, label: '1 Worker' },
                  { value: 2, label: '2 Workers' },
                  { value: 4, label: '4 Workers' },
                ]}
                onChange={(value) => updateSetting('workerCount', value)}
              />
              <NumberSetting
                label="Max memory (MB)"
                description="Maximum memory allocation for processing"
                value={settings.maxMemoryMB}
                min={256}
                max={2048}
                step={128}
                onChange={(value) => updateSetting('maxMemoryMB', value)}
              />
            </div>
          </div>
        </RevealSection>

        {/* Display */}
        <RevealSection>
          <div className="card p-6">
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Eye size={16} className="text-[#a78bfa]" />
              Display
            </h2>
            <div className="space-y-4">
              <SelectSetting
                label="Default page size"
                description="Standard page size for new documents"
                value={settings.defaultPageSize}
                options={[
                  { value: 'a4', label: 'A4' },
                  { value: 'letter', label: 'Letter' },
                  { value: 'a3', label: 'A3' },
                  { value: 'a5', label: 'A5' },
                ]}
                onChange={(value) => updateSetting('defaultPageSize', value)}
              />
              <div>
                <label className="text-[12px] text-[#888] mb-2 block">Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-[#111] border-[#1a1a1a] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <Moon size={14} />
                    <span className="text-[12px]">Dark</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                      settings.theme === 'light'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-[#111] border-[#1a1a1a] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <Sun size={14} />
                    <span className="text-[12px]">Light (Coming Soon)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Notifications */}
        <RevealSection>
          <div className="card p-6">
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Bell size={16} className="text-[#fbbf24]" />
              Notifications
            </h2>
            <ToggleSetting
              label="Enable notifications"
              description="Show completion/error notifications"
              checked={settings.notifications}
              onChange={(value) => updateSetting('notifications', value)}
            />
          </div>
        </RevealSection>

        {/* Storage */}
        <RevealSection>
          <div className="card p-6">
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <HardDrive size={16} className="text-[#888]" />
              Storage
            </h2>
            <div className="text-[12px] text-[#888] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span>Raw PDFs are never persisted by default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span>Only job metadata is stored locally</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span>Object URLs are cleared after download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                <span>Worker resources are released after completion</span>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSetting({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-[12px] text-white font-medium">{label}</p>
        <p className="text-[10px] text-[#666] mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          checked ? 'bg-[#4ade80]' : 'bg-[#333]'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Select Setting Component
function SelectSetting({ label, description, value, options, onChange }: {
  label: string;
  description: string;
  value: any;
  options: Array<{ value: any; label: string }>;
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="text-[12px] text-white font-medium block mb-1">{label}</label>
      <p className="text-[10px] text-[#666] mb-2">{description}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 input-dark text-[12px]"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Number Setting Component
function NumberSetting({ label, description, value, min, max, step, onChange }: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="text-[12px] text-white font-medium block mb-1">{label}</label>
      <p className="text-[10px] text-[#666] mb-2">{description}</p>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full px-3 py-2 input-dark text-[12px]"
      />
    </div>
  );
}
