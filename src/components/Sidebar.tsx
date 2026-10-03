import React from 'react';

interface SidebarProps {
  currentView: 'dashboard' | 'doctors' | 'patients';
  onNavigate: (view: 'dashboard' | 'doctors' | 'patients') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'doctors', label: 'Doctors Roster', icon: 'stethoscope' },
    { id: 'patients', label: 'Patients Registry', icon: 'personal_injury' },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#ffffff] border-r border-[#c6c6cd]/30 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Brand & Logo Header */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="h-16 px-4 border-b border-[#c6c6cd]/30 flex items-center gap-3 cursor-pointer hover:bg-[#eff4ff]/40 transition-colors"
        >
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
        <div className="px-4 pt-5 pb-2">
          <span className="font-['Inter'] text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
            Clinical Modules
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1.5 flex flex-col">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-[#006a61] text-white font-semibold shadow-sm'
                    : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-['Inter'] text-[14px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hospital System Info */}
      <div className="p-4 border-t border-[#c6c6cd]/30 bg-[#ffffff]">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-2 h-2 rounded-full bg-[#006a61]"></div>
          <div className="flex flex-col">
            <span className="font-['Inter'] text-[12px] font-semibold text-[#0b1c30]">
              St. Jude Central
            </span>
            <span className="font-['Inter'] text-[11px] text-[#76777d]">
              Connected to MongoDB
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
