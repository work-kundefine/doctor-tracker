import { Request, Response } from 'express';
import { doctorService } from '../services/doctor.service';

export class DoctorController {
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const result = await doctorService.getAllDoctors(req.query as any);
      res.status(200).json({
        success: true,
        message: 'Doctors retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve doctors',
      });
    }
  }

  async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Doctor not found',
      });
    }
  }

  async createDoctor(req: Request, res: Response): Promise<void> {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      res.status(201).json({
        success: true,
        message: 'Physician registered to active roster successfully',
        data: doctor,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to register doctor',
      });
    }
  }

  async updateDoctor(req: Request, res: Response): Promise<void> {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Doctor record updated successfully',
        data: doctor,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update doctor',
      });
    }
  }

  async deleteDoctor(req: Request, res: Response): Promise<void> {
    try {
      const result = await doctorService.deleteDoctor(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete doctor',
      });
    }
  }

  async getDoctorPatients(req: Request, res: Response): Promise<void> {
    try {
      const result = await doctorService.getDoctorPatients(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to retrieve corresponding patients',
      });
    }
  }

  async addPatientToDoctor(req: Request, res: Response): Promise<void> {
    try {
      const result = await doctorService.addPatientToDoctor(req.params.id, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to admit patient under doctor',
      });
    }
  }

  async deletePatientFromDoctor(req: Request, res: Response): Promise<void> {
    try {
      const result = await doctorService.deletePatientFromDoctor(
        req.params.id,
        req.params.patientId
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove patient from doctor',
      });
    }
  }
}

export const doctorController = new DoctorController();
