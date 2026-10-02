'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthGateway } from '../../components/AuthGateway';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
}
