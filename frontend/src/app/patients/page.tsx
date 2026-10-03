'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { PatientsView } from '../../components/PatientsView';
import { AdmitPatientModal } from '../../components/AdmitPatientModal';
import { EditPatientModal } from '../../components/EditPatientModal';
import { PatientTimelineDrawer } from '../../components/PatientTimelineDrawer';
import { useAuth } from '../../lib/auth-context';

export default function PatientsPage() {
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');
  const [isAdmitPatientOpen, setIsAdmitPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<any | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState<any | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleOpenEditPatient = (patient: any) => {
    setSelectedPatientForEdit(patient);
    setIsEditPatientOpen(true);
  };

  const handleOpenTimeline = (patient: any) => {
    setSelectedPatientForTimeline(patient);
    setIsTimelineOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Loading Patients Registry...
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
          <PatientsView
            key={`patients-${refreshCounter}`}
            searchQuery={searchQuery}
            onOpenAdmitModal={() => setIsAdmitPatientOpen(true)}
            onOpenEditModal={handleOpenEditPatient}
            onOpenTimelineDrawer={handleOpenTimeline}
          />
        </main>
      </div>

      <AdmitPatientModal
        isOpen={isAdmitPatientOpen}
        onClose={() => setIsAdmitPatientOpen(false)}
        onSuccess={() => setRefreshCounter((p) => p + 1)}
      />

      <EditPatientModal
        isOpen={isEditPatientOpen}
        patient={selectedPatientForEdit}
        onClose={() => {
          setIsEditPatientOpen(false);
          setSelectedPatientForEdit(null);
        }}
        onSuccess={() => setRefreshCounter((p) => p + 1)}
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
