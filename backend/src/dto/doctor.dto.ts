export interface CreateDoctorDTO {
  name: string;
  titlePrefix?: string;
  specialization: string;
  subSpecialty?: string;
  hospital: string;
  suite?: string;
  phone: string;
  email: string;
  npi: string;
  maxCaseload?: number;
  dutyStatus?: 'on_duty' | 'on_call' | 'off_duty';
  avatarUrl?: string;
}

export interface UpdateDoctorDTO {
  name?: string;
  titlePrefix?: string;
  specialization?: string;
  subSpecialty?: string;
  hospital?: string;
  suite?: string;
  phone?: string;
  email?: string;
  npi?: string;
  maxCaseload?: number;
  dutyStatus?: 'on_duty' | 'on_call' | 'off_duty';
  avatarUrl?: string;
}

export interface DoctorQueryDTO {
  search?: string;
  specialization?: string;
  hospital?: string;
  dutyStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AddDoctorPatientDTO {
  name: string;
  mrn?: string;
  dob: string;
  age?: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: 'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation';
  diagnosis: string;
  hospital?: string;
  ward: string;
  roomBed: string;
  admissionDate?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  notes?: string;
  immediateAlert?: boolean;
}
