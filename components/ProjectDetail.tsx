
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Code, 
  Activity, 
  Loader2, 
  Sparkles, 
  Check, 
  Eye, 
  Table as TableIcon, 
  X,
  Zap,
  Settings2,
  CheckCircle2,
  FileSpreadsheet,
  BrainCircuit,
  BarChart4,
  History,
  Database,
  ArrowRight,
  Terminal,
  Play,
  Download
} from 'lucide-react';
import { ScrapingProject } from '../types';
import { refactorSpider, generateMockResults, calculateAHPScores } from '../services/geminiService';

interface ProjectDetailProps {
  project: ScrapingProject;
  onUpdateStatus: (id: string, status: ScrapingProject['status']) => void;
  onUpdateCode: (id: string, code: string) => void;
  onUpdateDriveSetting: (id: string, enabled: boolean) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  onUpdateStatus, 
  onUpdateCode, 
  onUpdateDriveSetting,
  onBack 
}) => {
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // Run Spider State
  const [isRunningSpider, setIsRunningSpider] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [spiderLogs, setSpiderLogs] = useState<string[]>([]);
  
  // Upsert Simulation State
  const [isUpserting, setIsUpserting] = useState(false);
  const [upsertProgress, setUpsertProgress] = useState(0);
  const [showUpsertToast, setShowUpsertToast] = useState(false);
  const [upsertStats, setUpsertStats] = useState({ updated: 0, inserted: 0 });
  
  // AHP Analysis State
  const [isAnalyzingAHP, setIsAnalyzingAHP] = useState(false);
  const [ahpResults, setAhpResults] = useState<any[]>([]);
  
  // Editor State
  const [editableCode, setEditableCode] = useState(project.spiderCode);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const autoSaveTimerRef = useRef<any>(null);

  // Auto-save logic
  useEffect(() => {
    if (editableCode !== project.spiderCode) {
      setSaveStatus('dirty');
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      
      autoSaveTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        onUpdateCode(project.id, editableCode);
        setTimeout(() => setSaveStatus('saved'), 1000);
      }, 3000);
    }
  }, [editableCode]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  const handleUpsert = () => {
    setIsUpserting(true);
    setUpsertProgress(0);
    setShowUpsertToast(false);
    
    // Detailed simulation of data sync
    const interval = setInterval(() => {
      setUpsertProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpserting(false);
          setUpsertStats({ 
            updated: Math.floor(Math.random() * 200) + 50, 
            inserted: Math.floor(Math.random() * 15) + 2 
          });
          setShowUpsertToast(true);
          setTimeout(() => setShowUpsertToast(false), 6000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleRunSpider = async () => {
    setShowRunModal(true);
    setIsRunningSpider(true);
    setSpiderLogs(["INFO: Scrapy 2.11.0 started (bot: scrapybot)", `INFO: Spider opened: ${project.id}`, `INFO: Crawling ${project.targetUrl}`]);
    setPreviewData([]);

    // Simulation logs
    const steps = [
        `DEBUG: Crawled (200) <GET ${project.targetUrl}> (referer: None)`,
        "DEBUG: Scraped from <200 ...>: {'item_scraped_count': 1}",
        "DEBUG: Scraped from <200 ...>: {'item_scraped_count': 5}",
        "DEBUG: Scraped from <200 ...>: {'item_scraped_count': 12}",
        "INFO: Closing spider (finished)",
        "INFO: Dumping Scrapy stats..."
    ];

    for (const step of steps) {
        await new Promise(r => setTimeout(r, 800));
        setSpiderLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
    }

    try {
        const results = await generateMockResults(project.spiderCode, project.intent);
        setPreviewData(results);
        setSpiderLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INFO: Spider closed: Finished. Extracted ${results.length} items.`]);
    } catch (e: any) {
        setSpiderLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ERROR: Pipeline failed. ${e.message || e}`]);
    } finally {
        setIsRunningSpider(false);
    }
  };

  const handleExportRunResults = () => {
      if (previewData.length === 0) return;
      const headers = Object.keys(previewData[0]);
      const csvRows = [
          headers.join(','),
          ...previewData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ];
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `run_results_${project.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleExportCodeAsCSV = () => {
    const csvContent = `Project ID,Project Name,Spider Code\n${project.id},${project.name},"${project.spiderCode.replace(/"/g, '""')}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${project.id}_code.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const mockActivity = [
    { time: '2 นาทีที่แล้ว', action: `ตรวจพบข้อมูลใหม่ และดึงสำเร็จรวม 94,016 รายการ`, result: 'Success' },
    { time: '1 ชั่วโมงที่แล้ว', action: 'เริ่มรันงานประจำวัน (Daily Full Crawl)', result: 'Success' },
    { time: 'เมื่อวาน', action: 'ส่งออกไฟล์ CSV ชุดใหญ่ไปยัง Google Drive', result: 'Success' },
  ];

  const logsString = mockActivity.map(l => `[${l.time}] ${l.action} - Result: ${l.result}`).join('\n');

  const needsRefactor = useMemo(() => {
    if (project.googleDriveEnabled && !project.spiderCode.includes('GoogleDrivePipeline') && !project.spiderCode.includes('pydrive2')) {
      return true;
    }
    return false;
  }, [project.googleDriveEnabled, project.spiderCode]);

  const handleAIRefactor = async () => {
    setIsRefactoring(true);
    try {
      const updatedCode = await refactorSpider(
        project.spiderCode, 
        logsString, 
        project.intent, 
        project.googleDriveEnabled
      );
      
      if (updatedCode) {
        setEditableCode(updatedCode);
        onUpdateCode(project.id, updatedCode);
      }
    } catch (error) {
      console.error('Failed to refactor spider:', error);
      alert('เกิดข้อผิดพลาดในการปรับปรุงโค้ด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsRefactoring(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    setShowPreview(true);
    try {
      const results = await generateMockResults(project.spiderCode, project.intent);
      setPreviewData(results);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setPreviewData([]);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleRunAHPAnalysis = async () => {
    setIsAnalyzingAHP(true);
    try {
      let data = previewData;
      if (data.length === 0) {
        data = await generateMockResults(project.spiderCode, project.intent);
        setPreviewData(data);
      }
      const scores = await calculateAHPScores(project.intent, data);
      setAhpResults(scores.map((s: any) => {
        const originalAsset = data.find(d => d.property_id === s.id);
        return { ...s, asset: originalAsset };
      }).sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error('AHP Error:', error);
      alert('ไม่สามารถวิเคราะห์ AHP ได้ในขณะนี้');
    } finally {
      setIsAnalyzingAHP(false);
    }
  };

  const handleExportAHPData = () => {
    if (!project.investmentMetrics) {
      alert("ไม่พบข้อมูล Metrics สำหรับการส่งออก");
      return;
    }
    const { totalItems, avgPriceGap, topRankingAssets } = project.investmentMetrics;
    let csvContent = "data:text/csv;charset=utf-8,\ufeff";
    csvContent += "หัวข้อการวิเคราะห์ (Metric),ค่าที่วัดได้ (Value)\n";
    csvContent += `ชื่อโปรเจกต์,${project.name}\n`;
    csvContent += `จำนวนทรัพย์ที่สแกนทั้งหมด,${totalItems}\n`;
    csvContent += `ส่วนต่างราคาประเมินเฉลี่ย (%),${avgPriceGap}%\n`;
    csvContent += `จำนวนทรัพย์ที่มีศักยภาพสูง,${topRankingAssets}\n\n`;
    csvContent += "เกณฑ์การตัดสินใจ (AHP Criteria),น้ำหนักความสำคัญ (Weight)\n";
    csvContent += "ส่วนต่างราคา (Appraisal vs Start),0.4\n";
    csvContent += "ทำเลที่ตั้งและศักยภาพการเติบโต,0.3\n";
    csvContent += "สถานะทรัพย์ (ว่าง/มีผู้อาศัย),0.3\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ahp_investment_summary_${project.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = useMemo(() => {
    if (!previewData || previewData.length === 0) return [];
    const keys = new Set<string>();
    previewData.forEach(item => {Object.keys(item).forEach(key => keys.add(key))});
    return Array.from(keys);
  }, [previewData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{project.name}</h2>
            <p className="text-slate-400 mt-1 flex items-center gap-2 italic text-sm">
              เป้าหมาย: {project.intent}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleRunSpider}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-900/30"
          >
            <Play className="w-5 h-5 fill-current" />
            Run Spider
          </button>

          <button 
            onClick={handleExportCodeAsCSV}
            className="bg-slate-800 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-700 hover:text-white transition-all font-bold text-sm"
          >
            <Download className="w-5 h-5" />
            Export Code (CSV)
          </button>

          <div className="w-px h-8 bg-slate-800 mx-2 hidden md:block"></div>

          <button 
            onClick={handleUpsert}
            disabled={isUpserting}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg disabled:opacity-50 ${
              isUpserting ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isUpserting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Upsert Daily Update
          </button>

          <button 
            onClick={handleRunAHPAnalysis}
            disabled={isAnalyzingAHP}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-amber-900/30 disabled:opacity-50"
          >
            {isAnalyzingAHP ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            Run AHP Analysis
          </button>

          <button 
            onClick={handleExportAHPData}
            className="bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-all font-bold text-sm"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>

      {isUpserting && (
        <div className="bg-slate-900/80 border border-emerald-500/20 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4" /> Synchronizing data...
            </span>
            <span className="text-xs font-black text-white">{upsertProgress}%</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${upsertProgress}%` }}
            />
          </div>
        </div>
      )}

      {showUpsertToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-xl">
           <div className="flex items-center gap-4">
             <div className="bg-emerald-500 p-2 rounded-full">
               <Check className="w-4 h-4 text-slate-950" />
             </div>
             <div>
               <p className="text-sm font-black text-emerald-100 uppercase tracking-tight">Daily Sync Completed</p>
               <p className="text-xs text-emerald-400/80 mt-0.5">
                 อัปเดตข้อมูลเดิม {upsertStats.updated} รายการ และเพิ่มทรัพย์ใหม่ {upsertStats.inserted} รายการสำเร็จ
               </p>
             </div>
           </div>
           <button onClick={() => setShowUpsertToast(false)} className="text-emerald-500/40 hover:text-emerald-500 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assets Scanned</span>
                <span className="text-3xl font-black text-white">{project.investmentMetrics?.totalItems || 0}</span>
             </div>
             <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Price Gap</span>
                <span className="text-3xl font-black text-emerald-400">{project.investmentMetrics?.avgPriceGap || 0}%</span>
             </div>
             <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AHP High Score</span>
                <span className="text-3xl font-black text-amber-400">
                    {ahpResults.length > 0 ? ahpResults[0].score : '---'}
                </span>
             </div>
          </div>

          {/* AHP Results Section */}
          {ahpResults.length > 0 && (
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
                <div className="px-8 py-5 bg-amber-500/10 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart4 className="w-6 h-6 text-amber-500" />
                        <span className="font-black text-amber-200 text-lg uppercase tracking-tight">AI Investment Recommendation</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold uppercase">Dynamic Ranking</span>
                </div>
                <div className="p-6 space-y-4">
                    {ahpResults.map((res, i) => (
                        <div key={res.id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' : 'bg-slate-800 text-slate-400'}`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{res.id}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 italic">{res.reasoning}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white tabular-nums">{res.score.toFixed(1)}</span>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">AHP Score</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Code Editor with Auto-save */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-slate-200">Spider Code Editor</span>
                </div>
                {/* Auto-save Badge */}
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/50 rounded-full border border-slate-800">
                    {saveStatus === 'saving' ? (
                        <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold animate-pulse uppercase">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                        </span>
                    ) : saveStatus === 'saved' ? (
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase">
                            <Check className="w-3 h-3" /> Saved
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase">
                            <History className="w-3 h-3" /> Editing
                        </span>
                    )}
                </div>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={handlePreview}
                    disabled={isPreviewing}
                    className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-700 hover:text-white transition-all font-bold text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Dry Run
                  </button>
                  <button 
                    onClick={handleAIRefactor}
                    disabled={isRefactoring}
                    className={`text-xs flex items-center gap-1 font-bold px-4 py-2 rounded-xl transition-all border ${
                      needsRefactor 
                      ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-900/30 hover:bg-amber-400' 
                      : 'bg-blue-600/10 text-blue-400 border-blue-600/20 hover:bg-blue-600/20'
                    } disabled:opacity-50`}
                  >
                    {isRefactoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    AI Refactor
                  </button>
              </div>
            </div>
            <div className="relative font-mono text-sm leading-relaxed overflow-hidden">
              {isRefactoring && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm animate-in fade-in">
                  <Sparkles className="w-12 h-12 text-blue-400 animate-pulse mb-4" />
                  <p className="text-blue-400 font-bold text-lg tracking-tight">AI RECONSTRUCTING SPIDER...</p>
                </div>
              )}
              <textarea 
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                spellCheck={false}
                className="w-full h-[500px] bg-slate-950 text-blue-100 p-6 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl text-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">ความสมบูรณ์ของข้อมูล</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" 
                    strokeDasharray={402}
                    strokeDashoffset={402 - (402 * project.health) / 100}
                    strokeLinecap="round"
                    className={`${project.health > 80 ? 'text-emerald-500' : project.health > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{project.health}%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold mt-1">Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-400" /> Configuration
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status</span>
                <span className={`font-black px-3 py-1 rounded text-[10px] uppercase ${project.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {project.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Google Drive</span>
                <button 
                  onClick={() => onUpdateDriveSetting(project.id, !project.googleDriveEnabled)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${project.googleDriveEnabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                >
                  {project.googleDriveEnabled ? 'Active' : 'Disabled'}
                </button>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Activity className="w-4 h-4 text-blue-400" /> Recent Actions
                </div>
                {mockActivity.slice(0, 3).map((log, i) => (
                    <div key={i} className="text-[11px] text-slate-500 border-l-2 border-slate-800 pl-3 py-1">
                        {log.action}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spider Run / Preview Modal */}
      {(showPreview || showRunModal) && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                    <div className="px-8 py-5 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-blue-400" />
                            <span className="font-bold text-slate-100 uppercase tracking-tight">
                              {showRunModal ? "Spider Execution Console" : "Raw Scraping Data Preview"}
                            </span>
                        </div>
                        <button 
                          onClick={() => { setShowPreview(false); setShowRunModal(false); }} 
                          className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-950">
                        {showRunModal && (
                           <div className="p-4 border-b border-slate-800 font-mono text-xs space-y-1">
                              {spiderLogs.map((log, i) => (
                                <div key={i} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('DEBUG') ? 'text-slate-500' : 'text-emerald-400'}`}>
                                  {log}
                                </div>
                              ))}
                              {isRunningSpider && (
                                <div className="text-blue-400 animate-pulse">_</div>
                              )}
                           </div>
                        )}

                        <div className="p-0">
                           {/* Result Table or Loading State */}
                           {(isPreviewing || isRunningSpider) && previewData.length === 0 ? (
                                <div className="p-24 flex flex-col items-center justify-center gap-6">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                    <div className="text-center">
                                        <p className="text-blue-300 font-bold text-lg">Executing Spider Logic...</p>
                                        <p className="text-slate-500 text-sm">Parsing content and extracting fields</p>
                                    </div>
                                </div>
                            ) : previewData.length > 0 ? (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-900 sticky top-0 z-10">
                                        <tr>
                                            {headers.map((key) => (
                                                <th key={key} className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-[11px] border-b border-slate-800">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="hover:bg-blue-500/5 transition-colors group">
                                                {headers.map((header, j) => (
                                                    <td key={j} className="px-6 py-4 text-slate-300 font-medium">
                                                        {String(row[header] ?? '-')}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : !isRunningSpider && (
                                <div className="p-20 text-center text-slate-500">No output data generated.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Modal Footer actions */}
                    {previewData.length > 0 && (
                      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
                          <button 
                            onClick={handleExportRunResults}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-sm"
                          >
                            <Download className="w-4 h-4" /> Export Results to CSV
                          </button>
                      </div>
                    )}
                </div>
            </div>
      )}
    </div>
  );
};

export default ProjectDetail;
