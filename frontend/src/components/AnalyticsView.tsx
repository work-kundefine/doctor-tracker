import React, { useState } from 'react';

export const AnalyticsView: React.FC = () => {
  const [selectedWing, setSelectedWing] = useState('All');

  const wingData = [
    { name: 'Cardiology Center', census: '94% Cap', beds: '38/40', staff: '40 MDs', avgStay: '4.2 Days', status: 'Near Limit' },
    { name: 'Neuro Critical Care', census: '72% Cap', beds: '26/36', staff: '31 MDs', avgStay: '6.8 Days', status: 'Optimal' },
    { name: 'Pediatric Acute Wing', census: '58% Cap', beds: '22/38', staff: '27 MDs', avgStay: '3.1 Days', status: 'Optimal' },
    { name: 'Orthopedic Surgery Center', census: '88% Cap', beds: '35/40', staff: '23 MDs', avgStay: '5.4 Days', status: 'Near Limit' },
    { name: 'Trauma & Emergency', census: '96% Cap', beds: '48/50', staff: '44 MDs', avgStay: '1.8 Days', status: 'Surge Alert' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#006a61] mb-1">
            <span className="material-symbols-outlined text-[18px]">monitoring</span>
            <span className="font-['Inter'] text-[11px] uppercase tracking-wider font-bold">
              Real-Time Hospital Telemetry
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tracking-tight">
            Clinical Operational Analytics
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#45464d] mt-1">
            Inpatient census telemetry, physician shift efficiency, bed turnaround, and aggregation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#eff4ff] px-3.5 py-1.5 rounded-xl border border-[#c6c6cd]/30 text-[#006a61] font-['Inter'] text-[12px] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006a61] animate-ping"></span>
            <span>Cluster Streaming Live</span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30">
          <span className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Total Hospital Admissions</span>
          <div className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-[#0b1c30] mt-1 tabular-nums">
            3,842
          </div>
          <div className="flex items-center gap-1 text-[#006a61] font-['Inter'] text-[12px] mt-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+14.2% MoM growth</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30">
          <span className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Average Bed Length of Stay</span>
          <div className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-[#0b1c30] mt-1 tabular-nums">
            4.1 Days
          </div>
          <div className="flex items-center gap-1 text-[#006a61] font-['Inter'] text-[12px] mt-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Within JCAHO Target (&lt; 4.8d)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30">
          <span className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Active Caseload Ratio</span>
          <div className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-[#0b1c30] mt-1 tabular-nums">
            27.1 : 1
          </div>
          <div className="flex items-center gap-1 text-[#006a61] font-['Inter'] text-[12px] mt-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">balance</span>
            <span>Safe Provider Threshold</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30">
          <span className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">MongoDB Aggregation Speed</span>
          <div className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-[#006a61] mt-1 tabular-nums">
            18 ms
          </div>
          <div className="flex items-center gap-1 text-[#45464d] font-['Inter'] text-[12px] mt-1">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">speed</span>
            <span>Compound Index Scan</span>
          </div>
        </div>
      </div>

      {/* Departmental Bed Capacity Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
              Departmental Bed Capacity & Turnover
            </h3>
            <p className="font-['Inter'] text-[12px] text-[#45464d]">
              Live occupancy metrics across St. Jude Central pavilions
            </p>
          </div>
          <span className="font-['Inter'] text-[12px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-3 py-1 rounded-full">
            5 Active Pavilions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eff4ff] text-[#45464d] font-['Inter'] text-[11px] uppercase tracking-wider h-10 border-b border-[#c6c6cd]/20">
                <th className="px-4 font-semibold">Wing / Pavilion</th>
                <th className="px-4 font-semibold">Occupancy</th>
                <th className="px-4 font-semibold">Bed Allocation</th>
                <th className="px-4 font-semibold">Medical Staff</th>
                <th className="px-4 font-semibold">Avg Stay</th>
                <th className="px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/15 font-['Inter'] text-[13px]">
              {wingData.map((w) => (
                <tr key={w.name} className="hover:bg-[#eff4ff]/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#0b1c30]">{w.name}</td>
                  <td className="px-4 py-3.5 font-semibold text-[#006a61] tabular-nums">{w.census}</td>
                  <td className="px-4 py-3.5 text-[#45464d] tabular-nums">{w.beds}</td>
                  <td className="px-4 py-3.5 text-[#45464d]">{w.staff}</td>
                  <td className="px-4 py-3.5 text-[#45464d] tabular-nums">{w.avgStay}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        w.status === 'Surge Alert'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : w.status === 'Near Limit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#86f2e4]/30 text-[#006f66]'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
