import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Eye, HardDrive, Bell } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    localOnly: true,
    clearHistory: false,
    maxConcurrent: 2,
    defaultPageSize: 'a4',
    theme: 'light',
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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-gray-600" />
          Settings
        </h1>
        <p className="text-sm text-gray-500">Configure processing, privacy, and application preferences</p>
      </div>

      <div className="space-y-6">
        {/* Privacy & Security */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Shield size={14} className="text-green-600" />
            Privacy & Security
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Local-only processing</p>
                <p className="text-xs text-gray-500">Process eligible documents entirely in browser</p>
              </div>
              <input
                type="checkbox"
                checked={settings.localOnly}
                onChange={e => updateSetting('localOnly', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Privacy mode</p>
                <p className="text-xs text-gray-500">Never upload files for page count or metadata</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privacyMode}
                onChange={e => updateSetting('privacyMode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Clear history on exit</p>
                <p className="text-xs text-gray-500">Remove job metadata when closing browser</p>
              </div>
              <input
                type="checkbox"
                checked={settings.clearHistory}
                onChange={e => updateSetting('clearHistory', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>

        {/* Processing */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Cpu size={14} className="text-blue-600" />
            Processing
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-700">Max concurrent jobs</label>
              <select
                value={settings.maxConcurrent}
                onChange={e => updateSetting('maxConcurrent', parseInt(e.target.value))}
                className="block mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value={1}>1 (Sequential)</option>
                <option value={2}>2 Parallel</option>
                <option value={4}>4 Parallel</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Web Workers</label>
              <select
                value={settings.workerCount}
                onChange={e => updateSetting('workerCount', parseInt(e.target.value))}
                className="block mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value={1}>1 Worker</option>
                <option value={2}>2 Workers</option>
                <option value={4}>4 Workers</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Max memory (MB)</label>
              <input
                type="number"
                value={settings.maxMemoryMB}
                onChange={e => updateSetting('maxMemoryMB', parseInt(e.target.value))}
                className="block mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </section>

        {/* Display */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Eye size={14} className="text-purple-600" />
            Display
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-700">Default page size</label>
              <select
                value={settings.defaultPageSize}
                onChange={e => updateSetting('defaultPageSize', e.target.value)}
                className="block mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="a3">A3</option>
                <option value="a5">A5</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Theme</label>
              <select
                value={settings.theme}
                onChange={e => updateSetting('theme', e.target.value)}
                className="block mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark (coming soon)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Bell size={14} className="text-orange-600" />
            Notifications
          </h2>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Enable notifications</p>
              <p className="text-xs text-gray-500">Show completion/error notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={e => updateSetting('notifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </section>

        {/* Storage */}
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <HardDrive size={14} className="text-gray-600" />
            Storage
          </h2>
          <div className="text-xs text-gray-500 space-y-1">
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
