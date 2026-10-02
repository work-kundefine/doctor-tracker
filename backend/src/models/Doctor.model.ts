import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  titlePrefix: string;
  specialization: string;
  subSpecialty?: string;
  hospital: string;
  suite?: string;
  phone: string;
  email: string;
  npi: string;
  maxCaseload: number;
  dutyStatus: 'on_duty' | 'on_call' | 'off_duty';
  avatarUrl?: string;
  patientCount?: number;
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      index: true,
    },
    titlePrefix: {
      type: String,
      default: 'Dr.',
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      index: true,
    },
    subSpecialty: {
      type: String,
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital is required'],
      trim: true,
      index: true,
    },
    suite: {
      type: String,
      trim: true,
      default: 'Suite 101, Main Wing',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    npi: {
      type: String,
      required: [true, 'NPI is required'],
      trim: true,
      unique: true,
      index: true,
    },
    maxCaseload: {
      type: Number,
      default: 35,
      min: 5,
      max: 80,
    },
    dutyStatus: {
      type: String,
      enum: ['on_duty', 'on_call', 'off_duty'],
      default: 'on_duty',
      index: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    joinedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populated patients count
DoctorSchema.virtual('patients', {
  ref: 'Patient',
  localField: '_id',
  foreignField: 'doctorId',
});

// Compound Index for high-performance hospital roster lookup
DoctorSchema.index({ npi: 1, hospital: 1 });
DoctorSchema.index({ specialization: 1, hospital: 1 });
DoctorSchema.index({ joinedDate: -1 });

// Full-text search index for high-speed search across doctor name, specialization, email, hospital
DoctorSchema.index({
  name: 'text',
  specialization: 'text',
  hospital: 'text',
  email: 'text',
  npi: 'text',
});

export const DoctorModel = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
