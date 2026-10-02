export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'director' | 'physician';
  title?: string;
  hospital?: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    title: string;
    hospital: string;
    avatarUrl?: string;
  };
}
