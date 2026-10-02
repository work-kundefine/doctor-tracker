export interface CreatePatientDTO {
  name: string;
  mrn?: string;
  dob: string;
  age?: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: 'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation';
  diagnosis: string;
  doctorId: string;
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
}

export interface UpdatePatientDTO {
  name?: string;
  dob?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  condition?: 'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation';
  diagnosis?: string;
  doctorId?: string;
  ward?: string;
  roomBed?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  notes?: string;
}

export interface PatientQueryDTO {
  search?: string;
  condition?: string;
  doctorId?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkActionDTO {
  action: 'export' | 'reassign_doctor' | 'transfer_ward' | 'flag_critical';
  patientIds: string[];
  newDoctorId?: string;
  newWard?: string;
}
