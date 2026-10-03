import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthGateway } from './components/AuthGateway';
import { DashboardView } from './components/DashboardView';
import { DoctorsView } from './components/DoctorsView';
import { PatientsView } from './components/PatientsView';
import { RegisterDoctorModal } from './components/RegisterDoctorModal';
import { AdmitPatientModal } from './components/AdmitPatientModal';
import { EditPatientModal } from './components/EditPatientModal';
import { PatientTimelineDrawer } from './components/PatientTimelineDrawer';
import {
  api,
  getStoredToken,
  getStoredUser,
  removeStoredToken,
} from './lib/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expirationNotice, setExpirationNotice] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'doctors' | 'patients'>('dashboard');
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

  const handleLogout = useCallback((notice?: string) => {
    removeStoredToken();
    setCurrentUser(null);
    if (notice) {
      setExpirationNotice(notice);
    }
  }, []);

  // Initialize from storage and verify with backend
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setCurrentUser(storedUser);
      // Validate session with the backend
      api.auth.getMe().then((res) => {
        if (!res.success) {
          handleLogout('Your session has expired. Please sign in again to continue.');
        } else if (res.data) {
          setCurrentUser(res.data);
        }
      });
    }
    setIsInitializing(false);
  }, [handleLogout]);

  // Global listener for dt:session_expired dispatched from 401 API responses
  useEffect(() => {
    const handleExpired = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      handleLogout(customEvent.detail?.message || 'Your session has expired. Please sign in again.');
    };

    window.addEventListener('dt:session_expired', handleExpired);
    return () => {
      window.removeEventListener('dt:session_expired', handleExpired);
    };
  }, [handleLogout]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setExpirationNotice(null);
    setCurrentView('dashboard');
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
          <div className="w-9 h-9 border-3 border-[#006a61] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-['Inter'] text-[13px] text-[#45464d] font-medium">
            Loading Doctor Tracker...
          </span>
        </div>
      </div>
    );
  }

  // If not logged in, present the Auth Gateway
  if (!currentUser) {
    return <AuthGateway onLoginSuccess={handleLoginSuccess} expirationNotice={expirationNotice} />;
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
      />

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Fixed Top Bar */}
        <Header
          user={currentUser}
          onLogout={() => handleLogout()}
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
              onOpenRegisterDoctor={() => setIsRegisterDoctorOpen(true)}
              onOpenAdmitPatient={handleOpenDirectAdmit}
              onOpenDoctorAdmit={handleOpenAdmitForDoctor}
              onOpenPatientTimeline={handleOpenTimeline}
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
