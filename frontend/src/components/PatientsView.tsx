import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface PatientsViewProps {
  onOpenAdmitModal: () => void;
  onOpenEditModal: (patient: any) => void;
  onOpenTimelineDrawer: (patient: any) => void;
  searchQuery?: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenAdmitModal,
  onOpenEditModal,
  onOpenTimelineDrawer,
  searchQuery = '',
}) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 3842, totalPages: 385 });
  const [search, setSearch] = useState(searchQuery);
  const [conditionFilter, setConditionFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await api.patients.getAll({
        search,
        condition: conditionFilter,
        doctorId: doctorFilter,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res.success && res.data) {
        setPatients(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (e) {
      console.warn('Patients fetch note:', e);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, conditionFilter, doctorFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(patients.map((p) => p.id || p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeletePatient = async (id: string, name: string, mrn: string) => {
    if (window.confirm(`Are you certain you wish to discharge / archive ${name} (${mrn}) from live ward management?`)) {
      const res = await api.patients.delete(id);
      if (res.success) {
        fetchPatients();
        showToast(`Patient ${name} successfully discharged and archived.`);
      }
    }
  };

  const handleBulkAction = async (action: 'export' | 'reassign_doctor' | 'transfer_ward' | 'flag_critical') => {
    setShowBulkMenu(false);
    if (selectedIds.length === 0) {
      alert('Please select at least one patient record to apply bulk action.');
      return;
    }

    if (action === 'export') {
      alert(`Exporting ${selectedIds.length} patient records to encrypted CSV...`);
      return;
    }

    const res = await api.patients.bulkAction({
      action,
      patientIds: selectedIds,
      newWard: action === 'transfer_ward' ? 'Central Wing - Room 304' : undefined,
    });

    if (res.success) {
      fetchPatients();
      showToast(res.message || 'Bulk action applied successfully.');
      setSelectedIds([]);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setConditionFilter('');
    setDoctorFilter('');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1720px] mx-auto w-full space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-['Inter'] text-[11px] text-[#006a61] tracking-widest uppercase font-bold">
              Clinical Care Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
            <span className="font-['Inter'] text-[11px] text-[#45464d] font-medium">
              Inpatient Census: 348 Occupied
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tracking-tight">
            Patient Directory & Records
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#45464d] mt-0.5">
            Manage all hospital patients, diagnoses, assigned doctors, and admission schedules
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="h-10 px-4 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[13px] font-semibold rounded-xl shadow-xs border border-[#c6c6cd]/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
              <span>Bulk Actions {selectedIds.length > 0 && `(${selectedIds.length})`}</span>
              <span className="material-symbols-outlined text-[16px] text-[#45464d]">expand_more</span>
            </button>

            {showBulkMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#c6c6cd]/30 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleBulkAction('export')}
                  className="w-full text-left px-4 py-2 text-[#0b1c30] font-['Inter'] text-[13px] hover:bg-[#eff4ff] flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">file_download</span>
                  <span>Export Records (.CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('reassign_doctor')}
                  className="w-full text-left px-4 py-2 text-[#0b1c30] font-['Inter'] text-[13px] hover:bg-[#eff4ff] flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#45464d]">assignment_ind</span>
                  <span>Reassign Primary MD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('transfer_ward')}
                  className="w-full text-left px-4 py-2 text-[#0b1c30] font-['Inter'] text-[13px] hover:bg-[#eff4ff] flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#45464d]">swap_horiz</span>
                  <span>Transfer Care Unit</span>
                </button>
                <div className="h-px bg-[#c6c6cd]/20 my-1"></div>
                <button
                  type="button"
                  onClick={() => handleBulkAction('flag_critical')}
                  className="w-full text-left px-4 py-2 text-[#ba1a1a] font-['Inter'] text-[13px] hover:bg-[#ffdad6]/30 flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>Mark Urgent Triage</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAdmitModal}
            className="h-10 px-4 bg-[#006a61] hover:bg-[#005049] text-white font-['Inter'] text-[13px] rounded-xl shadow-md transition-all flex items-center gap-2 font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Admit New Patient</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry / Census Sparklines Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Active Inpatients */}
        <div className="p-5 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Active Inpatients</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-['Inter'] text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-ping"></span> Live
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#0b1c30] font-bold tracking-tight tabular-nums">
              3,842
            </span>
            <span className="font-['Inter'] text-[12px] text-[#006a61] font-semibold flex items-center">
              +4.2% today
            </span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#006a61]" fill="none" viewBox="0 0 120 28">
              <path
                d="M0 20 L20 18 L40 22 L60 12 L80 15 L100 8 L120 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 20 L20 18 L40 22 L60 12 L80 15 L100 8 L120 14 V28 H0 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
        </div>

        {/* Critical / ICU Triage */}
        <div className="p-5 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Critical / ICU Triage</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-['Inter'] text-[11px] font-bold">
              High Priority
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#ba1a1a] font-bold tracking-tight tabular-nums">
              28
            </span>
            <span className="font-['Inter'] text-[12px] text-[#ba1a1a] font-semibold flex items-center">
              8 Beds Available
            </span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#ba1a1a]" fill="none" viewBox="0 0 120 28">
              <path
                d="M0 16 L25 19 L50 9 L75 22 L95 10 L120 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 16 L25 19 L50 9 L75 22 L95 10 L120 7 V28 H0 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
        </div>

        {/* Post-Op Recovery */}
        <div className="p-5 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Post-Op Recovery</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[11px] font-semibold">
              Wing B / C
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#0b1c30] font-bold tracking-tight tabular-nums">
              64
            </span>
            <span className="font-['Inter'] text-[12px] text-[#45464d] font-medium">
              92% Discharge ready
            </span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#001d31]" fill="none" viewBox="0 0 120 28">
              <path
                d="M0 24 L20 20 L45 22 L65 14 L90 10 L120 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 24 L20 20 L45 22 L65 14 L90 10 L120 9 V28 H0 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
        </div>

        {/* Physician Coverage */}
        <div className="p-5 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Physician Coverage</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006f66] font-['Inter'] text-[11px] font-semibold">
              1:8.4 Ratio
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#006a61] font-bold tracking-tight">
              41 MDs
            </span>
            <span className="font-['Inter'] text-[12px] text-[#45464d] font-medium">
              10 On-Call Rotations
            </span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#006a61]" fill="none" viewBox="0 0 120 28">
              <path
                d="M0 12 L30 14 L55 8 L85 11 L105 5 L120 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 12 L30 14 L55 8 L85 11 L105 5 L120 4 V28 H0 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#c6c6cd]/30 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Full-text search */}
          <div className="lg:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, MRN, or diagnosis..."
              className="w-full pl-10 pr-4 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] placeholder:text-[#45464d] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006a61] transition-all border border-[#c6c6cd]/30"
            />
          </div>

          {/* Condition Filter Dropdown */}
          <div className="lg:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
              medical_services
            </span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full pl-9 pr-8 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006a61] appearance-none cursor-pointer border border-[#c6c6cd]/30"
            >
              <option value="">All Conditions</option>
              <option value="Critical Care">Critical Care</option>
              <option value="Post-Operative">Post-Operative</option>
              <option value="Chronic Management">Chronic Management</option>
              <option value="Stable">Stable</option>
              <option value="Routine Observation">Routine Observation</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date-wise Admission Picker */}
          <div className="lg:col-span-3 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
              date_range
            </span>
            <input
              type="text"
              readOnly
              value="Admission Window: Oct 1 - Oct 25, 2024"
              onClick={() => alert('Admission date range set: Oct 1 - Oct 25, 2024')}
              className="w-full pl-9 pr-8 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[12px] text-[#0b1c30] cursor-pointer select-none truncate focus:outline-none border border-[#c6c6cd]/30"
            />
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px] pointer-events-none">
              calendar_month
            </span>
          </div>

          {/* Assigned Doctor Dropdown */}
          <div className="lg:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
              stethoscope
            </span>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full pl-9 pr-8 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006a61] appearance-none cursor-pointer border border-[#c6c6cd]/30"
            >
              <option value="">All Doctors</option>
              <option value="Dr. Robert Vance">Dr. Robert Vance</option>
              <option value="Dr. Elena Rostova">Dr. Elena Rostova</option>
              <option value="Dr. Michael Chang">Dr. Michael Chang</option>
              <option value="Dr. Amara Okafor">Dr. Amara Okafor</option>
              <option value="Dr. Julian Ross">Dr. Julian Ross</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Clear Filters Button */}
          <div className="lg:col-span-1 flex items-center">
            <button
              type="button"
              onClick={resetFilters}
              title="Clear all filters"
              className="w-full h-10 px-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[12px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#c6c6cd]/30"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Quick Triage Filter Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-[#45464d] font-['Inter'] text-[12px]">
          <span className="font-semibold text-[#0b1c30] mr-1">Active Triage Filters:</span>
          <button
            type="button"
            onClick={() => setConditionFilter('Critical Care')}
            className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              conditionFilter === 'Critical Care'
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-[#ffdad6] text-[#93000a] hover:opacity-90'
            }`}
          >
            Critical Care (1) <span className="material-symbols-outlined text-[12px]">add</span>
          </button>
          <button
            type="button"
            onClick={() => setConditionFilter('Post-Operative')}
            className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              conditionFilter === 'Post-Operative'
                ? 'bg-[#001d31] text-white'
                : 'bg-[#d3e4fe] text-[#0b1c30] hover:opacity-90'
            }`}
          >
            Post-Op (2) <span className="material-symbols-outlined text-[12px]">add</span>
          </button>
          <button
            type="button"
            onClick={() => setConditionFilter('Stable')}
            className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              conditionFilter === 'Stable'
                ? 'bg-[#006a61] text-white'
                : 'bg-[#86f2e4] text-[#006f66] hover:opacity-90'
            }`}
          >
            Stable (3) <span className="material-symbols-outlined text-[12px]">add</span>
          </button>
          <span className="text-[#c6c6cd] ml-auto hidden sm:inline text-[11px]">
            Ctrl + F to initiate MRN lookup
          </span>
        </div>
      </div>

      {/* Patients Data Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-[#eff4ff] text-[#45464d] font-['Inter'] text-[11px] uppercase tracking-wider h-11 border-b border-[#c6c6cd]/25">
                <th className="py-2 px-4 w-12 text-center" scope="col">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === patients.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded-xs accent-[#006a61] cursor-pointer w-4 h-4"
                  />
                </th>
                <th className="py-2 px-4 font-semibold">Patient Info</th>
                <th className="py-2 px-4 font-semibold">Condition & Triage</th>
                <th className="py-2 px-4 font-semibold">Assigned Doctor</th>
                <th className="py-2 px-4 font-semibold">Hospital / Ward</th>
                <th className="py-2 px-4 font-semibold">Admission Date</th>
                <th className="py-2 px-4 font-semibold">Emergency Contact</th>
                <th className="py-2 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/15">
              {patients.map((pat) => {
                const patId = pat.id || pat._id;
                const isSelected = selectedIds.includes(patId);
                const initials = pat.name
                  .split(' ')
                  .map((w: string) => w[0])
                  .join('')
                  .substring(0, 2);

                return (
                  <tr
                    key={patId}
                    className={`hover:bg-[#eff4ff]/60 transition-colors ${
                      isSelected ? 'bg-[#eff4ff]/40' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(patId)}
                        className="rounded-xs accent-[#006a61] cursor-pointer w-4 h-4"
                      />
                    </td>

                    {/* Patient Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] ${
                            pat.condition === 'Critical Care'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : pat.condition === 'Stable'
                              ? 'bg-[#86f2e4] text-[#006f66]'
                              : 'bg-[#dce9ff] text-[#0b1c30]'
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="font-['Inter'] text-[14px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                            <span>{pat.name}</span>
                            <span
                              className="material-symbols-outlined text-[#006a61] text-[16px]"
                              title="Telemetry Synced"
                            >
                              monitor_heart
                            </span>
                          </div>
                          <div className="font-['Inter'] text-[12px] text-[#45464d] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[#006a61] font-semibold">#{pat.mrn}</span>
                            <span>•</span>
                            <span>
                              {pat.age} yrs, {pat.gender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Condition & Triage */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-['Inter'] text-[11px] font-bold ${
                          pat.condition === 'Critical Care'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : pat.condition === 'Post-Operative'
                            ? 'bg-[#d3e4fe] text-[#0b1c30]'
                            : pat.condition === 'Stable'
                            ? 'bg-[#86f2e4] text-[#006f66]'
                            : 'bg-[#eff4ff] text-[#45464d]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            pat.condition === 'Critical Care'
                              ? 'bg-[#ba1a1a] animate-ping'
                              : pat.condition === 'Stable'
                              ? 'bg-[#006a61]'
                              : 'bg-[#76777d]'
                          }`}
                        ></span>
                        {pat.condition}
                      </span>
                      <span className="block text-[#45464d] font-['Inter'] text-[11px] mt-1 max-w-xs truncate">
                        {pat.diagnosis}
                      </span>
                    </td>

                    {/* Assigned Doctor */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2 bg-[#eff4ff] px-2.5 py-1 rounded-xl border border-[#c6c6cd]/25">
                        <span className="material-symbols-outlined text-[#006a61] text-[18px]">
                          stethoscope
                        </span>
                        <div>
                          <span className="font-['Inter'] text-[12px] font-semibold text-[#0b1c30] block">
                            {pat.doctorName}
                          </span>
                          <span className="font-['Inter'] text-[11px] text-[#45464d]">
                            {pat.doctorSpecialty}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Hospital / Ward */}
                    <td className="py-3 px-4 font-['Inter'] text-[13px]">
                      <div className="font-semibold text-[#0b1c30]">{pat.ward}</div>
                      <div className="text-[#45464d] text-[11px]">{pat.roomBed}</div>
                    </td>

                    {/* Admission Date */}
                    <td className="py-3 px-4 font-['Inter'] text-[13px] tabular-nums">
                      <div className="font-medium text-[#0b1c30]">
                        {new Date(pat.admissionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[#45464d] text-[11px]">
                        {Math.max(1, Math.floor((Date.now() - new Date(pat.admissionDate).getTime()) / (1000 * 3600 * 24)))}{' '}
                        Days Inpatient
                      </div>
                    </td>

                    {/* Emergency Contact */}
                    <td className="py-3 px-4">
                      <span className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold block tabular-nums">
                        {pat.emergencyContact?.phone}
                      </span>
                      <span className="font-['Inter'] text-[11px] text-[#45464d]">
                        {pat.emergencyContact?.name} ({pat.emergencyContact?.relation})
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(pat)}
                          title="Quick Edit Patient"
                          className="p-1.5 rounded-lg text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTimelineDrawer(pat)}
                          title="View Medical Timeline"
                          className="p-1.5 rounded-lg text-[#45464d] hover:text-[#006a61] hover:bg-[#86f2e4]/30 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">timeline</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePatient(patId, pat.name, pat.mrn)}
                          title="Discharge / Remove Patient"
                          className="p-1.5 rounded-lg text-[#45464d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar with Optimization Metric */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#c6c6cd]/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-['Inter'] text-[12px] text-[#45464d]">
              Showing <span className="font-bold text-[#0b1c30]">1-{patients.length}</span> of{' '}
              <span className="font-bold text-[#0b1c30]">{pagination.total}</span> patients
            </span>
            <span className="hidden lg:inline text-[#c6c6cd]">•</span>
            {/* MongoDB Scan Telemetry Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[#006a61] font-['Inter'] text-[11px] font-bold border border-[#c6c6cd]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              <span>MongoDB Index scan: 14ms (O(log N))</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-['Inter'] text-[12px]">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="px-3 h-8 rounded-lg bg-white text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors font-semibold flex items-center gap-1 shadow-xs disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span> Prev
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#006a61] text-white font-bold shadow-xs flex items-center justify-center"
            >
              {pagination.page}
            </button>
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="w-8 h-8 rounded-lg bg-white text-[#0b1c30] hover:bg-[#dce9ff] font-semibold transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            >
              {pagination.page + 1}
            </button>
            <span className="px-1 text-[#45464d]">…</span>
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, page: pagination.totalPages })}
              className="w-8 h-8 rounded-lg bg-white text-[#0b1c30] hover:bg-[#dce9ff] font-semibold transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            >
              {pagination.totalPages}
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="px-3 h-8 rounded-lg bg-white text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors font-semibold flex items-center gap-1 shadow-xs disabled:opacity-40 cursor-pointer"
            >
              Next <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Feedback Alert / Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#213145] text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-in slide-in-from-bottom duration-200 border border-white/10">
          <span className="material-symbols-outlined text-[#86f2e4] text-[24px]">verified</span>
          <div className="flex-1">
            <h5 className="font-['Inter'] text-[13px] font-bold">{toastMessage}</h5>
            <p className="font-['Inter'] text-[11px] opacity-80">
              Synchronized with MongoDB replica set.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="p-1 text-white/80 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
