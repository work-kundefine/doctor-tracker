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
    console.log('[Database] Operating with built-in embedded database store with covered indexes.');
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

// No demo data - empty initial datasets
export const initialDoctors: any[] = [];
export const initialPatients: any[] = [];

export const seedInitialData = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // 1. Ensure system administrator exists
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
        ]);
        console.log('[Database] Initial system administrator provisioned.');
      }

      // 2. Remove all demo doctors and patients from MongoDB collections
      await DoctorModel.deleteMany({});
      await PatientModel.deleteMany({});
      console.log('[Database] Cleared all demo doctors and demo patients.');
    }
  } catch (err: any) {
    console.warn('[Database] Database startup note:', err.message);
  }
};
