'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface DashboardViewProps {
  onNavigateToDoctors: () => void;
  onNavigateToPatients: () => void;
  onOpenRegisterDoctor?: () => void;
  onOpenAdmitPatient?: () => void;
  onOpenPatientTimeline?: (patient: any) => void;
  onOpenDoctorAdmit?: (doctor: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToDoctors,
  onNavigateToPatients,
  onOpenRegisterDoctor,
  onOpenAdmitPatient,
  onOpenPatientTimeline,
  onOpenDoctorAdmit,
}) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBackendData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        api.doctors.getAll({ limit: 10 }),
        api.patients.getAll({ limit: 10 }),
      ]);

      if (doctorsRes.success && doctorsRes.data) {
        setDoctors(doctorsRes.data);
      }
      if (patientsRes.success && patientsRes.data) {
        setPatients(patientsRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve data from database services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  const getConditionColor = (cond: string) => {
    switch (cond?.toLowerCase()) {
      case 'critical care':
        return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30';
      case 'post-operative':
        return 'bg-[#e5eeff] text-[#005bb5] border-[#005bb5]/30';
      case 'chronic management':
        return 'bg-[#fff8e1] text-[#b26a00] border-[#b26a00]/30';
      default:
        return 'bg-[#e6f4ea] text-[#137333] border-[#137333]/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_duty':
        return 'bg-[#006a61] text-white';
      case 'on_call':
        return 'bg-[#188ace] text-white';
      default:
        return 'bg-[#76777d] text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Fetching records from database...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold text-[#0b1c30]">
            Clinical Operations Dashboard
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#45464d] mt-0.5">
            Active physician roster and admitted patient records
          </p>
        </div>

        {/* Real Action Buttons */}
        <div className="flex items-center gap-3">
          {onOpenRegisterDoctor && (
            <button
              type="button"
              onClick={onOpenRegisterDoctor}
              className="flex items-center gap-2 bg-white hover:bg-[#eff4ff] border border-[#c6c6cd]/50 text-[#0b1c30] px-4 py-2 rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006a61]">person_add</span>
              <span>Register Doctor</span>
            </button>
          )}

          {onOpenAdmitPatient && (
            <button
              type="button"
              onClick={onOpenAdmitPatient}
              className="flex items-center gap-2 bg-[#006a61] hover:bg-[#00524b] text-white px-4 py-2 rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">personal_injury</span>
              <span>Admit Patient</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-xl p-4 text-[13px] text-[#93000a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
          <button
            onClick={loadBackendData}
            className="underline font-semibold hover:text-[#0b1c30] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Recent Admitted Patients */}
        <div className="bg-white rounded-2xl border border-[#c6c6cd]/30 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61] text-[20px]">
                personal_injury
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                Admitted Patients ({patients.length})
              </h2>
            </div>
            <button
              onClick={onNavigateToPatients}
              className="text-[12px] font-semibold text-[#006a61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Registry</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="divide-y divide-[#c6c6cd]/15 flex-1 overflow-y-auto max-h-[460px]">
            {patients.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-[#c6c6cd]">personal_injury</span>
                <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
                  No patients currently admitted in the registry.
                </span>
                {onOpenAdmitPatient && (
                  <button
                    type="button"
                    onClick={onOpenAdmitPatient}
                    className="mt-1 text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
                  >
                    + Admit First Patient
                  </button>
                )}
              </div>
            ) : (
              patients.map((pat) => (
                <div
                  key={pat._id || pat.id}
                  className="p-4 hover:bg-[#eff4ff]/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Inter'] font-bold text-[14px] text-[#0b1c30] truncate">
                        {pat.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#76777d] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c6c6cd]/30">
                        {pat.mrn}
                      </span>
                    </div>
                    <span className="font-['Inter'] text-[12px] text-[#45464d] truncate mt-0.5">
                      {pat.doctorName ? `Physician: ${pat.doctorName}` : pat.diagnosis}
                    </span>
                    <span className="font-['Inter'] text-[11px] text-[#76777d] mt-0.5">
                      {pat.ward} • {pat.roomBed}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getConditionColor(
                        pat.condition
                      )}`}
                    >
                      {pat.condition}
                    </span>
                    {onOpenPatientTimeline && (
                      <button
                        type="button"
                        onClick={() => onOpenPatientTimeline(pat)}
                        className="p-1.5 text-[#45464d] hover:text-[#006a61] hover:bg-[#eff4ff] rounded-lg transition-colors cursor-pointer"
                        title="View Patient Timeline"
                      >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Doctors Roster */}
        <div className="bg-white rounded-2xl border border-[#c6c6cd]/30 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61] text-[20px]">
                stethoscope
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                Physician Roster ({doctors.length})
              </h2>
            </div>
            <button
              onClick={onNavigateToDoctors}
              className="text-[12px] font-semibold text-[#006a61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Doctors</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="divide-y divide-[#c6c6cd]/15 flex-1 overflow-y-auto max-h-[460px]">
            {doctors.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-[#c6c6cd]">stethoscope</span>
                <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
                  No doctors currently registered in the database.
                </span>
                {onOpenRegisterDoctor && (
                  <button
                    type="button"
                    onClick={onOpenRegisterDoctor}
                    className="mt-1 text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
                  >
                    + Register First Doctor
                  </button>
                )}
              </div>
            ) : (
              doctors.map((doc) => (
                <div
                  key={doc._id || doc.id}
                  className="p-4 hover:bg-[#eff4ff]/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        doc.avatarUrl ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
                      }
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#c6c6cd]/40 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Inter'] font-bold text-[14px] text-[#0b1c30] truncate">
                        {doc.name}
                      </span>
                      <span className="font-['Inter'] text-[12px] text-[#006a61] font-semibold truncate">
                        {doc.specialization}
                      </span>
                      <span className="font-['Inter'] text-[11px] text-[#76777d] truncate">
                        {doc.hospital}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(
                        doc.dutyStatus
                      )}`}
                    >
                      {doc.dutyStatus?.replace('_', ' ') || 'on duty'}
                    </span>
                    {onOpenDoctorAdmit && (
                      <button
                        type="button"
                        onClick={() => onOpenDoctorAdmit(doc)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#006a61] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg transition-colors cursor-pointer border border-[#c6c6cd]/30"
                        title="Admit patient under this doctor"
                      >
                        + Admit
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
