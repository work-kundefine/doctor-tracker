import mongoose from 'mongoose';
import { PatientModel, IPatient } from '../models/Patient.model';
import { DoctorModel } from '../models/Doctor.model';
import {
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientQueryDTO,
  BulkActionDTO,
} from '../dto/patient.dto';
import { memoryStore, removePatientFromMemory } from './doctor.service';

export class PatientService {
  async getAllPatients(query: PatientQueryDTO) {
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
            { mrn: { $regex: s, $options: 'i' } },
            { diagnosis: { $regex: s, $options: 'i' } },
            { ward: { $regex: s, $options: 'i' } },
            { roomBed: { $regex: s, $options: 'i' } },
            { doctorName: { $regex: s, $options: 'i' } },
          ];
        }

        if (query.condition && query.condition !== 'All') {
          filter.condition = query.condition;
        }

        if (query.doctorId && query.doctorId !== 'All') {
          filter.$or = [
            { doctorId: query.doctorId },
            { doctorName: { $regex: query.doctorId, $options: 'i' } },
          ];
        }

        if (query.hospital && query.hospital !== 'All') {
          filter.hospital = { $regex: query.hospital, $options: 'i' };
        }

        if (query.startDate || query.endDate) {
          filter.admissionDate = {};
          if (query.startDate) filter.admissionDate.$gte = new Date(query.startDate);
          if (query.endDate) filter.admissionDate.$lte = new Date(query.endDate);
        }

        const sortField = query.sortBy || 'admissionDate';
        const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

        const [patients, total] = await Promise.all([
          PatientModel.find(filter)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean(),
          PatientModel.countDocuments(filter),
        ]);

        return {
          data: patients.map((p: any) => ({ ...p, id: p._id.toString() })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            hasMore: skip + patients.length < total,
          },
        };
      } catch (err: any) {
        console.warn('[PatientService] MongoDB query warning, falling back to memory store:', err.message);
      }
    }

    let filtered = [...memoryStore.patients];

    if (query.search) {
      const s = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.mrn.toLowerCase().includes(s) ||
          p.diagnosis.toLowerCase().includes(s) ||
          p.ward.toLowerCase().includes(s) ||
          p.roomBed.toLowerCase().includes(s) ||
          (p.doctorName && p.doctorName.toLowerCase().includes(s))
      );
    }

    if (query.condition && query.condition !== 'All') {
      filtered = filtered.filter((p) => p.condition === query.condition);
    }

    if (query.doctorId && query.doctorId !== 'All') {
      const docQuery = query.doctorId.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.doctorId?.toString() || p.doctorId) === query.doctorId ||
          (p.doctorName && p.doctorName.toLowerCase().includes(docQuery))
      );
    }

    if (query.startDate) {
      const start = new Date(query.startDate).getTime();
      filtered = filtered.filter((p) => new Date(p.admissionDate).getTime() >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate).getTime();
      filtered = filtered.filter((p) => new Date(p.admissionDate).getTime() <= end);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      data: paginated.map((p) => ({
        ...p,
        id: (p._id?.toString() || p.id).toString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + paginated.length < total,
      },
    };
  }

  async getPatientById(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const patient = await PatientModel.findById(id).lean();
        if (patient) return { ...patient, id: patient._id.toString() };
      } catch (e) {}
    }

    const found = memoryStore.patients.find(
      (p) => (p._id?.toString() || p.id) === id || p.mrn === id
    );
    if (!found) throw new Error('Patient record not found in system');
    return { ...found, id: (found._id?.toString() || found.id).toString() };
  }

  async createPatient(dto: CreatePatientDTO) {
    let doctorName = 'Dr. Robert Vance, MD';
    let doctorSpecialty = 'Cardiology';

    const doctorMatch = memoryStore.doctors.find(
      (d) => (d._id?.toString() || d.id) === dto.doctorId || d.name.includes(dto.doctorId)
    );
    if (doctorMatch) {
      doctorName = doctorMatch.name;
      doctorSpecialty = doctorMatch.specialization;
    }

    const generatedMRN =
      dto.mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPatient = {
      name: dto.name,
      mrn: generatedMRN,
      dob: dto.dob,
      age: dto.age || 45,
      gender: dto.gender,
      condition: dto.condition,
      diagnosis: dto.diagnosis,
      doctorId: dto.doctorId,
      doctorName,
      doctorSpecialty,
      hospital: dto.hospital || 'St. Jude Central Hospital',
      ward: dto.ward,
      roomBed: dto.roomBed,
      admissionDate: dto.admissionDate ? new Date(dto.admissionDate) : new Date(),
      emergencyContact: dto.emergencyContact,
      notes: dto.notes || '',
      timeline: [
        {
          date: new Date(),
          title: 'Initial Admission & Triage',
          description: `Patient entered into Electronic Health Record under ${doctorName}.`,
          category: 'triage',
        },
      ],
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await PatientModel.create(newPatient);
        return { ...created.toObject(), id: created._id.toString() };
      } catch (e) {}
    }

    const memCreated = {
      _id: new mongoose.Types.ObjectId(),
      ...newPatient,
      id: new mongoose.Types.ObjectId().toString(),
    };
    memoryStore.patients.unshift(memCreated);
    return memCreated;
  }

  async updatePatient(id: string, dto: UpdatePatientDTO) {
    let updateFields: any = { ...dto };

    if (dto.doctorId) {
      const doc = memoryStore.doctors.find(
        (d) => (d._id?.toString() || d.id) === dto.doctorId || d.name.includes(dto.doctorId!)
      );
      if (doc) {
        updateFields.doctorName = doc.name;
        updateFields.doctorSpecialty = doc.specialization;
      }
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await PatientModel.findByIdAndUpdate(id, updateFields, {
          new: true,
          runValidators: true,
        }).lean();
        if (updated) return { ...updated, id: updated._id.toString() };
      } catch (e) {}
    }

    const idx = memoryStore.patients.findIndex((p) => (p._id?.toString() || p.id) === id);
    if (idx === -1) throw new Error('Patient record not found for update');

    memoryStore.patients[idx] = {
      ...memoryStore.patients[idx],
      ...updateFields,
    };
    return {
      ...memoryStore.patients[idx],
      id: (memoryStore.patients[idx]._id?.toString() || memoryStore.patients[idx].id).toString(),
    };
  }

  async deletePatient(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await PatientModel.findByIdAndDelete(id);
        return { success: true, message: 'Patient record successfully archived / discharged.' };
      } catch (e) {}
    }

    const removed = removePatientFromMemory(id);
    if (!removed) {
      throw new Error('Patient record not found');
    }

    return { success: true, message: 'Patient record successfully archived / discharged.' };
  }

  async handleBulkAction(dto: BulkActionDTO) {
    const { action, patientIds } = dto;

    if (action === 'flag_critical') {
      memoryStore.patients.forEach((p) => {
        const pId = (p._id?.toString() || p.id).toString();
        if (patientIds.includes(pId)) {
          p.condition = 'Critical Care';
        }
      });
      if (mongoose.connection.readyState === 1) {
        await PatientModel.updateMany(
          { _id: { $in: patientIds } },
          { $set: { condition: 'Critical Care' } }
        );
      }
      return { success: true, message: `Flagged ${patientIds.length} patient(s) as Critical Care.` };
    }

    if (action === 'reassign_doctor' && dto.newDoctorId) {
      const doc = memoryStore.doctors.find((d) => (d._id?.toString() || d.id) === dto.newDoctorId);
      const docName = doc ? doc.name : 'Dr. Robert Vance, MD';
      const docSpec = doc ? doc.specialization : 'Cardiology';

      memoryStore.patients.forEach((p) => {
        const pId = (p._id?.toString() || p.id).toString();
        if (patientIds.includes(pId)) {
          p.doctorId = dto.newDoctorId;
          p.doctorName = docName;
          p.doctorSpecialty = docSpec;
        }
      });

      if (mongoose.connection.readyState === 1) {
        await PatientModel.updateMany(
          { _id: { $in: patientIds } },
          {
            $set: {
              doctorId: dto.newDoctorId,
              doctorName: docName,
              doctorSpecialty: docSpec,
            },
          }
        );
      }
      return { success: true, message: `Reassigned ${patientIds.length} patient(s) to ${docName}.` };
    }

    if (action === 'transfer_ward' && dto.newWard) {
      memoryStore.patients.forEach((p) => {
        const pId = (p._id?.toString() || p.id).toString();
        if (patientIds.includes(pId)) {
          p.ward = dto.newWard!;
        }
      });
      if (mongoose.connection.readyState === 1) {
        await PatientModel.updateMany(
          { _id: { $in: patientIds } },
          { $set: { ward: dto.newWard } }
        );
      }
      return { success: true, message: `Transferred ${patientIds.length} patient(s) to ${dto.newWard}.` };
    }

    return { success: true, message: `Bulk action ${action} executed on ${patientIds.length} records.` };
  }
}

export const patientService = new PatientService();
