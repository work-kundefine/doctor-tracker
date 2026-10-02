import { Request, Response } from 'express';
import { patientService } from '../services/patient.service';

export class PatientController {
  async getAllPatients(req: Request, res: Response): Promise<void> {
    try {
      const result = await patientService.getAllPatients(req.query as any);
      res.status(200).json({
        success: true,
        message: 'Patients retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve patients',
      });
    }
  }

  async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Patient record not found',
      });
    }
  }

  async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.createPatient(req.body);
      res.status(201).json({
        success: true,
        message: 'Patient admitted successfully into ward',
        data: patient,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to admit patient',
      });
    }
  }

  async updatePatient(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Patient record successfully synchronized',
        data: patient,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update patient record',
      });
    }
  }

  async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      const result = await patientService.deletePatient(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to discharge patient',
      });
    }
  }

  async handleBulkAction(req: Request, res: Response): Promise<void> {
    try {
      const result = await patientService.handleBulkAction(req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to execute bulk action',
      });
    }
  }
}

export const patientController = new PatientController();
