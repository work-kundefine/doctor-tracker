import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface DashboardViewProps {
  onNavigateToDoctors: () => void;
  onNavigateToPatients: () => void;
  onViewDoctorPatients: (doctorId: string, doctorName: string) => void;
  onViewPatientRecord: (patientName: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToDoctors,
  onNavigateToPatients,
  onViewDoctorPatients,
  onViewPatientRecord,
}) => {
  const [trendsRange, setTrendsRange] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overview, setOverview] = useState<any>({
    totalDoctors: 142,
    doctorsGrowth: '+8 this mo',
    totalPatients: 3842,
    patientsGrowth: '+12.4% MoM',
    avgRatio: 27.1,
    ratioTarget: 'Target: < 30 balanced load',
    ratioStatus: 'Optimal',
    aggregationLatencyMs: 18,
    latencyStatus: 'Healthy',
    clusterName: 'US-East-Primary',
  });

  const [trends, setTrends] = useState<any>({
    admissionsAvg: '124/day',
    dischargesAvg: '112/day',
    peakPhysicians: '132 Peak',
  });

  const [specialties, setSpecialties] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: any } | null>({
    x: 520,
    y: 60,
    data: { date: 'Oct 21, 2024', adm: 148, dis: 118, drs: 134 },
  });

  const loadData = async () => {
    try {
      const [ovRes, trRes, spRes, wkRes, rcRes] = await Promise.all([
        api.analytics.getOverview(),
        api.analytics.getTrends(trendsRange),
        api.analytics.getSpecialties(),
        api.analytics.getWorkload(),
        api.analytics.getRecent(),
      ]);

      if (ovRes.success && ovRes.data) setOverview(ovRes.data);
      if (trRes.success && trRes.data) setTrends(trRes.data);
      if (spRes.success && spRes.data?.breakdown) setSpecialties(spRes.data.breakdown);
      if (wkRes.success && wkRes.data?.workloads) setWorkload(wkRes.data.workloads);
      if (rcRes.success && rcRes.data?.admissions) setRecentAdmissions(rcRes.data.admissions);
    } catch (e) {
      console.warn('Dashboard data fetch note:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [trendsRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(async () => {
      await loadData();
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Top Action Bar & Operational Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[#45464d] font-['Inter'] text-[11px] uppercase tracking-wider font-semibold">
            <span>Enterprise Telemetry</span>
            <span>•</span>
            <span className="text-[#006a61]">Live Operational Feed</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold text-[#0b1c30]">
              Clinical Analytics Oversight
            </h2>
            <span className="font-['Inter'] text-[12px] text-[#45464d]">
              Cluster: {overview.clusterName || 'US-East-Primary'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-xs border border-[#c6c6cd]/30 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[18px] text-[#006a61]">calendar_today</span>
            <span className="font-['Inter'] text-[13px] font-medium">Oct 1, 2024 – Oct 25, 2024</span>
            <span className="material-symbols-outlined text-[16px] text-[#45464d]">expand_more</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#eff4ff] text-[#0b1c30] rounded-xl shadow-xs border border-[#c6c6cd]/30 transition-all active:scale-95 cursor-pointer font-['Inter'] text-[13px] font-medium"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-[#45464d] transition-transform duration-700 ${
                isRefreshing ? 'rotate-180' : ''
              }`}
            >
              sync
            </span>
            <span>Refresh Aggregations</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Exporting encrypted analytics dossier (CSV / PDF format)...')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#131b2e] text-white hover:bg-[#213145] rounded-xl shadow-md transition-all font-['Inter'] text-[13px] font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Report</span>
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Doctors */}
        <div
          onClick={onNavigateToDoctors}
          className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
        >
          <div className="absolute -right-3 -top-3 w-20 h-20 bg-[#86f2e4]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Total Doctors</span>
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[20px]">stethoscope</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                {overview.totalDoctors}
              </div>
              <div className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
                Active across 8 departments
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-['Inter'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              {overview.doctorsGrowth}
            </span>
          </div>
        </div>

        {/* Metric 2: Total Patients */}
        <div
          onClick={onNavigateToPatients}
          className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
        >
          <div className="absolute -right-3 -top-3 w-20 h-20 bg-[#cce5ff]/30 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Total Registered Patients</span>
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#188ace]">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                {Number(overview.totalPatients).toLocaleString()}
              </div>
              <div className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
                Registered In-Network
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px] text-[#006a61]">trending_up</span>
              {overview.patientsGrowth}
            </span>
          </div>
        </div>

        {/* Metric 3: Avg Ratio (Pt / Dr) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Avg. Ratio (Pt / Dr)</span>
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
              <span className="material-symbols-outlined text-[20px]">balance</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                {overview.avgRatio}
              </div>
              <div className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
                {overview.ratioTarget}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-['Inter'] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              {overview.ratioStatus}
            </span>
          </div>
        </div>

        {/* Metric 4: Query Latency */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
              Aggregation Pipeline Latency
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[20px]">database</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums flex items-baseline">
                {overview.aggregationLatencyMs}
                <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#45464d] font-normal ml-0.5">
                  ms
                </span>
              </div>
              <div className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
                Covered index aggregations
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#0b1c30] font-['Inter'] text-[11px] font-medium border border-[#c6c6cd]/30">
              <span className="w-2 h-2 rounded-full bg-[#006a61] animate-ping"></span>
              {overview.latencyStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Patient Intake & Specialty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Patient Intake & Consultation Area (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
            <div className="flex flex-col">
              <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                Patient Intake & Consultation Trends
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#45464d]">
                Daily admission throughput vs clinical discharges & active doctor caseload
              </p>
            </div>
            <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl self-start sm:self-auto border border-[#c6c6cd]/25">
              {(['7D', '30D', '3M', '1Y'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTrendsRange(tab)}
                  className={`px-3 py-1 rounded-lg font-['Inter'] text-[12px] transition-all cursor-pointer ${
                    trendsRange === tab
                      ? 'bg-white text-[#0b1c30] shadow-xs font-bold'
                      : 'text-[#45464d] hover:text-[#0b1c30]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Legends */}
          <div className="flex flex-wrap items-center gap-6 pb-2 font-['Inter'] text-[12px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#006a61]"></span>
              <span className="text-[#0b1c30] font-semibold">Admissions</span>
              <span className="text-[#45464d] tabular-nums">Avg {trends.admissionsAvg || '124/day'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#93ccff]"></span>
              <span className="text-[#0b1c30] font-semibold">Discharges</span>
              <span className="text-[#45464d] tabular-nums">Avg {trends.dischargesAvg || '112/day'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#131b2e]"></span>
              <span className="text-[#0b1c30] font-semibold">Physicians Active</span>
              <span className="text-[#45464d] tabular-nums">{trends.peakPhysicians || '132 Peak'}</span>
            </div>
          </div>

          {/* Rich SVG Area Chart with interactive highlights */}
          <div className="w-full h-72 relative mt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
              <defs>
                <linearGradient id="admissionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#006a61" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#006a61" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="dischargeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93ccff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#93ccff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="0" y1="20" x2="800" y2="20" stroke="#eff4ff" strokeWidth="1.5" />
              <line x1="0" y1="75" x2="800" y2="75" stroke="#eff4ff" strokeWidth="1.5" />
              <line x1="0" y1="130" x2="800" y2="130" stroke="#eff4ff" strokeWidth="1.5" />
              <line x1="0" y1="185" x2="800" y2="185" stroke="#eff4ff" strokeWidth="1.5" />
              <line x1="0" y1="230" x2="800" y2="230" stroke="#dce9ff" strokeWidth="1.5" />

              {/* Discharge Area & Path */}
              <path
                d="M 0,160 Q 70,140 140,150 T 280,120 T 420,135 T 560,95 T 700,110 T 800,80 L 800,230 L 0,230 Z"
                fill="url(#dischargeGrad)"
              />
              <path
                d="M 0,160 Q 70,140 140,150 T 280,120 T 420,135 T 560,95 T 700,110 T 800,80"
                fill="none"
                stroke="#93ccff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Admission Area & Path */}
              <path
                d="M 0,140 Q 60,110 130,125 T 260,90 T 390,75 T 520,60 T 650,45 T 800,30 L 800,230 L 0,230 Z"
                fill="url(#admissionGrad)"
              />
              <path
                d="M 0,140 Q 60,110 130,125 T 260,90 T 390,75 T 520,60 T 650,45 T 800,30"
                fill="none"
                stroke="#006a61"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Doctor Load Step/Dashed line */}
              <path
                d="M 0,180 L 130,175 L 260,165 L 390,155 L 520,140 L 650,130 L 800,125"
                fill="none"
                stroke="#131b2e"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Interactive Highlight Anchor Point (Oct 21) */}
              <line
                x1="520"
                y1="20"
                x2="520"
                y2="230"
                stroke="#76777d"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeOpacity="0.3"
              />
              <circle
                cx="520"
                cy="60"
                r="5"
                fill="#006a61"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer"
              />
              <circle cx="520" cy="140" r="4" fill="#131b2e" stroke="#ffffff" strokeWidth="1.5" />
            </svg>

            {/* Floating Micro Tooltip Preview */}
            <div className="absolute left-[65%] top-6 bg-[#213145] text-[#eaf1ff] px-3 py-1.5 rounded-xl shadow-xl text-left pointer-events-none transform -translate-x-1/2 border border-white/10">
              <div className="font-['Inter'] text-[10px] text-[#d3e4fe] uppercase font-semibold">
                Oct 21, 2024
              </div>
              <div className="flex items-center gap-3 font-['Inter'] text-[12px] mt-0.5">
                <span className="text-[#89f5e7] font-semibold">Adm: 148</span>
                <span className="text-[#cce5ff] font-semibold">Dis: 118</span>
                <span className="text-[#f8f9ff]">Drs: 134</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 text-[#45464d] font-['Inter'] text-[12px] tabular-nums">
            <span>Oct 01</span>
            <span>Oct 06</span>
            <span>Oct 11</span>
            <span>Oct 16</span>
            <span className="font-bold text-[#0b1c30]">Oct 21</span>
            <span>Oct 25</span>
          </div>
        </div>

        {/* Doctor Specialization Distribution Donut (1 Col) */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                Specialty Breakdown
              </h3>
              <span className="font-['Inter'] text-[11px] text-[#45464d] bg-[#eff4ff] px-2.5 py-0.5 rounded-full font-semibold border border-[#c6c6cd]/30">
                142 Total
              </span>
            </div>
            <p className="font-['Inter'] text-[12px] text-[#45464d]">Active headcount deployed by specialty</p>
          </div>

          {/* SVG Donut Visual matching Image 5 */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
              {/* Cardiology 28% */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#006a61"
                strokeWidth="20"
                strokeDasharray="101.8 262.2"
                strokeDashoffset="0"
              />
              {/* Neurology 22% */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#188ace"
                strokeWidth="20"
                strokeDasharray="80 284"
                strokeDashoffset="-101.8"
              />
              {/* Pediatrics 19% */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#86f2e4"
                strokeWidth="20"
                strokeDasharray="69 295"
                strokeDashoffset="-181.8"
              />
              {/* Orthopedics 16% */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#565e74"
                strokeWidth="20"
                strokeDasharray="58 306"
                strokeDashoffset="-250.8"
              />
              {/* Oncology 15% */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#bec6e0"
                strokeWidth="20"
                strokeDasharray="55 309"
                strokeDashoffset="-308.8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30]">5</span>
              <span className="font-['Inter'] text-[11px] text-[#45464d] uppercase font-semibold">Core Wings</span>
            </div>
          </div>

          {/* Specialty Legend with Counts & Percentages */}
          <div className="space-y-1 font-['Inter'] text-[12px]">
            {[
              { label: 'Cardiology', color: '#006a61', count: '40 Drs', pct: '28%' },
              { label: 'Neurology', color: '#188ace', count: '31 Drs', pct: '22%' },
              { label: 'Pediatrics', color: '#86f2e4', count: '27 Drs', pct: '19%' },
              { label: 'Orthopedics', color: '#565e74', count: '23 Drs', pct: '16%' },
              { label: 'Oncology', color: '#bec6e0', count: '21 Drs', pct: '15%' },
            ].map((sp) => (
              <div
                key={sp.label}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sp.color }}></span>
                  <span className="text-[#0b1c30] font-medium">{sp.label}</span>
                </div>
                <div className="flex items-center gap-3 text-[#45464d] tabular-nums">
                  <span>{sp.count}</span>
                  <span className="font-bold text-[#0b1c30]">{sp.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Doctor Workload & Real-time Admissions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doctor Workload & Capacity (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                  Doctor Workload & Capacity
                </h3>
                <p className="font-['Inter'] text-[12px] text-[#45464d]">
                  Real-time provider active case threshold monitoring
                </p>
              </div>
              <span className="font-['Inter'] text-[11px] text-[#006a61] bg-[#86f2e4]/30 px-3 py-1 rounded-full font-bold">
                Live Balance
              </span>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#45464d] font-['Inter'] text-[11px] uppercase">
                    <th className="py-2.5 px-3 rounded-l-lg">Physician</th>
                    <th className="py-2.5 px-3">Specialty</th>
                    <th className="py-2.5 px-3 text-center">Assigned</th>
                    <th className="py-2.5 px-3 w-36">Load Capacity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="font-['Inter'] text-[13px] divide-y-0">
                  {workload.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#eff4ff]/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {doc.avatarUrl ? (
                            <img
                              src={doc.avatarUrl}
                              alt={doc.name}
                              className="w-8 h-8 rounded-full object-cover shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center font-bold text-[12px]">
                              {doc.initials || 'MD'}
                            </div>
                          )}
                          <div>
                            <div className="font-['Inter'] text-[13px] font-bold text-[#0b1c30] leading-tight">
                              {doc.name}
                            </div>
                            <div className="text-[11px] text-[#45464d] tabular-nums">NPI: {doc.npi}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] text-[#0b1c30] font-medium">
                          {doc.specialty}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#0b1c30] tabular-nums">
                        {doc.assigned}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-between text-[11px] mb-1 tabular-nums">
                          <span className="font-semibold text-[#0b1c30]">{doc.loadPercentage}%</span>
                          <span className="text-[#45464d]">{doc.assigned}/{doc.maxCapacity}</span>
                        </div>
                        <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              doc.loadPercentage >= 85 ? 'bg-[#ba1a1a]' : 'bg-[#006a61]'
                            }`}
                            style={{ width: `${doc.loadPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            doc.status === 'Near Capacity'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#86f2e4]/40 text-[#006f66]'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onViewDoctorPatients(doc.id, doc.name)}
                          className="px-2.5 py-1 text-[#0b1c30] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between font-['Inter'] text-[12px] text-[#45464d]">
            <span>Showing 4 of 142 Physicians</span>
            <button
              type="button"
              onClick={onNavigateToDoctors}
              className="inline-flex items-center gap-1 text-[#006a61] font-semibold hover:underline cursor-pointer"
            >
              View All Staff Load
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Real-Time Admissions Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                    Recent Admissions
                  </h3>
                </div>
                <p className="font-['Inter'] text-[12px] text-[#45464d]">
                  Real-time sync streaming from clinical triage
                </p>
              </div>
              <span className="font-['Inter'] text-[11px] text-[#006a61] bg-[#eff4ff] px-2.5 py-1 rounded-md font-semibold border border-[#c6c6cd]/25">
                Live WS Connected
              </span>
            </div>

            <div className="space-y-2 mt-2">
              {recentAdmissions.map((adm) => (
                <div
                  key={adm.id}
                  className="p-3 bg-[#eff4ff]/60 hover:bg-[#eff4ff] rounded-xl transition-all flex items-start justify-between border border-[#c6c6cd]/15"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] mt-0.5 ${
                        adm.severity === 'critical'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : adm.severity === 'routine'
                          ? 'bg-[#86f2e4] text-[#006f66]'
                          : 'bg-[#dce9ff] text-[#0b1c30]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {adm.severity === 'critical'
                          ? 'priority_high'
                          : adm.severity === 'routine'
                          ? 'check_circle'
                          : 'health_and_safety'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30]">
                          {adm.patientName}
                        </span>
                        <span className="text-[10px] text-[#45464d] tabular-nums font-mono">{adm.mrn}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                        <span className="text-[#45464d]">{adm.doctorName}</span>
                        <span className="text-[#45464d]">•</span>
                        <span
                          className={`font-semibold ${
                            adm.severity === 'critical' ? 'text-[#ba1a1a]' : 'text-[#006a61]'
                          }`}
                        >
                          {adm.triageTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-['Inter'] text-[11px] text-[#45464d] tabular-nums">{adm.timeAgo}</span>
                    <button
                      type="button"
                      onClick={() => onViewPatientRecord(adm.patientName)}
                      className="text-[#006a61] text-[11px] font-semibold hover:underline mt-1 cursor-pointer"
                    >
                      Record →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between font-['Inter'] text-[12px] text-[#45464d]">
            <span className="tabular-nums">Incoming queue: 3 queued</span>
            <button
              type="button"
              onClick={onNavigateToPatients}
              className="inline-flex items-center gap-1 text-[#006a61] font-semibold hover:underline cursor-pointer"
            >
              Triage Desk
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
