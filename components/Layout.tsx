
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.HOME, label: 'Início', icon: '🏠' },
    { id: AppTab.STUDIO, label: 'Foto Profissional', icon: '📸' },
    { id: AppTab.WRITER, label: 'Legendas/Stories', icon: '✍️' },
    { id: AppTab.BRANDING, label: 'Mascotes', icon: '🎨' },
    { id: AppTab.HISTORY, label: 'Minhas Criações', icon: '📂' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto shadow-2xl overflow-x-hidden border-x border-gray-100 relative">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <h1 className="text-xl font-serif font-bold text-pink-700">ArtesãPro <span className="text-yellow-500 italic">AI</span></h1>
        </div>
      </header>

      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex justify-around items-center py-2 px-1 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              activeTab === tab.id ? 'bg-pink-50 text-pink-600 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
