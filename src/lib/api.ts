/**
 * Doctor Tracker API Client
 * Manages JWT session tokens, headers, and type-safe REST communication
 */

const API_BASE = '/api';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dt_auth_token');
}

export function setStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dt_auth_token', token);
  }
}

export function removeStoredToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('dt_auth_token');
    localStorage.removeItem('dt_user_profile');
  }
}

export interface JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token?: string | null): boolean {
  const currentToken = token || getStoredToken();
  if (!currentToken) return true;
  const payload = parseJwt(currentToken);
  if (!payload || !payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function getTokenRemainingMs(token?: string | null): number {
  const currentToken = token || getStoredToken();
  if (!currentToken) return 0;
  const payload = parseJwt(currentToken);
  if (!payload || !payload.exp) return 0;
  const diff = payload.exp * 1000 - Date.now();
  return diff > 0 ? diff : 0;
}

export function handleSessionExpiration(reason?: string) {
  removeStoredToken();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dt:session_expired', {
        detail: { message: reason || 'Your session has expired. Please sign in again.' },
      })
    );
  }
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('dt_user_profile');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dt_user_profile', JSON.stringify(user));
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; pagination?: any; errors?: any[] }> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          handleSessionExpiration(data.message || 'Your session has expired. Please sign in again.');
        }
      }
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
        errors: data.errors,
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network connection to clinical gateway lost',
    };
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string; rememberMe?: boolean }) =>
      apiRequest<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      apiRequest<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => apiRequest<any>('/auth/me'),
  },

  // Doctors
  doctors: {
    getAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      return apiRequest<any>(`/doctors?${query.toString()}`);
    },
    getById: (id: string) => apiRequest<any>(`/doctors/${id}`),
    create: (doctorData: any) =>
      apiRequest<any>('/doctors', {
        method: 'POST',
        body: JSON.stringify(doctorData),
      }),
    update: (id: string, doctorData: any) =>
      apiRequest<any>(`/doctors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(doctorData),
      }),
    delete: (id: string) =>
      apiRequest<any>(`/doctors/${id}`, {
        method: 'DELETE',
      }),
    getPatients: (id: string) => apiRequest<any>(`/doctors/${id}/patients`),
    addPatient: (id: string, patientData: any) =>
      apiRequest<any>(`/doctors/${id}/patients`, {
        method: 'POST',
        body: JSON.stringify(patientData),
      }),
    deletePatient: (id: string, patientId: string) =>
      apiRequest<any>(`/doctors/${id}/patients/${patientId}`, {
        method: 'DELETE',
      }),
  },

  // Patients
  patients: {
    getAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      return apiRequest<any>(`/patients?${query.toString()}`);
    },
    getById: (id: string) => apiRequest<any>(`/patients/${id}`),
    create: (patientData: any) =>
      apiRequest<any>('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData),
      }),
    update: (id: string, patientData: any) =>
      apiRequest<any>(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patientData),
      }),
    delete: (id: string) =>
      apiRequest<any>(`/patients/${id}`, {
        method: 'DELETE',
      }),
    bulkAction: (actionData: any) =>
      apiRequest<any>('/patients/bulk', {
        method: 'POST',
        body: JSON.stringify(actionData),
      }),
  },

  // Analytics
  analytics: {
    getOverview: () => apiRequest<any>('/analytics/overview'),
    getTrends: (range: string = '30D') => apiRequest<any>(`/analytics/trends?range=${range}`),
    getSpecialties: () => apiRequest<any>('/analytics/specialties'),
    getWorkload: () => apiRequest<any>('/analytics/workload'),
    getRecent: () => apiRequest<any>('/analytics/recent'),
  },
};
