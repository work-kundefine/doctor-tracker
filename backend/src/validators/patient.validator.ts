import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(2, 'Patient full legal name is required'),
  mrn: z.string().optional(),
  dob: z.string().min(4, 'Date of birth is required'),
  age: z.coerce.number().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  condition: z.enum(['Critical Care', 'Post-Operative', 'Chronic Management', 'Stable', 'Routine Observation']),
  diagnosis: z.string().min(2, 'Primary diagnosis is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  hospital: z.string().optional(),
  ward: z.string().min(1, 'Ward is required'),
  roomBed: z.string().min(1, 'Room and bed is required'),
  admissionDate: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    relation: z.string().min(2, 'Relation is required'),
    phone: z.string().min(5, 'Emergency contact phone is required'),
  }),
  notes: z.string().optional(),
});

export const updatePatientSchema = z.object({
  name: z.string().min(2).optional(),
  dob: z.string().optional(),
  age: z.coerce.number().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  condition: z.enum(['Critical Care', 'Post-Operative', 'Chronic Management', 'Stable', 'Routine Observation']).optional(),
  diagnosis: z.string().optional(),
  doctorId: z.string().optional(),
  hospital: z.string().optional(),
  ward: z.string().optional(),
  roomBed: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relation: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

export const patientQuerySchema = z.object({
  search: z.string().optional(),
  condition: z.string().optional(),
  doctorId: z.string().optional(),
  hospital: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default('admissionDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkActionSchema = z.object({
  action: z.enum(['export', 'reassign_doctor', 'transfer_ward', 'flag_critical']),
  patientIds: z.array(z.string()).min(1, 'At least one patient must be selected'),
  newDoctorId: z.string().optional(),
  newWard: z.string().optional(),
});
