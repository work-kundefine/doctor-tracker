import React, { useState } from 'react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onSearch?: (query: string) => void;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onSearch,
  selectedCampus,
  onSelectCampus,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCampusMenu, setShowCampusMenu] = useState(false);

  const campuses = [
    'St. Jude Central Campus',
    'Metro General Hospital',
    'Westside Surgical Clinic',
  ];

  const notifications = [
    {
      id: 1,
      title: 'Emergency Triage Alert',
      desc: 'Patient Alonzo Reyes (MRN-92810) assigned to ICU Room 4.',
      time: '2m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Caseload Threshold Alert',
      desc: 'Dr. Marcus Chen reaching 88% capacity limit in Cardiology.',
      time: '18m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'EHR Index Scan Complete',
      desc: '3,842 in-network records indexed with latency 14ms.',
      time: '45m ago',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#c6c6cd]/30 z-40 px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search doctors, patients, MRN... (Ctrl+K)"
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#eff4ff] border border-[#c6c6cd]/50 rounded-lg font-['Inter'] text-[13px] text-[#0b1c30] placeholder:text-[#45464d] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Hospital Campus Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCampusMenu(!showCampusMenu)}
            className="hidden md:flex items-center gap-2 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#c6c6cd]/30 text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
          >
            <span className="material-symbols-outlined text-[#006a61] text-[18px]">domain</span>
            <span className="font-['Inter'] text-[13px] font-semibold text-[#0b1c30] truncate max-w-[180px]">
              {selectedCampus}
            </span>
            <span className="material-symbols-outlined text-[#45464d] text-[16px]">expand_more</span>
          </button>

          {showCampusMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#c6c6cd]/30 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
                Select Hospital Campus
              </div>
              {campuses.map((camp) => (
                <button
                  key={camp}
                  type="button"
                  onClick={() => {
                    onSelectCampus(camp);
                    setShowCampusMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] font-['Inter'] flex items-center justify-between hover:bg-[#eff4ff] transition-colors ${
                    selectedCampus === camp ? 'text-[#006a61] font-bold bg-[#eff4ff]/60' : 'text-[#0b1c30]'
                  }`}
                >
                  <span>{camp}</span>
                  {selectedCampus === camp && (
                    <span className="material-symbols-outlined text-[#006a61] text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#c6c6cd]/30"></div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ba1a1a] text-white font-['Inter'] text-[10px] leading-tight flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#c6c6cd]/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-[#c6c6cd]/20 flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#0b1c30]">
                  Clinical Notifications
                </span>
                <span className="text-[11px] font-semibold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-[#c6c6cd]/15 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#eff4ff]/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter'] font-semibold text-[13px] text-[#0b1c30]">
                        {n.title}
                      </span>
                      <span className="text-[11px] text-[#45464d]">{n.time}</span>
                    </div>
                    <p className="font-['Inter'] text-[12px] text-[#45464d] mt-1 leading-snug">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Logout */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-1 text-left cursor-pointer p-1 rounded-lg hover:bg-[#eff4ff] transition-colors"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
              }
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-[#c6c6cd]/50 shadow-xs"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-['Inter'] text-[13px] font-bold text-[#0b1c30] leading-none">
                {user?.name || 'Dr. Sarah Jenkins'}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#45464d] mt-1">
                {user?.title || 'Hospital Director'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#45464d] text-[16px]">expand_more</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#c6c6cd]/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-[#c6c6cd]/20">
                <div className="font-['Inter'] font-bold text-[14px] text-[#0b1c30]">
                  {user?.name || 'Dr. Sarah Jenkins'}
                </div>
                <div className="text-[12px] text-[#45464d]">{user?.email || 's.jenkins@stjude.org'}</div>
                <div className="mt-1 text-[11px] text-[#006a61] font-semibold uppercase tracking-wider">
                  Role: {user?.role || 'Director'} • {user?.hospital || 'St. Jude Central'}
                </div>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-['Inter'] text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2 transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
