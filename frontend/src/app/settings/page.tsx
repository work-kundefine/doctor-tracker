'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { SystemSettingsView } from '../../components/SystemSettingsView';
import { getStoredToken, getStoredUser, removeStoredToken } from '../../lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedCampus, setSelectedCampus] = useState('St. Jude Central Campus');

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

  if (!currentUser) return null;

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      <Sidebar
        currentView="settings"
        onNavigate={(view) => {
          if (view === 'dashboard') router.push('/');
          else router.push(`/${view}`);
        }}
      />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header
          user={currentUser}
          onLogout={handleLogout}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
        />
        <main className="relative pt-16 w-full min-h-screen bg-[#f8f9ff]">
          <SystemSettingsView />
        </main>
      </div>
    </div>
  );
}
