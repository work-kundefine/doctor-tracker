import React from 'react';

interface SidebarProps {
  currentView: 'dashboard' | 'doctors' | 'patients' | 'analytics' | 'settings';
  onNavigate: (view: 'dashboard' | 'doctors' | 'patients' | 'analytics' | 'settings') => void;
  latencyMs?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, latencyMs = 24 }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'doctors', label: 'Doctors', icon: 'stethoscope' },
    { id: 'patients', label: 'Patients', icon: 'personal_injury' },
    { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#ffffff] border-r border-[#c6c6cd]/30 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Brand & Logo Header */}
        <div className="h-16 px-4 border-b border-[#c6c6cd]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#006a61] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[22px]">local_hospital</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] tracking-tight text-[#0b1c30] truncate">
              Doctor Tracker
            </span>
            <span className="font-['Inter'] text-[11px] text-[#006a61] uppercase font-bold tracking-wider">
              Clinical Admin
            </span>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-4 pt-4 pb-2">
          <span className="font-['Inter'] text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
            Navigation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1 flex flex-col">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left w-full ${
                  isActive
                    ? 'bg-[#131b2e] text-white font-semibold shadow-sm'
                    : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-['Inter'] text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* MongoDB Live Status Bar */}
      <div className="p-4 border-t border-[#c6c6cd]/30 bg-[#ffffff]">
        <div className="bg-[#eff4ff] rounded-lg p-2.5 flex items-center justify-between border border-[#c6c6cd]/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
            <span className="font-['Inter'] text-[12px] font-medium text-[#45464d]">
              MongoDB Live
            </span>
          </div>
          <span className="font-['Inter'] text-[13px] text-[#006a61] font-semibold tabular-nums">
            {latencyMs}ms
          </span>
        </div>
      </div>
    </aside>
  );
};
