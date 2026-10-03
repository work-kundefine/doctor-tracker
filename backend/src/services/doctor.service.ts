import mongoose from 'mongoose';
import { DoctorModel, IDoctor } from '../models/Doctor.model';
import { PatientModel, IPatient } from '../models/Patient.model';
import {
  CreateDoctorDTO,
  UpdateDoctorDTO,
  DoctorQueryDTO,
  AddDoctorPatientDTO,
} from '../dto/doctor.dto';
import { initialDoctors, initialPatients } from '../config/db';

export interface MemoryStore {
  doctors: any[];
  patients: any[];
}

export const memoryStore: MemoryStore = {
  doctors: [],
  patients: [],
};
export const memoryDoctors: any[] = memoryStore.doctors;
export const memoryPatients: any[] = memoryStore.patients;

export const removePatientFromMemory = (id: string): boolean => {
  const idx = memoryStore.patients.findIndex((p: any) => (p._id?.toString() || p.id) === id);
  if (idx !== -1) {
    memoryStore.patients.splice(idx, 1);
    return true;
  }
  return false;
};

export class DoctorService {
  async getAllDoctors(query: DoctorQueryDTO) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = {};

        if (query.search) {
          const s = query.search.trim();
          filter.$or = [
            { name: { $regex: s, $options: 'i' } },
            { email: { $regex: s, $options: 'i' } },
            { npi: { $regex: s, $options: 'i' } },
            { hospital: { $regex: s, $options: 'i' } },
            { specialization: { $regex: s, $options: 'i' } },
          ];
        }

        if (query.specialization && query.specialization !== 'All') {
          filter.specialization = { $regex: new RegExp(`^${query.specialization}$`, 'i') };
        }

        if (query.hospital && query.hospital !== 'All') {
          filter.hospital = { $regex: new RegExp(query.hospital, 'i') };
        }

        if (query.dutyStatus && query.dutyStatus !== 'All') {
          filter.dutyStatus = query.dutyStatus;
        }

        if (query.startDate || query.endDate) {
          filter.joinedDate = {};
          if (query.startDate) filter.joinedDate.$gte = new Date(query.startDate);
          if (query.endDate) filter.joinedDate.$lte = new Date(query.endDate);
        }

        const sortField = query.sortBy || 'joinedDate';
        const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

        const [doctors, total] = await Promise.all([
          DoctorModel.find(filter)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean(),
          DoctorModel.countDocuments(filter),
        ]);

        const doctorIds = doctors.map((d: any) => d._id);
        const counts = await PatientModel.aggregate([
          { $match: { doctorId: { $in: doctorIds } } },
          { $group: { _id: '$doctorId', count: { $sum: 1 } } },
        ]);

        const countMap = new Map<string, number>();
        counts.forEach((c: any) => countMap.set(c._id.toString(), c.count));

        const enrichedDoctors = doctors.map((doc: any) => ({
          ...doc,
          id: doc._id.toString(),
          patientCount: countMap.get(doc._id.toString()) || 0,
        }));

        return {
          data: enrichedDoctors,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            hasMore: skip + doctors.length < total,
          },
        };
      } catch (err: any) {
        console.warn('[DoctorService] Mongoose error, falling back to memory store:', err.message);
      }
    }

    let filtered = [...memoryStore.doctors];

    if (query.search) {
      const s = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.email.toLowerCase().includes(s) ||
          d.npi.toLowerCase().includes(s) ||
          d.hospital.toLowerCase().includes(s) ||
          d.specialization.toLowerCase().includes(s)
      );
    }

    if (query.specialization && query.specialization !== 'All') {
      filtered = filtered.filter(
        (d) => d.specialization.toLowerCase() === query.specialization?.toLowerCase()
      );
    }

    if (query.hospital && query.hospital !== 'All') {
      filtered = filtered.filter((d) =>
        d.hospital.toLowerCase().includes(query.hospital!.toLowerCase())
      );
    }

    if (query.dutyStatus && query.dutyStatus !== 'All') {
      filtered = filtered.filter((d) => d.dutyStatus === query.dutyStatus);
    }

    if (query.startDate) {
      const start = new Date(query.startDate).getTime();
      filtered = filtered.filter((d) => new Date(d.joinedDate).getTime() >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate).getTime();
      filtered = filtered.filter((d) => new Date(d.joinedDate).getTime() <= end);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const enriched = paginated.map((doc) => {
      const docIdStr = (doc._id?.toString() || doc.id).toString();
      const ptCount = memoryStore.patients.filter(
        (p) => (p.doctorId?.toString() || p.doctorId) === docIdStr
      ).length;
      return {
        ...doc,
        id: docIdStr,
        patientCount: ptCount,
      };
    });

    return {
      data: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + paginated.length < total,
      },
    };
  }

  async getDoctorById(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await DoctorModel.findById(id).lean();
        if (doc) {
          const ptCount = await PatientModel.countDocuments({ doctorId: doc._id });
          return { ...doc, id: doc._id.toString(), patientCount: ptCount };
        }
      } catch (e) {}
    }

    const found = memoryStore.doctors.find(
      (d) => (d._id?.toString() || d.id) === id || d.npi === id
    );
    if (!found) {
      throw new Error('Doctor not found in registry');
    }
    const docIdStr = (found._id?.toString() || found.id).toString();
    const ptCount = memoryStore.patients.filter(
      (p) => (p.doctorId?.toString() || p.doctorId) === docIdStr
    ).length;
    return { ...found, id: docIdStr, patientCount: ptCount };
  }

  async createDoctor(dto: CreateDoctorDTO) {
    if (mongoose.connection.readyState === 1) {
      const existing = await DoctorModel.findOne({
        $or: [{ email: dto.email.toLowerCase() }, { npi: dto.npi }],
      });
      if (existing) {
        throw new Error('A doctor with this email or NPI already exists in roster.');
      }

      const created = await DoctorModel.create({
        ...dto,
        email: dto.email.toLowerCase(),
        joinedDate: new Date(),
        avatarUrl:
          dto.avatarUrl ||
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      });
      return { ...created.toObject(), id: created._id.toString(), patientCount: 0 };
    }

    const existingMem = memoryStore.doctors.find(
      (d) => d.email.toLowerCase() === dto.email.toLowerCase() || d.npi === dto.npi
    );
    if (existingMem) {
      throw new Error('A doctor with this email or NPI already exists in roster.');
    }

    const newDoc = {
      _id: new mongoose.Types.ObjectId(),
      ...dto,
      email: dto.email.toLowerCase(),
      joinedDate: new Date(),
      avatarUrl:
        dto.avatarUrl ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      maxCaseload: dto.maxCaseload || 35,
      dutyStatus: dto.dutyStatus || 'on_duty',
      titlePrefix: dto.titlePrefix || 'Dr.',
    };
    memoryStore.doctors.unshift(newDoc);
    return { ...newDoc, id: newDoc._id.toString(), patientCount: 0 };
  }

  async updateDoctor(id: string, dto: UpdateDoctorDTO) {
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await DoctorModel.findByIdAndUpdate(id, dto, {
          new: true,
          runValidators: true,
        }).lean();
        if (updated) {
          const ptCount = await PatientModel.countDocuments({ doctorId: updated._id });
          return { ...updated, id: updated._id.toString(), patientCount: ptCount };
        }
      } catch (e) {}
    }

    const idx = memoryStore.doctors.findIndex((d) => (d._id?.toString() || d.id) === id);
    if (idx === -1) throw new Error('Doctor not found in registry');

    memoryStore.doctors[idx] = { ...memoryStore.doctors[idx], ...dto };
    const docIdStr = (memoryStore.doctors[idx]._id?.toString() || memoryStore.doctors[idx].id).toString();
    const ptCount = memoryStore.patients.filter(
      (p) => (p.doctorId?.toString() || p.doctorId) === docIdStr
    ).length;
    return { ...memoryStore.doctors[idx], id: docIdStr, patientCount: ptCount };
  }

  async deleteDoctor(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await DoctorModel.findByIdAndDelete(id);
        await PatientModel.deleteMany({ doctorId: id });
        return { success: true, message: 'Doctor and related admissions unassigned.' };
      } catch (e) {}
    }

    const before = memoryStore.doctors.length;
    memoryStore.doctors = memoryStore.doctors.filter((d) => (d._id?.toString() || d.id) !== id);
    memoryStore.patients = memoryStore.patients.filter(
      (p) => (p.doctorId?.toString() || p.doctorId) !== id
    );

    if (memoryStore.doctors.length === before) {
      throw new Error('Doctor not found in registry');
    }

    return { success: true, message: 'Doctor and related admissions unassigned.' };
  }

  async getDoctorPatients(doctorId: string) {
    const doctor = await this.getDoctorById(doctorId);

    if (mongoose.connection.readyState === 1) {
      try {
        const patients = await PatientModel.find({ doctorId: doctor.id || doctor._id })
          .sort({ admissionDate: -1 })
          .lean();
        return {
          doctor,
          patients: patients.map((p: any) => ({ ...p, id: p._id.toString() })),
          count: patients.length,
        };
      } catch (e) {}
    }

    const docIdStr = (doctor.id || doctor._id).toString();
    const patients = memoryStore.patients
      .filter((p) => (p.doctorId?.toString() || p.doctorId) === docIdStr)
      .map((p) => ({ ...p, id: (p._id?.toString() || p.id).toString() }));

    return {
      doctor,
      patients,
      count: patients.length,
    };
  }

  async addPatientToDoctor(doctorId: string, dto: AddDoctorPatientDTO) {
    const doctor = await this.getDoctorById(doctorId);

    const generatedMRN =
      dto.mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}-${doctor.specialization.substring(0, 2).toUpperCase()}`;

    let calculatedAge = dto.age;
    if (!calculatedAge && dto.dob) {
      const birthYear = new Date(dto.dob).getFullYear();
      if (!isNaN(birthYear)) {
        calculatedAge = Math.max(1, new Date().getFullYear() - birthYear);
      } else {
        calculatedAge = 45;
      }
    }

    const newPatientData = {
      name: dto.name,
      mrn: generatedMRN,
      dob: dto.dob,
      age: calculatedAge || 42,
      gender: dto.gender,
      condition: dto.condition,
      diagnosis: dto.diagnosis,
      doctorId: doctor.id || doctor._id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialization,
      hospital: dto.hospital || doctor.hospital,
      ward: dto.ward,
      roomBed: dto.roomBed,
      admissionDate: dto.admissionDate ? new Date(dto.admissionDate) : new Date(),
      emergencyContact: dto.emergencyContact,
      notes: dto.notes || '',
      timeline: [
        {
          date: new Date(),
          title: 'Direct Physician Admission',
          description: `Patient admitted directly under clinical oversight of ${doctor.name} (${doctor.specialization}).`,
          category: 'triage',
        },
      ],
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await PatientModel.create(newPatientData);
        return {
          success: true,
          patient: { ...created.toObject(), id: created._id.toString() },
          message: `Patient ${dto.name} admitted successfully under ${doctor.name}.`,
        };
      } catch (err: any) {
        console.warn('MongoDB direct assign error, using memory:', err.message);
      }
    }

    const memPatient = {
      _id: new mongoose.Types.ObjectId(),
      ...newPatientData,
      id: new mongoose.Types.ObjectId().toString(),
    };
    memoryStore.patients.unshift(memPatient);

    return {
      success: true,
      patient: memPatient,
      message: `Patient ${dto.name} admitted successfully under ${doctor.name}.`,
    };
  }

  async deletePatientFromDoctor(doctorId: string, patientId: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await PatientModel.findOneAndDelete({
          _id: patientId,
          doctorId: doctorId,
        });
        if (deleted) {
          return { success: true, message: 'Patient removed from doctor roster.' };
        }
      } catch (e) {}
    }

    const initialLen = memoryStore.patients.length;
    memoryStore.patients = memoryStore.patients.filter((p) => {
      const pId = (p._id?.toString() || p.id).toString();
      const pDocId = (p.doctorId?.toString() || p.doctorId).toString();
      return !(pId === patientId && pDocId === doctorId);
    });

    if (memoryStore.patients.length === initialLen) {
      throw new Error('Patient record not found under specified doctor.');
    }

    return { success: true, message: 'Patient removed from doctor roster.' };
  }
}

export const doctorService = new DoctorService();
