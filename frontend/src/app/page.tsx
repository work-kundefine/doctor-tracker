'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AuthGateway } from '../components/AuthGateway';
import { DashboardView } from '../components/DashboardView';
import { DoctorsView } from '../components/DoctorsView';
import { PatientsView } from '../components/PatientsView';
import { AnalyticsView } from '../components/AnalyticsView';
import { SystemSettingsView } from '../components/SystemSettingsView';
import { RegisterDoctorModal } from '../components/RegisterDoctorModal';
import { AdmitPatientModal } from '../components/AdmitPatientModal';
import { EditPatientModal } from '../components/EditPatientModal';
import { PatientTimelineDrawer } from '../components/PatientTimelineDrawer';
import { getStoredToken, getStoredUser, removeStoredToken } from '../lib/api';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'doctors' | 'patients' | 'analytics' | 'settings'
  >('dashboard');
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isRegisterDoctorOpen, setIsRegisterDoctorOpen] = useState(false);
  const [isAdmitPatientOpen, setIsAdmitPatientOpen] = useState(false);
  const [targetDoctorForAdmit, setTargetDoctorForAdmit] = useState<any | null>(null);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<any | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState<any | null>(null);

  // Refresh triggers
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setCurrentUser(storedUser);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    removeStoredToken();
    setCurrentUser(null);
  };

  const handleOpenAdmitForDoctor = (doctor: any) => {
    setTargetDoctorForAdmit(doctor);
    setIsAdmitPatientOpen(true);
  };

  const handleOpenDirectAdmit = () => {
    setTargetDoctorForAdmit(null);
    setIsAdmitPatientOpen(true);
  };

  const handleOpenEditPatient = (patient: any) => {
    setSelectedPatientForEdit(patient);
    setIsEditPatientOpen(true);
  };

  const handleOpenTimeline = (patient: any) => {
    setSelectedPatientForTimeline(patient);
    setIsTimelineOpen(true);
  };

  const triggerDataRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  if (isInitializing) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Initializing Clinical Node...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, render Auth Gateway
  if (!currentUser) {
    return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      {/* Collateral Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        latencyMs={24}
      />

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Fixed Top Bar */}
        <Header
          user={currentUser}
          onLogout={handleLogout}
          onSearch={(q) => setSearchQuery(q)}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
        />

        {/* View Surface Container */}
        <main className="relative pt-16 w-full min-h-screen bg-[#f8f9ff]">
          {currentView === 'dashboard' && (
            <DashboardView
              key={`dashboard-${refreshCounter}`}
              onNavigateToDoctors={() => setCurrentView('doctors')}
              onNavigateToPatients={() => setCurrentView('patients')}
              onViewDoctorPatients={(docId, docName) => {
                setCurrentView('doctors');
              }}
              onViewPatientRecord={(patName) => {
                setCurrentView('patients');
                setSearchQuery(patName);
              }}
            />
          )}

          {currentView === 'doctors' && (
            <DoctorsView
              key={`doctors-${refreshCounter}`}
              searchQuery={searchQuery}
              onOpenRegisterModal={() => setIsRegisterDoctorOpen(true)}
              onOpenAdmitModalForDoctor={handleOpenAdmitForDoctor}
            />
          )}

          {currentView === 'patients' && (
            <PatientsView
              key={`patients-${refreshCounter}`}
              searchQuery={searchQuery}
              onOpenAdmitModal={handleOpenDirectAdmit}
              onOpenEditModal={handleOpenEditPatient}
              onOpenTimelineDrawer={handleOpenTimeline}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView key={`analytics-${refreshCounter}`} />}

          {currentView === 'settings' && <SystemSettingsView key={`settings-${refreshCounter}`} />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <RegisterDoctorModal
        isOpen={isRegisterDoctorOpen}
        onClose={() => setIsRegisterDoctorOpen(false)}
        onSuccess={triggerDataRefresh}
      />

      <AdmitPatientModal
        isOpen={isAdmitPatientOpen}
        targetDoctor={targetDoctorForAdmit}
        onClose={() => {
          setIsAdmitPatientOpen(false);
          setTargetDoctorForAdmit(null);
        }}
        onSuccess={triggerDataRefresh}
      />

      <EditPatientModal
        isOpen={isEditPatientOpen}
        patient={selectedPatientForEdit}
        onClose={() => {
          setIsEditPatientOpen(false);
          setSelectedPatientForEdit(null);
        }}
        onSuccess={triggerDataRefresh}
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
