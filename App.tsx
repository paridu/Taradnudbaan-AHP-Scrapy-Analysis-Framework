
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Terminal, 
  Cpu, 
  Settings, 
  Menu,
  Cloud,
  Gavel,
} from 'lucide-react';
import { AppView, ScrapingProject } from './types';
import Dashboard from './components/Dashboard';
import ProjectWizard from './components/ProjectWizard';
import ProjectDetail from './components/ProjectDetail';
import DataInsights from './components/DataInsights';
import LogViewer from './components/LogViewer';
import AIChatBot from './components/AIChatBot';
import DriveExplorer from './components/DriveExplorer';
import SystemSettings from './components/SystemSettings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [projects, setProjects] = useState<ScrapingProject[]>([
    {
      id: 'led-main-scan',
      name: 'ทรัพย์กรมบังคับคดี (LED Investment Analysis)',
      targetUrl: 'https://www.taladnudbaan.com/properties?member=led',
      intent: 'สแกนทรัพย์กรมบังคับคดีทั้งหมด เพื่อนำข้อมูล ราคาประเมิน, ราคาเริ่มต้น, ทำเล และสถานะทรัพย์ มาทำ AHP Analysis จัดอันดับความน่าลงทุน',
      status: 'active',
      health: 100,
      lastRun: '5 นาทีที่แล้ว',
      spiderCode: `import scrapy

class LEDInvestmentSpider(scrapy.Spider):
    name = "led_ahp_analyzer"
    start_urls = ["https://www.taladnudbaan.com/properties?member=led"]

    def parse(self, response):
        for item in response.css(".property-card"):
            yield {
                "id": item.css(".id::text").get(),
                "appraisal_value": self.to_num(item.css(".appraisal::text").get()),
                "starting_price": self.to_num(item.css(".price::text").get()),
                "location": item.css(".loc::text").get(),
                "property_type": item.css(".type::text").get(),
                "status": item.css(".status::text").get()
            }
    
    def to_num(self, val):
        return float(''.join(c for c in val if c.isdigit() or c == '.')) if val else 0`,
      googleDriveEnabled: true,
      investmentMetrics: {
        totalItems: 1245,
        avgPriceGap: 35.2,
        topRankingAssets: 12
      }
    }
  ]);

  const addProject = (p: ScrapingProject) => {
    setProjects(prev => [p, ...prev]);
    setCurrentView(AppView.DASHBOARD);
  };

  const updateProjectStatus = (id: string, status: ScrapingProject['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const updateProjectCode = (id: string, code: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, spiderCode: code } : p));
  };

  const updateProjectDriveSetting = (id: string, enabled: boolean) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, googleDriveEnabled: enabled } : p));
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'แดชบอร์ดลงทุน', icon: LayoutDashboard },
    { id: AppView.AHP_RANKING, label: 'อันดับความน่าลงทุน (AHP)', icon: TrendingUp },
    { id: AppView.DRIVE_EXPLORER, label: 'คลังข้อมูล Drive', icon: Cloud },
    { id: AppView.LOGS, label: 'บันทึกระบบ', icon: Terminal },
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            projects={projects} 
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView(AppView.PROJECT_DETAIL);
            }}
            onAddProject={() => setCurrentView(AppView.WIZARD)}
          />
        );
      case AppView.WIZARD:
        return <ProjectWizard onComplete={addProject} onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.PROJECT_DETAIL:
        const project = projects.find(p => p.id === selectedProjectId);
        return project ? (
          <ProjectDetail 
            project={project} 
            onUpdateStatus={updateProjectStatus}
            onUpdateCode={updateProjectCode}
            onUpdateDriveSetting={updateProjectDriveSetting}
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
          />
        ) : <div className="p-8">ไม่พบโปรเจกต์</div>;
      case AppView.AHP_RANKING:
        return <DataInsights projects={projects} />;
      case AppView.LOGS:
        return <LogViewer />;
      case AppView.DRIVE_EXPLORER:
        return <DriveExplorer />;
      case AppView.SETTINGS:
        return <SystemSettings />;
      default:
        return <Dashboard projects={projects} onSelectProject={setSelectedProjectId} onAddProject={() => {}} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-100">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-slate-800 bg-[#0d1117] flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Gavel className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">LED Investment</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setCurrentView(AppView.SETTINGS)}
            className={`flex items-center gap-3 px-4 py-3 transition-all w-full rounded-xl ${currentView === AppView.SETTINGS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span>ตั้งค่าระบบ</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#020617]">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-200 uppercase tracking-widest text-sm">
              {currentView === AppView.SETTINGS ? 'System Configuration' : (navItems.find(n => n.id === currentView)?.label || 'System OverView')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-600/10 rounded-full border border-amber-600/20">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-amber-400">LED SCANNER ACTIVE</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <AIChatBot />
    </div>
  );
};

export default App;
