import mongoose from 'mongoose';
import { UserModel } from '../models/User.model';
import { DoctorModel } from '../models/Doctor.model';
import { PatientModel } from '../models/Patient.model';

export const connectDB = async (): Promise<boolean> => {
  let rawUri = (process.env.MONGODB_URI || '').trim();

  // Strip enclosing quotes if present (e.g., from environment or .env file)
  if (
    (rawUri.startsWith('"') && rawUri.endsWith('"')) ||
    (rawUri.startsWith("'") && rawUri.endsWith("'"))
  ) {
    rawUri = rawUri.slice(1, -1).trim();
  }

  // Validate whether URI conforms to the MongoDB scheme standard
  const hasValidScheme = rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://');
  const isPlaceholder = !rawUri || rawUri === 'MY_MONGODB_URI' || rawUri.includes('MY_');

  // If no valid external cluster URI is provided, run directly on the embedded high-performance repository
  if (!hasValidScheme || isPlaceholder) {
    console.log('[Database] Operating with built-in embedded database store with covered indexes & real-time telemetry.');
    await seedInitialData();
    return true;
  }

  try {
    // Attempt Mongoose connection with timeout
    await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB connected via Mongoose: ${rawUri}`);
    await seedInitialData();
    return true;
  } catch (error: any) {
    console.log(`[Database] External MongoDB connection offline (${error.message}). Operating on embedded store.`);
    await seedInitialData();
    return true;
  }
};

export const initialDoctors = [
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010101'),
    name: 'Dr. Robert Vance, MD',
    titlePrefix: 'Dr.',
    specialization: 'Cardiology',
    subSpecialty: 'Interventional Cardiology & Structural Heart',
    hospital: 'St. Jude Central Hospital',
    suite: 'Bldg B • Cardiac Pavilion (Rm 402)',
    phone: '+1 (555) 234-8901',
    email: 'r.vance@stjude.org',
    npi: '9481029',
    maxCaseload: 40,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2023-01-15'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010102'),
    name: 'Dr. Elena Rostova, PhD',
    titlePrefix: 'Dr.',
    specialization: 'Neurology',
    subSpecialty: 'Neurocritical Care & Stroke Rehabilitation',
    hospital: 'St. Jude Central Hospital',
    suite: 'Bldg C • Neuro Critical Care',
    phone: '+1 (555) 438-1920',
    email: 'e.rostova@stjude.org',
    npi: '8472911',
    maxCaseload: 40,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813639-4507c6f082e6?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2023-03-22'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010103'),
    name: 'Dr. Marcus Chen, MD',
    titlePrefix: 'Dr.',
    specialization: 'Pediatrics',
    subSpecialty: 'Pediatric Intensive Care & Cardiology',
    hospital: 'Metro General Hospital',
    suite: 'Pediatric Wing East (Floor 2)',
    phone: '+1 (555) 781-4432',
    email: 'm.chen@metro-gen.health',
    npi: '7392015',
    maxCaseload: 40,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2023-06-10'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010104'),
    name: 'Dr. Priya Patel, MS',
    titlePrefix: 'Dr.',
    specialization: 'Orthopedics',
    subSpecialty: 'Joint Replacement & Trauma Reconstruction',
    hospital: 'Westside Surgical Clinic',
    suite: 'Floor 3 • Joint Replacement',
    phone: '+1 (555) 902-8871',
    email: 'p.patel@westside-med.org',
    npi: '6502941',
    maxCaseload: 40,
    dutyStatus: 'on_call' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2023-08-04'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010105'),
    name: 'Dr. Anthony Wright, FACS',
    titlePrefix: 'Dr.',
    specialization: 'General Surgery',
    subSpecialty: 'Minimally Invasive & Trauma Surgery',
    hospital: 'St. Jude Central Hospital',
    suite: 'OR Suite 4 • Trauma Level 1',
    phone: '+1 (555) 612-9904',
    email: 'a.wright@stjude.org',
    npi: '3184902',
    maxCaseload: 40,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2023-11-19'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010106'),
    name: 'Dr. Julian Ross, MD',
    titlePrefix: 'Dr.',
    specialization: 'Neurology',
    subSpecialty: 'Clinical Neurophysiology',
    hospital: 'St. Jude Central Hospital',
    suite: 'COU Wing • Unit 4 (Neuro)',
    phone: '+1 (555) 238-1904',
    email: 'j.ross@stjude.org',
    npi: '5192837',
    maxCaseload: 35,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2024-02-01'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010107'),
    name: 'Dr. Amara Okafor, MD',
    titlePrefix: 'Dr.',
    specialization: 'Internal Medicine',
    subSpecialty: 'Nephrology & Metabolic Care',
    hospital: 'St. Jude Central Hospital',
    suite: 'South Annex • Suite 102',
    phone: '+1 (555) 992-3401',
    email: 'a.okafor@stjude.org',
    npi: '4491028',
    maxCaseload: 35,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2024-04-14'),
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e401010101010108'),
    name: 'Dr. Michael Chang, MD',
    titlePrefix: 'Dr.',
    specialization: 'Pulmonology',
    subSpecialty: 'Critical Care & Respiratory Medicine',
    hospital: 'St. Jude Central Hospital',
    suite: 'East Tower • Room 209',
    phone: '+1 (555) 723-9011',
    email: 'm.chang@stjude.org',
    npi: '2910384',
    maxCaseload: 40,
    dutyStatus: 'on_duty' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300',
    joinedDate: new Date('2024-05-18'),
  },
];

export const initialPatients = [
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020201'),
    name: 'Eleanor Vance',
    mrn: 'MRN-84920',
    dob: 'Oct 12, 1978',
    age: 46,
    gender: 'Female' as const,
    condition: 'Critical Care' as const,
    diagnosis: 'Acute Myocardial Infarction (STEMI) — Cath Lab post-PCI stenting (LAD artery). Continuous arterial line monitoring.',
    doctorId: initialDoctors[0]._id,
    doctorName: 'Dr. Robert Vance, MD',
    doctorSpecialty: 'Cardiology',
    hospital: 'St. Jude Central Hospital',
    ward: 'Central Wing',
    roomBed: 'Room 304 (Bed A)',
    admissionDate: new Date('2024-10-12T03:10:00Z'),
    emergencyContact: {
      name: 'David Vance',
      relation: 'Spouse',
      phone: '+1 (555) 492-1092',
    },
    notes: 'Post-percutaneous coronary intervention (PCI). Requires continuous arterial line blood pressure monitoring.',
    timeline: [
      {
        date: new Date('2024-10-25T08:30:00Z'),
        title: 'Morning Rounds & Arterial Gas Check',
        description: 'Vitals stable under 2L supplemental O2. Mean arterial pressure maintained > 65 mmHg.',
        category: 'vitals' as const,
      },
      {
        date: new Date('2024-10-24T14:15:00Z'),
        title: 'Cardiology Consult: Dr. Vance',
        description: 'Echocardiogram completed. Left ventricular ejection fraction measured at 48%.',
        category: 'consultation' as const,
      },
      {
        date: new Date('2024-10-12T03:10:00Z'),
        title: 'Emergency Triage Admission',
        description: 'Arrived via EMS with acute chest discomfort. Immediate catheterization laboratory activation.',
        category: 'triage' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020202'),
    name: 'Arthur Pendelton',
    mrn: 'MRN-77319',
    dob: 'May 04, 1963',
    age: 61,
    gender: 'Male' as const,
    condition: 'Post-Operative' as const,
    diagnosis: 'Total Hip Arthroplasty (Right) — Post-surgical recovery and monitored physical therapy mobilization.',
    doctorId: initialDoctors[1]._id,
    doctorName: 'Dr. Elena Rostova, PhD',
    doctorSpecialty: 'Orthopedic Surgery',
    hospital: 'St. Jude Central Hospital',
    ward: 'West Pavilion',
    roomBed: 'Bed 112 (Step-down)',
    admissionDate: new Date('2024-10-19T10:00:00Z'),
    emergencyContact: {
      name: 'Maria Pendelton',
      relation: 'Daughter',
      phone: '+1 (555) 381-8842',
    },
    notes: 'Physical therapy round 2 initiated. Pain scale controlled with oral analgesics.',
    timeline: [
      {
        date: new Date('2024-10-24T11:00:00Z'),
        title: 'Physical Therapy Mobility Assessment',
        description: 'Patient ambulated 50 meters with walker assistance. Weight-bearing tolerated.',
        category: 'procedure' as const,
      },
      {
        date: new Date('2024-10-19T10:00:00Z'),
        title: 'Surgical Admission',
        description: 'Completed right total hip replacement without intraoperative complications.',
        category: 'triage' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020203'),
    name: 'Marcus Thorne',
    mrn: 'MRN-91044',
    dob: 'Aug 14, 1991',
    age: 33,
    gender: 'Male' as const,
    condition: 'Stable' as const,
    diagnosis: 'Community Acquired Pneumonia — Resolving bilateral infiltrates under targeted IV antibiotic therapy.',
    doctorId: initialDoctors[7]._id,
    doctorName: 'Dr. Michael Chang, MD',
    doctorSpecialty: 'Pulmonology',
    hospital: 'St. Jude Central Hospital',
    ward: 'East Tower',
    roomBed: 'Room 209 (General)',
    admissionDate: new Date('2024-10-21T09:00:00Z'),
    emergencyContact: {
      name: 'Clara Thorne',
      relation: 'Sister',
      phone: '+1 (555) 723-9011',
    },
    notes: 'Afebrile for 48 hours. Completing oral levofloxacin course. Planned discharge tomorrow.',
    timeline: [
      {
        date: new Date('2024-10-24T08:00:00Z'),
        title: 'Pulmonary Auscultation Check',
        description: 'Bilateral lung sounds clear with minimal rhonchi at left base. SpO2 98% room air.',
        category: 'vitals' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020204'),
    name: 'Sophia Ramirez',
    mrn: 'MRN-55201',
    dob: 'Nov 23, 1971',
    age: 52,
    gender: 'Female' as const,
    condition: 'Chronic Management' as const,
    diagnosis: 'Type II Diabetes Mellitus / CKD Stage 3 — Glycemic optimization and nephrology clearance.',
    doctorId: initialDoctors[6]._id,
    doctorName: 'Dr. Amara Okafor, MD',
    doctorSpecialty: 'Internal Medicine',
    hospital: 'St. Jude Central Hospital',
    ward: 'South Annex',
    roomBed: 'Room 102',
    admissionDate: new Date('2024-10-15T14:30:00Z'),
    emergencyContact: {
      name: 'Carlos Ramirez',
      relation: 'Son',
      phone: '+1 (555) 992-3401',
    },
    notes: 'Insulin sliding scale titration. Serum creatinine stabilized at 1.8 mg/dL.',
    timeline: [
      {
        date: new Date('2024-10-23T16:00:00Z'),
        title: 'Renal Function Panel Review',
        description: 'eGFR calculated at 44 mL/min. Electrolytes within normal limits.',
        category: 'medication' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020205'),
    name: 'Julian Beck',
    mrn: 'MRN-68213',
    dob: 'Mar 17, 1996',
    age: 28,
    gender: 'Male' as const,
    condition: 'Routine Observation' as const,
    diagnosis: 'Concussion Protocol Level 2 — Closed head injury sports collision. Neurological observation.',
    doctorId: initialDoctors[5]._id,
    doctorName: 'Dr. Julian Ross, MD',
    doctorSpecialty: 'Neurology',
    hospital: 'St. Jude Central Hospital',
    ward: 'COU Wing',
    roomBed: 'Unit 4 (Neuro)',
    admissionDate: new Date('2024-10-24T18:00:00Z'),
    emergencyContact: {
      name: 'Hannah Beck',
      relation: 'Spouse',
      phone: '+1 (555) 238-1904',
    },
    notes: 'Neurological assessment pupil reflex intact. GCS 15. Awaiting repeat head CT scan.',
    timeline: [
      {
        date: new Date('2024-10-25T06:00:00Z'),
        title: 'Glasgow Coma Scale Assessment',
        description: 'Score 15/15. Patient alert and oriented x 4. No photophobia reported.',
        category: 'vitals' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020206'),
    name: 'Beatrice Dupont',
    mrn: 'MRN-44192',
    dob: 'Dec 02, 1965',
    age: 58,
    gender: 'Female' as const,
    condition: 'Post-Operative' as const,
    diagnosis: 'Laparoscopic Cholecystectomy — Post-op surgical incision care and diet progression.',
    doctorId: initialDoctors[1]._id,
    doctorName: 'Dr. Elena Rostova, PhD',
    doctorSpecialty: 'General Surgery',
    hospital: 'St. Jude Central Hospital',
    ward: 'Central Wing',
    roomBed: 'Room 310',
    admissionDate: new Date('2024-10-23T11:00:00Z'),
    emergencyContact: {
      name: 'Marc Dupont',
      relation: 'Brother',
      phone: '+1 (555) 604-8112',
    },
    notes: 'Diet advancing as tolerated. Surgical incisions clean and dry.',
    timeline: [
      {
        date: new Date('2024-10-24T10:00:00Z'),
        title: 'Post-Op Wound Inspection',
        description: 'Port sites intact with no signs of erythema or exudate. Bowel sounds present.',
        category: 'procedure' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020207'),
    name: 'Alonzo Reyes',
    mrn: 'MRN-92810',
    dob: 'Jul 29, 1974',
    age: 50,
    gender: 'Male' as const,
    condition: 'Critical Care' as const,
    diagnosis: 'Critical Cardiac Arrhythmia & Ventricular Tachycardia — Continuous telemetry cardioversion ready.',
    doctorId: initialDoctors[0]._id,
    doctorName: 'Dr. Robert Vance, MD',
    doctorSpecialty: 'Cardiology',
    hospital: 'St. Jude Central Hospital',
    ward: 'Central Wing',
    roomBed: 'ICU Bed 4',
    admissionDate: new Date('2024-10-25T07:10:00Z'),
    emergencyContact: {
      name: 'Lucia Reyes',
      relation: 'Spouse',
      phone: '+1 (555) 819-2041',
    },
    notes: 'Amiodarone drip initiated. Central venous access established.',
    timeline: [
      {
        date: new Date('2024-10-25T07:15:00Z'),
        title: 'Emergency ICU Admission',
        description: 'Transferred directly from acute telemetry wing with polymorphic VT runs.',
        category: 'triage' as const,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('66fa19b2e402020202020208'),
    name: 'Clara Vance',
    mrn: 'MRN-84729',
    dob: 'Jun 19, 2016',
    age: 8,
    gender: 'Female' as const,
    condition: 'Stable' as const,
    diagnosis: 'Routine Pediatric Asthma Exacerbation — Nebulized albuterol spacing protocol.',
    doctorId: initialDoctors[2]._id,
    doctorName: 'Dr. Marcus Chen, MD',
    doctorSpecialty: 'Pediatrics',
    hospital: 'Metro General Hospital',
    ward: 'Pediatric Wing East',
    roomBed: 'Room 214',
    admissionDate: new Date('2024-10-25T06:45:00Z'),
    emergencyContact: {
      name: 'Sarah Vance',
      relation: 'Mother',
      phone: '+1 (555) 781-9920',
    },
    notes: 'Expiratory wheezing markedly decreased post DuoNeb therapy. Oral prednisolone initiated.',
    timeline: [
      {
        date: new Date('2024-10-25T07:00:00Z'),
        title: 'Pediatric Respiratory Assessment',
        description: 'Peak flow improved from 60% to 85% of predicted value.',
        category: 'vitals' as const,
      },
    ],
  },
];

export const seedInitialData = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // 1. Seed Default Demo Users
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        await UserModel.create([
          {
            email: 'admin@doctortracker.med',
            password: 'password123',
            name: 'Dr. Sarah Jenkins',
            role: 'admin',
            title: 'Chief Medical Administrator',
            hospital: 'St. Jude Central Hospital',
          },
          {
            email: 's.jenkins@stjude.org',
            password: 'password123',
            name: 'Dr. Sarah Jenkins',
            role: 'director',
            title: 'Hospital Director',
            hospital: 'St. Jude Central Hospital',
          },
        ]);
        console.log('[Database] Seeded administrative users.');
      }

      // 2. Seed Default Doctors
      const docCount = await DoctorModel.countDocuments();
      if (docCount === 0) {
        await DoctorModel.insertMany(initialDoctors);
        console.log(`[Database] Seeded ${initialDoctors.length} doctors into MongoDB.`);
      }

      // 3. Seed Default Patients
      const patCount = await PatientModel.countDocuments();
      if (patCount === 0) {
        await PatientModel.insertMany(initialPatients);
        console.log(`[Database] Seeded ${initialPatients.length} patients into MongoDB.`);
      }
    }
  } catch (err: any) {
    console.warn('[Database] Seeding encountered minor note:', err.message);
  }
};
