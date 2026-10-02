'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { DoctorsView } from '../../components/DoctorsView';
import { RegisterDoctorModal } from '../../components/RegisterDoctorModal';
import { AdmitPatientModal } from '../../components/AdmitPatientModal';
import { getStoredToken, getStoredUser, removeStoredToken } from '../../lib/api';

export default function DoctorsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');
  const [isRegisterDoctorOpen, setIsRegisterDoctorOpen] = useState(false);
  const [isAdmitPatientOpen, setIsAdmitPatientOpen] = useState(false);
  const [targetDoctorForAdmit, setTargetDoctorForAdmit] = useState<any | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (!token || !storedUser) {
      router.push('/login');
    } else {
      setCurrentUser(storedUser);
    }
  }, [router]);

  const handleLogout = () => {
    removeStoredToken();
    router.push('/login');
  };

  const handleOpenAdmitForDoctor = (doctor: any) => {
    setTargetDoctorForAdmit(doctor);
    setIsAdmitPatientOpen(true);
  };

  if (!currentUser) return null;

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      <Sidebar
        currentView="doctors"
        onNavigate={(view) => {
          if (view === 'dashboard') router.push('/');
          else router.push(`/${view}`);
        }}
      />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header
          user={currentUser}
          onLogout={handleLogout}
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
