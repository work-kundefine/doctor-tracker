'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { DoctorsView } from '../../components/DoctorsView';
import { RegisterDoctorModal } from '../../components/RegisterDoctorModal';
import { AdmitPatientModal } from '../../components/AdmitPatientModal';
import { useAuth } from '../../lib/auth-context';

export default function DoctorsPage() {
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');
  const [isRegisterDoctorOpen, setIsRegisterDoctorOpen] = useState(false);
  const [isAdmitPatientOpen, setIsAdmitPatientOpen] = useState(false);
  const [targetDoctorForAdmit, setTargetDoctorForAdmit] = useState<any | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleOpenAdmitForDoctor = (doctor: any) => {
    setTargetDoctorForAdmit(doctor);
    setIsAdmitPatientOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Loading Doctors Roster...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onLogout={logout}
          onSearch={(q) => setSearchQuery(q)}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
        />
        <main className="relative pt-16 w-full min-h-screen bg-[#f8f9ff]">
          <DoctorsView
            key={`doctors-${refreshCounter}`}
            searchQuery={searchQuery}
            onOpenRegisterModal={() => setIsRegisterDoctorOpen(true)}
            onOpenAdmitModalForDoctor={handleOpenAdmitForDoctor}
          />
        </main>
      </div>

      <RegisterDoctorModal
        isOpen={isRegisterDoctorOpen}
        onClose={() => setIsRegisterDoctorOpen(false)}
        onSuccess={() => setRefreshCounter((p) => p + 1)}
      />

      <AdmitPatientModal
        isOpen={isAdmitPatientOpen}
        targetDoctor={targetDoctorForAdmit}
        onClose={() => {
          setIsAdmitPatientOpen(false);
          setTargetDoctorForAdmit(null);
        }}
        onSuccess={() => setRefreshCounter((p) => p + 1)}
      />
    </div>
  );
}
