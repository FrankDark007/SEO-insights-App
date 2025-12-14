import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Search, Users, FileText, Settings, 
  Link, MapPin, BarChart3, ChevronDown, ChevronRight,
  Menu, X, Gauge, Target, TrendingUp, FileSearch,
  AlertCircle, Zap, Globe, CheckCircle, ArrowRight,
  ShieldCheck, Database, CloudLightning, ScanSearch,
  VenetianMask, PenTool, Building2, Sparkles, Network,
  Radar, Unlink, Activity
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navigation: NavCategory[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    items: [
      { id: 'monitor', label: 'Health Monitor', icon: <Activity size={18} /> },
      { id: 'analysis', label: 'AI Site Audit', icon: <CheckCircle size={18} /> }
    ]
  },
  {
    id: 'strategy',
    label: 'Strategy & Research',
    icon: <Search size={20} />,
    items: [
      { id: 'radar', label: 'Opportunity Radar', icon: <Radar size={18} /> },
      { id: 'intel', label: 'Local Keywords', icon: <Globe size={18} /> },
      { id: 'matrix', label: 'Content Gap Matrix', icon: <Target size={18} /> }
    ]
  },
  {
    id: 'competitors',
    label: 'Competitor Intel',
    icon: <Users size={20} />,
    items: [
      { id: 'competitor', label: 'Intelligence Dashboard', icon: <VenetianMask size={18} /> },
      { id: 'alerts', label: 'Competitor Alerts', icon: <AlertCircle size={18} /> },
      { id: 'serp', label: 'SERP Features', icon: <LayoutDashboard size={18} /> },
      { id: 'ads', label: 'Google Ads Spy', icon: <ScanSearch size={18} /> }
    ]
  },
  {
    id: 'content',
    label: 'Content Tools',
    icon: <FileText size={20} />,
    items: [
      { id: 'writer', label: 'AI Content Writer', icon: <PenTool size={18} /> },
      { id: 'brief', label: 'Brief Generator', icon: <FileText size={18} /> },
      { id: 'structure', label: 'Structure Analyzer', icon: <FileSearch size={18} /> },
      { id: 'builder', label: 'Service Areas', icon: <MapPin size={18} /> }
    ]
  },
  {
    id: 'technical',
    label: 'Technical & Schema',
    icon: <Settings size={20} />,
    items: [
      { id: 'schema', label: 'Schema Generator', icon: <Settings size={18} /> },
      { id: 'rich-results', label: 'Rich Results', icon: <Sparkles size={18} /> },
      { id: 'broken-links', label: 'Broken Links', icon: <Unlink size={18} /> },
      { id: 'internal', label: 'Internal Links', icon: <Network size={18} /> }
    ]
  },
  {
    id: 'links',
    label: 'Link Building',
    icon: <Link size={20} />,
    items: [
      { id: 'backlinks', label: 'Backlink Gap', icon: <Link size={18} /> },
      { id: 'authority', label: 'Authority Links', icon: <ArrowRight size={18} /> },
      { id: 'linkaudit', label: 'Link Auditor', icon: <ShieldCheck size={18} /> }
    ]
  },
  {
    id: 'local',
    label: 'Local SEO',
    icon: <MapPin size={20} />,
    items: [
      { id: 'gbp', label: 'GBP Audit', icon: <MapPin size={18} /> },
      { id: 'reviews', label: 'Review Analyzer', icon: <BarChart3 size={18} /> },
      { id: 'citations', label: 'Citation Manager', icon: <Building2 size={18} /> },
      { id: 'weather', label: 'Weather Triggers', icon: <CloudLightning size={18} /> }
    ]
  },
  {
    id: 'data',
    label: 'Analytics & Data',
    icon: <BarChart3 size={20} />,
    items: [
      { id: 'ranks', label: 'Rank Tracker', icon: <TrendingUp size={18} /> },
      { id: 'leads', label: 'Lead Tracker', icon: <Users size={18} /> },
      { id: 'integration', label: 'Google Data', icon: <Database size={18} /> },
      { id: 'ahrefs', label: 'Ahrefs Data', icon: <BarChart3 size={18} /> }
    ]
  }
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['dashboard']);

  // Find which category contains the active tab and expand it on initial load or tab change
  useEffect(() => {
    const activeCategory = navigation.find(cat => 
      cat.items.some(item => item.id === activeTab)
    );
    if (activeCategory && !expandedCategories.includes(activeCategory.id)) {
      setExpandedCategories(prev => [...prev, activeCategory.id]);
    }
  }, [activeTab]);

  const toggleCategory = (categoryId: string) => {
    if (isCollapsed) onToggleCollapse();
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-gray-800">
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">SEO Insight Pro</span>
          </div>
        )}
        {isCollapsed && (
             <div className="w-full flex justify-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
             </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white hidden lg:block transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {navigation.map(category => (
          <div key={category.id} className="mb-2">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                expandedCategories.includes(category.id)
                  ? 'text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
              title={isCollapsed ? category.label : ''}
            >
              <div className={`${expandedCategories.includes(category.id) ? 'text-indigo-400' : 'text-gray-500'}`}>
                {category.icon}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium text-sm">{category.label}</span>
                  {expandedCategories.includes(category.id) 
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />
                  }
                </>
              )}
            </button>

            {/* Category Items */}
            {!isCollapsed && expandedCategories.includes(category.id) && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-2">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      activeTab === item.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">
            v1.2.0 • Powered by Gemini
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#161b22] text-white rounded-lg shadow-md border border-gray-800"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1117] transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 bg-[#0d1117] transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;