import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name is required'),
  titlePrefix: z.string().default('Dr.'),
  specialization: z.string().min(2, 'Specialization is required'),
  subSpecialty: z.string().optional(),
  hospital: z.string().min(2, 'Hospital affiliation is required'),
  suite: z.string().optional(),
  phone: z.string().min(5, 'Valid contact phone number is required'),
  email: z.string().email('Valid institutional email is required'),
  npi: z.string().min(5, 'National Provider Identifier (NPI) is required'),
  maxCaseload: z.number().min(5).max(100).optional(),
  dutyStatus: z.enum(['on_duty', 'on_call', 'off_duty']).default('on_duty'),
  avatarUrl: z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const doctorQuerySchema = z.object({
  search: z.string().optional(),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  dutyStatus: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const addDoctorPatientSchema = z.object({
  name: z.string().min(2, 'Patient full legal name is required'),
  mrn: z.string().optional(),
  dob: z.string().min(4, 'Date of birth is required'),
  age: z.coerce.number().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  condition: z.enum(['Critical Care', 'Post-Operative', 'Chronic Management', 'Stable', 'Routine Observation']),
  diagnosis: z.string().min(2, 'Primary diagnosis is required'),
  hospital: z.string().optional(),
  ward: z.string().min(1, 'Assigned ward is required'),
  roomBed: z.string().min(1, 'Room / bed assignment is required'),
  admissionDate: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    relation: z.string().min(2, 'Relationship is required'),
    phone: z.string().min(5, 'Emergency contact phone is required'),
  }),
  notes: z.string().optional(),
  immediateAlert: z.boolean().optional(),
});
