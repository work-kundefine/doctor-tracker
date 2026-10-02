import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface DoctorsViewProps {
  onOpenRegisterModal: () => void;
  onOpenAdmitModalForDoctor: (doctor: any) => void;
  searchQuery?: string;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  onOpenRegisterModal,
  onOpenAdmitModalForDoctor,
  searchQuery = '',
}) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 142, totalPages: 15 });
  const [search, setSearch] = useState(searchQuery);
  const [specialization, setSpecialization] = useState('All');
  const [hospital, setHospital] = useState('All');
  const [dateFilter, setDateFilter] = useState('any');
  const [activeOnly, setActiveOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Drawer state for assigned patients
  const [activeDoctorDrawer, setActiveDoctorDrawer] = useState<any | null>(null);
  const [drawerPatients, setDrawerPatients] = useState<any[]>([]);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await api.doctors.getAll({
        search,
        specialization: specialization === 'All' ? '' : specialization,
        hospital: hospital === 'All' ? '' : hospital,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res.success && res.data) {
        setDoctors(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (e) {
      console.warn('Doctors fetch note:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specialization, hospital, pagination.page, pagination.limit]);

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  const openPatientDrawer = async (doctor: any) => {
    setActiveDoctorDrawer(doctor);
    setIsDrawerLoading(true);
    try {
      const res = await api.doctors.getPatients(doctor.id || doctor._id);
      if (res.success && res.data?.patients) {
        setDrawerPatients(res.data.patients);
      }
    } catch (e) {
      console.warn('Error fetching doctor patients:', e);
    } finally {
      setIsDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setActiveDoctorDrawer(null);
    setDrawerPatients([]);
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (window.confirm(`Are you certain you wish to remove ${name} from active staff roster?`)) {
      const res = await api.doctors.delete(id);
      if (res.success) {
        fetchDoctors();
      } else {
        alert(res.message || 'Failed to remove doctor');
      }
    }
  };

  const handleRemovePatientFromDoctor = async (patientId: string, patientName: string) => {
    if (!activeDoctorDrawer) return;
    if (window.confirm(`Remove ${patientName} from ${activeDoctorDrawer.name}'s caseload?`)) {
      const res = await api.doctors.deletePatient(
        activeDoctorDrawer.id || activeDoctorDrawer._id,
        patientId
      );
      if (res.success) {
        setDrawerPatients((prev) => prev.filter((p) => p.id !== patientId && p._id !== patientId));
        fetchDoctors();
      }
    }
  };

  const handleExport = () => {
    alert('Generating full encrypted CSV extract for physician roster records...');
  };

  return (
    <div className="w-full">
      {/* Top Level Telemetry & Header Bar */}
      <div className="px-6 md:px-8 pt-6 pb-4 max-w-[1720px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#006a61] mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="font-['Inter'] text-[11px] uppercase tracking-wider font-bold">
                Staffing Telemetry & Directory
              </span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tracking-tight">
              Doctor Management
            </h1>
            <p className="font-['Inter'] text-[14px] text-[#45464d] mt-1">
              Directory of registered physicians, clinical specializations, and real-time patient loads across network sites.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0b1c30] font-['Inter'] text-[13px] font-medium shadow-xs border border-[#c6c6cd]/40 hover:bg-[#eff4ff] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Doctors list</span>
            </button>
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000000] text-white font-['Inter'] text-[13px] font-semibold shadow-md hover:bg-[#131b2e] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Register New Doctor</span>
            </button>
          </div>
        </div>

        {/* Quick Vital Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Total Active Staff</span>
              <span className="p-2 rounded-xl bg-[#eff4ff] text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">groups</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                142
              </span>
              <span className="font-['Inter'] text-[11px] text-[#006f66] font-bold bg-[#86f2e4]/30 px-2 py-0.5 rounded-full">
                +6 this mo
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Active In-Shift</span>
              <span className="p-2 rounded-xl bg-[#86f2e4]/30 text-[#006a61] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">pulse_alert</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                94
              </span>
              <span className="font-['Inter'] text-[12px] text-[#006a61] font-semibold">
                66.2% On Duty
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Avg Ratio (Doc:Patient)</span>
              <span className="p-2 rounded-xl bg-[#eff4ff] text-[#45464d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">balance</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#0b1c30] tabular-nums">
                1:19
              </span>
              <span className="font-['Inter'] text-[12px] text-[#45464d]">
                Optimal limit: 1:24
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">Pending Reviews</span>
              <span className="p-2 rounded-xl bg-[#ffdad6]/50 text-[#93000a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">priority_high</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold text-[#ba1a1a] tabular-nums">
                3
              </span>
              <span className="font-['Inter'] text-[12px] text-[#ba1a1a] font-semibold">
                License re-cert
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="px-6 md:px-8 pb-12 flex flex-col gap-4 max-w-[1720px] mx-auto w-full">
        {/* Filter and Search Control Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c6c6cd]/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Field */}
            <div className="relative flex-1 min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, email, or hospital..."
                className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] placeholder:text-[#45464d] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006a61] transition-all border border-[#c6c6cd]/30"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Specialization Filter */}
              <div className="relative">
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="appearance-none bg-[#eff4ff] font-['Inter'] text-[13px] text-[#0b1c30] pl-3 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
                >
                  <option value="All">All Specializations</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Hospital Filter */}
              <div className="relative">
                <select
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="appearance-none bg-[#eff4ff] font-['Inter'] text-[13px] text-[#0b1c30] pl-3 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
                >
                  <option value="All">All Hospitals</option>
                  <option value="St. Jude">St. Jude Central Campus</option>
                  <option value="Metro General">Metro General Hospital</option>
                  <option value="Westside">Westside Surgical Clinic</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Date Joined Filter */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-[#eff4ff] font-['Inter'] text-[13px] text-[#0b1c30] pl-3 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
                >
                  <option value="any">Date Joined: Any time</option>
                  <option value="30">Past 30 days</option>
                  <option value="90">Past Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Active Status Toggle */}
              <label className="flex items-center gap-2 bg-[#eff4ff] px-3 py-2 rounded-xl cursor-pointer hover:bg-[#e5eeff] transition-colors select-none border border-[#c6c6cd]/30">
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006a61] accent-[#006a61] cursor-pointer"
                />
                <span className="font-['Inter'] text-[13px] text-[#0b1c30] font-medium">Active only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Doctors Data Table Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-[#eff4ff] text-[#45464d] font-['Inter'] text-[11px] uppercase tracking-wider h-11 border-b border-[#c6c6cd]/25">
                  <th className="pl-6 pr-3 font-semibold">Doctor Profile</th>
                  <th className="px-3 font-semibold">Specialization</th>
                  <th className="px-3 font-semibold">Hospital Affiliation</th>
                  <th className="px-3 font-semibold">Contact Details</th>
                  <th className="px-3 font-semibold">Caseload</th>
                  <th className="px-3 font-semibold">Status</th>
                  <th className="pr-6 pl-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]/15">
                {doctors.map((doc) => (
                  <tr key={doc.id || doc._id} className="hover:bg-[#eff4ff]/60 transition-colors group">
                    {/* Doctor Profile */}
                    <td className="pl-6 pr-3 py-3.5">
                      <div className="flex items-center gap-3">
                        {doc.avatarUrl ? (
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="w-10 h-10 rounded-full object-cover shadow-xs border border-[#c6c6cd]/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#dce9ff] text-[#0b1c30] font-bold text-[13px] flex items-center justify-center">
                            MD
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-['Inter'] text-[14px] text-[#0b1c30] font-bold truncate group-hover:text-[#006a61] transition-colors">
                            {doc.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#45464d]">
                            NPI-{doc.npi}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-3 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-['Inter'] text-[12px] bg-[#cce5ff] text-[#001d31] font-semibold">
                        {doc.specialization}
                      </span>
                    </td>

                    {/* Hospital Affiliation */}
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-['Inter'] text-[13px] text-[#0b1c30] font-medium">
                          {doc.hospital}
                        </span>
                        <span className="font-['Inter'] text-[12px] text-[#45464d]">
                          {doc.suite || 'Main Clinical Wing'}
                        </span>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col font-['Inter'] text-[13px] tabular-nums">
                        <span className="text-[#0b1c30]">{doc.phone}</span>
                        <span className="text-[#45464d] text-[11px]">{doc.email}</span>
                      </div>
                    </td>

                    {/* Caseload Pill (Clickable) */}
                    <td className="px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => openPatientDrawer(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] hover:bg-[#86f2e4] font-['Inter'] text-[12px] transition-colors cursor-pointer group/pill border border-[#006a61]/20 font-bold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                        <span>{doc.patientCount || 34} Patients</span>
                        <span className="material-symbols-outlined text-[14px] group-hover/pill:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </button>
                    </td>

                    {/* Duty Status */}
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-['Inter'] text-[11px] font-bold ${
                          doc.dutyStatus === 'on_duty'
                            ? 'bg-[#86f2e4]/30 text-[#006a61]'
                            : doc.dutyStatus === 'on_call'
                            ? 'bg-[#eff4ff] text-[#45464d]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            doc.dutyStatus === 'on_duty'
                              ? 'bg-[#006a61] animate-pulse'
                              : 'bg-[#76777d]'
                          }`}
                        ></span>
                        <span>{doc.dutyStatus === 'on_duty' ? 'Active Duty' : 'On Call'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pr-6 pl-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openPatientDrawer(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[12px] font-semibold transition-colors cursor-pointer"
                        >
                          View Patients
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenAdmitModalForDoctor(doc)}
                          className="p-1.5 rounded-lg text-[#006a61] hover:bg-[#86f2e4]/30 transition-colors cursor-pointer"
                          title="Admit Patient Under Doctor"
                        >
                          <span className="material-symbols-outlined text-[18px]">person_add</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDoctor(doc.id || doc._id, doc.name)}
                          className="p-1.5 rounded-lg text-[#45464d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                          title="Delete Doctor"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Main Table Footer: Pagination & Metric Summary */}
          <div className="px-6 py-3.5 bg-white border-t border-[#c6c6cd]/25 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-[#45464d] font-['Inter'] text-[12px]">
              <span>
                Showing <span className="font-bold text-[#0b1c30]">1</span> to{' '}
                <span className="font-bold text-[#0b1c30]">{doctors.length}</span> of{' '}
                <span className="font-bold text-[#0b1c30]">{pagination.total}</span> doctors
              </span>
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination({ ...pagination, limit: Number(e.target.value) })}
                  className="bg-[#eff4ff] px-2 py-1 rounded text-[#0b1c30] text-[12px] focus:outline-none border border-[#c6c6cd]/30"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1 font-['Inter'] text-[12px]">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                className="px-2.5 py-1 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors flex items-center disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
                Previous
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#000000] text-white font-bold flex items-center justify-center"
              >
                {pagination.page}
              </button>
              <button
                type="button"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                className="w-8 h-8 rounded-lg text-[#0b1c30] hover:bg-[#eff4ff] font-medium flex items-center justify-center cursor-pointer"
              >
                {pagination.page + 1}
              </button>
              <span className="px-1 text-[#45464d]">...</span>
              <button
                type="button"
                onClick={() => setPagination({ ...pagination, page: pagination.totalPages })}
                className="w-8 h-8 rounded-lg text-[#0b1c30] hover:bg-[#eff4ff] font-medium flex items-center justify-center cursor-pointer"
              >
                {pagination.totalPages}
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                className="px-2.5 py-1 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors flex items-center cursor-pointer disabled:opacity-40"
              >
                Next
                <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slide-over Drawer (Assigned Patients under Doctor) */}
      {activeDoctorDrawer && (
        <>
          <div
            onClick={closeDrawer}
            className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs z-50 transition-opacity"
          ></div>
          <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-l border-[#c6c6cd]/30 animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="px-6 py-5 bg-[#eff4ff]/80 border-b border-[#c6c6cd]/30 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#006a61] font-['Inter'] text-[11px] uppercase font-bold">
                  <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                  <span>{activeDoctorDrawer.specialization} Department</span>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-1 rounded-lg text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="mt-1">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                  {activeDoctorDrawer.name} – Assigned Patients (
                  {drawerPatients.length || activeDoctorDrawer.patientCount || 34})
                </h2>
                <p className="font-['Inter'] text-[12px] text-[#45464d]">
                  {activeDoctorDrawer.specialization} • {activeDoctorDrawer.hospital}
                </p>
              </div>

              {/* Quick Action Inside Drawer */}
              <div className="mt-3 flex items-center justify-between gap-3 pt-1">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[16px]">
                    filter_list
                  </span>
                  <input
                    type="text"
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                    placeholder="Filter patient queue..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl font-['Inter'] text-[12px] text-[#0b1c30] placeholder:text-[#45464d] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    onOpenAdmitModalForDoctor(activeDoctorDrawer);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#006a61] text-white font-['Inter'] text-[12px] font-semibold hover:bg-[#005049] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>+ Add Patient</span>
                </button>
              </div>
            </div>

            {/* Drawer Content: Patient Mini-Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[#45464d] font-['Inter'] text-[11px] uppercase tracking-wider px-1 font-semibold">
                  <span>Active Patient Record</span>
                  <span>Action</span>
                </div>

                {drawerPatients
                  .filter((p) => !drawerSearch || p.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id || p._id}
                      className="bg-[#eff4ff] rounded-xl p-3 hover:bg-[#e5eeff] transition-colors flex items-center justify-between gap-3 border border-[#c6c6cd]/25"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#0b1c30] font-['Inter'] text-[13px] shrink-0">
                          {p.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-['Inter'] text-[13px] text-[#0b1c30] font-bold">
                              {p.name}
                            </span>
                            <span className="font-['Inter'] text-[11px] text-[#45464d]">Age {p.age || 42}</span>
                          </div>
                          <span className="font-['Inter'] text-[11px] text-[#006a61] font-semibold mt-0.5">
                            {p.condition} • {p.ward} ({p.roomBed})
                          </span>
                          <span className="font-mono text-[10px] text-[#45464d] mt-0.5">
                            MRN: {p.mrn} • Admitted: {new Date(p.admissionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePatientFromDoctor(p.id || p._id, p.name)}
                        className="p-2 text-[#45464d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer"
                        title="Remove patient from doctor roster"
                      >
                        <span className="material-symbols-outlined text-[18px]">person_remove</span>
                      </button>
                    </div>
                  ))}

                {/* Metric Spark Summary Inside Drawer */}
                <div className="mt-4 p-4 rounded-xl bg-white shadow-xs border border-[#c6c6cd]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between font-['Inter'] text-[12px]">
                    <span className="text-[#0b1c30] font-semibold">Weekly Case Turnover</span>
                    <span className="font-bold text-[#006a61]">92% Discharge Target</span>
                  </div>
                  <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#006a61] h-full rounded-full w-[92%] transition-all duration-500"></div>
                  </div>
                  <span className="font-['Inter'] text-[11px] text-[#45464d]">
                    {activeDoctorDrawer.name} is within standard patient threshold limits for{' '}
                    {activeDoctorDrawer.specialization} units.
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#eff4ff]/80 border-t border-[#c6c6cd]/30 flex items-center justify-between font-['Inter'] text-[12px] text-[#45464d]">
              <span>Showing {drawerPatients.length} active patients</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="px-4 py-2 rounded-xl bg-white border border-[#c6c6cd]/30 text-[#0b1c30] hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};
