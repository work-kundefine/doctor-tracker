'use client';

import React from 'react';
import { AuthGateway } from '../../components/AuthGateway';
import { useAuth } from '../../lib/auth-context';

export default function LoginPage() {
  const { login, expirationNotice } = useAuth();

  const handleLoginSuccess = (user: any, token?: string) => {
    if (token) {
      login(token, user);
    }
  };

  return <AuthGateway onLoginSuccess={handleLoginSuccess} expirationNotice={expirationNotice} />;
}
