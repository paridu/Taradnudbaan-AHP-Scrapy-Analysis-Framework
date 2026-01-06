
import React, { useState } from 'react';
import { 
  Save, 
  Server, 
  Shield, 
  Cloud, 
  Key, 
  Bell, 
  RefreshCw, 
  Trash2, 
  Check, 
  AlertCircle,
  Cpu,
  Globe,
  Lock,
  Zap,
  HardDrive,
  Send
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'scraping' | 'cloud' | 'notifications'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [apiKey, setApiKey] = useState('**************************');
  const [concurrency, setConcurrency] = useState(16);
  const [downloadDelay, setDownloadDelay] = useState(0.5);
  const [useProxy, setUseProxy] = useState(true);
  const [lineNotifyToken, setLineNotifyToken] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Simulate save
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'AI & General', icon: Cpu },
    { id: 'scraping', label: 'Scraping Engine', icon: Server },
    { id: 'cloud', label: 'Cloud Integrations', icon: Cloud },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                <Lock className="text-slate-400 w-6 h-6" />
            </div>
            System Settings
          </h2>
          <p className="text-slate-400 mt-1">Configure global parameters for your AI Scrapy cluster.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-70"
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent">
               <Trash2 className="w-5 h-5" />
               Reset to Defaults
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[500px]">
          
          {/* General / AI Settings */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Key className="w-5 h-5 text-amber-400" /> AI API Configuration
                 </h3>
                 <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Gemini API Key</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Required for Intent Analysis, Spider Generation, and AHP Ranking.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Default AI Model</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
                            <option value="gemini-3-pro-preview">Gemini 3 Pro (Recommended for Coding)</option>
                            <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast Analysis)</option>
                        </select>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Scraping Settings */}
          {activeTab === 'scraping' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Zap className="w-5 h-5 text-blue-400" /> Performance Tuning
                    </h3>
                    
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">Concurrent Requests</label>
                            <span className="text-sm font-bold text-blue-400">{concurrency} threads</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="64" 
                            value={concurrency}
                            onChange={(e) => setConcurrency(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Higher concurrency increases speed but may trigger anti-bot protections.</p>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">Download Delay (seconds)</label>
                         <input 
                            type="number" 
                            step="0.1"
                            value={downloadDelay}
                            onChange={(e) => setDownloadDelay(parseFloat(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                         />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-emerald-400" />
                            <div>
                                <h4 className="font-bold text-white text-sm">Smart Proxy Rotation</h4>
                                <p className="text-xs text-slate-400">Automatically rotate IP addresses on 403/429 errors.</p>
                            </div>
                        </div>
                        <div 
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${useProxy ? 'bg-emerald-500' : 'bg-slate-700'}`}
                            onClick={() => setUseProxy(!useProxy)}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${useProxy ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>
             </div>
          )}

          {/* Cloud Settings */}
          {activeTab === 'cloud' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                        <HardDrive className="w-5 h-5 text-blue-400" /> Storage Integrations
                    </h3>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600/20 p-2 rounded-lg">
                                    <Cloud className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Google Drive</h4>
                                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Connected as admin@example.com
                                    </p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-all">
                                Reconnect
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Target Folder ID</label>
                                <input 
                                    type="text" 
                                    defaultValue="1A2b3C4d5E6f7G8h9I0j"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-300 text-xs font-mono"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500 rounded" />
                                <span className="text-sm text-slate-400">Auto-upload CSV after spider completion</span>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Bell className="w-5 h-5 text-amber-400" /> Alert Channels
                    </h3>

                    {/* Line Notify */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="bg-[#00B900]/20 p-2 rounded-lg">
                                 {/* Simple icon for Line */}
                                 <div className="w-6 h-6 flex items-center justify-center font-bold text-[#00B900]">L</div> 
                             </div>
                             <div>
                                 <h4 className="font-bold text-white">Line Notify</h4>
                                 <p className="text-xs text-slate-400">Receive instant alerts on your phone.</p>
                             </div>
                         </div>
                         <div className="space-y-2">
                             <label className="block text-xs font-bold text-slate-500 uppercase">Access Token</label>
                             <input 
                                type="password" 
                                value={lineNotifyToken}
                                onChange={(e) => setLineNotifyToken(e.target.value)}
                                placeholder="Paste your Line Notify Token here"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm"
                             />
                             <div className="flex gap-2 mt-2">
                                 <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all">
                                     Test Message
                                 </button>
                             </div>
                         </div>
                    </div>

                    {/* Telegram Notify */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="bg-[#229ED9]/20 p-2 rounded-lg">
                                 <Send className="w-6 h-6 text-[#229ED9]" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-white">Telegram Notify</h4>
                                 <p className="text-xs text-slate-400">Receive alerts via Telegram Bot.</p>
                             </div>
                         </div>
                         <div className="space-y-3">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bot Token</label>
                                <input 
                                    type="password" 
                                    value={telegramBotToken}
                                    onChange={(e) => setTelegramBotToken(e.target.value)}
                                    placeholder="123456789:ABCdefGHIjklMNOpqrs..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chat ID</label>
                                <input 
                                    type="text" 
                                    value={telegramChatId}
                                    onChange={(e) => setTelegramChatId(e.target.value)}
                                    placeholder="-987654321"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm"
                                />
                             </div>
                             <div className="flex gap-2 mt-2">
                                 <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all">
                                     Test Message
                                 </button>
                             </div>
                         </div>
                    </div>
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper component for icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default SystemSettings;
