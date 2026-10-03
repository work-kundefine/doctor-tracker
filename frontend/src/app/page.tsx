'use client';

import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DashboardView } from '../components/DashboardView';
import { RegisterDoctorModal } from '../components/RegisterDoctorModal';
import { AdmitPatientModal } from '../components/AdmitPatientModal';
import { PatientTimelineDrawer } from '../components/PatientTimelineDrawer';
import { useAuth } from '../lib/auth-context';

export default function HomePage() {
  const { user, logout, isLoading } = useAuth();
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');
  const [isRegisterDoctorOpen, setIsRegisterDoctorOpen] = useState(false);
  const [isAdmitPatientOpen, setIsAdmitPatientOpen] = useState(false);
  const [targetDoctorForAdmit, setTargetDoctorForAdmit] = useState<any | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState<any | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter((p) => p + 1);
  };

  const handleOpenDoctorAdmit = (doctor: any) => {
    setTargetDoctorForAdmit(doctor);
    setIsAdmitPatientOpen(true);
  };

  const handleOpenPatientTimeline = (patient: any) => {
    setSelectedPatientForTimeline(patient);
    setIsTimelineOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Loading Doctor Tracker...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      {/* Sidebar with Next.js Link routing */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onLogout={logout}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
        />

        <main className="relative pt-16 w-full min-h-screen bg-[#f8f9ff]">
          <DashboardView
            key={`dashboard-${refreshCounter}`}
            onOpenRegisterDoctor={() => setIsRegisterDoctorOpen(true)}
            onOpenAdmitPatient={() => {
              setTargetDoctorForAdmit(null);
              setIsAdmitPatientOpen(true);
            }}
            onOpenDoctorAdmit={handleOpenDoctorAdmit}
            onOpenPatientTimeline={handleOpenPatientTimeline}
          />
        </main>
      </div>

      {/* Modals & Drawers */}
      <RegisterDoctorModal
        isOpen={isRegisterDoctorOpen}
        onClose={() => setIsRegisterDoctorOpen(false)}
        onSuccess={triggerRefresh}
      />

      <AdmitPatientModal
        isOpen={isAdmitPatientOpen}
        targetDoctor={targetDoctorForAdmit}
        onClose={() => {
          setIsAdmitPatientOpen(false);
          setTargetDoctorForAdmit(null);
        }}
        onSuccess={triggerRefresh}
      />

      <PatientTimelineDrawer
        isOpen={isTimelineOpen}
        patient={selectedPatientForTimeline}
        onClose={() => {
          setIsTimelineOpen(false);
          setSelectedPatientForTimeline(null);
        }}
      />
    </div>
  );
}
