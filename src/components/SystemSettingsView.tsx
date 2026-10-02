import React from 'react';

export const SystemSettingsView: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[#006a61] mb-1">
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span className="font-['Inter'] text-[11px] uppercase tracking-wider font-bold">
            Administrative Governance
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tracking-tight">
          System & Database Settings
        </h1>
        <p className="font-['Inter'] text-[14px] text-[#45464d] mt-1">
          MongoDB connection parameters, indexing health, JWT clearance rules, and audit logging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Configuration Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#c6c6cd]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61]">database</span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
                MongoDB Cluster Status
              </h3>
            </div>
            <span className="bg-[#86f2e4]/30 text-[#006f66] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-pulse"></span>
              Healthy Replica Set
            </span>
          </div>

          <div className="space-y-3 font-['Inter'] text-[13px]">
            <div>
              <label className="text-[12px] text-[#45464d] font-semibold block mb-1">
                Active MongoDB Connection URI
              </label>
              <input
                type="text"
                readOnly
                value="mongodb://127.0.0.1:27017/doctortracker"
                className="w-full px-3 py-2 bg-[#eff4ff] rounded-xl font-mono text-[12px] text-[#0b1c30] border border-[#c6c6cd]/30 focus:outline-none select-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
                <span className="text-[11px] text-[#45464d]">Doctors Collection Index</span>
                <div className="font-mono text-[11px] font-bold text-[#0b1c30] mt-1">
                  {'{ npi: 1, hospital: 1 }'}
                </div>
                <span className="text-[10px] text-[#006a61] font-semibold mt-1 block">
                  Status: Unique & Indexed
                </span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
                <span className="text-[11px] text-[#45464d]">Patients Collection Index</span>
                <div className="font-mono text-[11px] font-bold text-[#0b1c30] mt-1">
                  {'{ doctorId: 1, admissionDate: -1 }'}
                </div>
                <span className="text-[10px] text-[#006a61] font-semibold mt-1 block">
                  Status: Compound B-Tree
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & JWT Token Policy */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#c6c6cd]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61]">shield</span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
                Security & Session Protocols
              </h3>
            </div>
            <span className="bg-[#eff4ff] text-[#0b1c30] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#c6c6cd]/30">
              HIPAA Compliant
            </span>
          </div>

          <div className="space-y-3 font-['Inter'] text-[13px]">
            <div className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
              <div>
                <span className="font-bold text-[#0b1c30] block">JWT Token Expiration</span>
                <span className="text-[11px] text-[#45464d]">Standard physician session lifespan</span>
              </div>
              <span className="font-bold text-[#006a61] font-mono">12 Hours</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
              <div>
                <span className="font-bold text-[#0b1c30] block">Password Cryptography</span>
                <span className="text-[11px] text-[#45464d]">Bcrypt hash salt rounds</span>
              </div>
              <span className="font-bold text-[#006a61] font-mono">10 Salt Rounds</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
              <div>
                <span className="font-bold text-[#0b1c30] block">Role-Based Access Control (RBAC)</span>
                <span className="text-[11px] text-[#45464d]">Roles: Administrator, Director, Physician</span>
              </div>
              <span className="font-bold text-[#006a61] font-mono">Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
