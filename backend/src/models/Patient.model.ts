import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITimelineEvent {
  date: Date;
  title: string;
  description: string;
  author?: string;
  category?: 'triage' | 'consultation' | 'medication' | 'vitals' | 'procedure';
}

export interface IPatient extends Document {
  name: string;
  mrn: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: 'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation';
  diagnosis: string;
  doctorId: Types.ObjectId;
  doctorName: string;
  doctorSpecialty: string;
  hospital: string;
  ward: string;
  roomBed: string;
  admissionDate: Date;
  dischargeDate?: Date;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  notes?: string;
  timeline: ITimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String },
    category: {
      type: String,
      enum: ['triage', 'consultation', 'medication', 'vitals', 'procedure'],
      default: 'consultation',
    },
  },
  { _id: false }
);

const PatientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      index: true,
    },
    mrn: {
      type: String,
      required: [true, 'Medical Record Number (MRN) is required'],
      unique: true,
      trim: true,
      index: true,
    },
    dob: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 130,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['Critical Care', 'Post-Operative', 'Chronic Management', 'Stable', 'Routine Observation'],
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Assigned Doctor is required'],
      index: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorSpecialty: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
      default: 'St. Jude Central Campus',
      index: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
    },
    roomBed: {
      type: String,
      required: true,
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    dischargeDate: {
      type: Date,
    },
    emergencyContact: {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
    },
    notes: {
      type: String,
      default: '',
    },
    timeline: {
      type: [TimelineEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for queries, filtering, and reporting
PatientSchema.index({ doctorId: 1, admissionDate: -1 });
PatientSchema.index({ condition: 1, admissionDate: -1 });
PatientSchema.index({ hospital: 1, admissionDate: -1 });
PatientSchema.index({ admissionDate: -1 });

// Full text index for multi-field search (Patient name, MRN, diagnosis, ward, notes)
PatientSchema.index({
  name: 'text',
  mrn: 'text',
  diagnosis: 'text',
  ward: 'text',
  notes: 'text',
});

export const PatientModel = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
