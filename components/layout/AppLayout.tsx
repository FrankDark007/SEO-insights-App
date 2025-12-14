import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Main Content Area - Padding adjusts based on sidebar state */}
      <div className={`flex-1 transition-all duration-300 w-full ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <main className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;