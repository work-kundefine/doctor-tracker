import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema,
  bulkActionSchema,
} from '../validators/patient.validator';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Pipeline: Route -> Validate Request -> Controller -> DTO -> Service
router.get(
  '/',
  authenticateJWT,
  validateRequest({ query: patientQuerySchema }),
  (req, res) => patientController.getAllPatients(req, res)
);

router.get('/:id', authenticateJWT, (req, res) =>
  patientController.getPatientById(req, res)
);

router.post(
  '/',
  authenticateJWT,
  validateRequest({ body: createPatientSchema }),
  (req, res) => patientController.createPatient(req, res)
);

router.put(
  '/:id',
  authenticateJWT,
  validateRequest({ body: updatePatientSchema }),
  (req, res) => patientController.updatePatient(req, res)
);

router.delete('/:id', authenticateJWT, (req, res) =>
  patientController.deletePatient(req, res)
);

router.post(
  '/bulk',
  authenticateJWT,
  validateRequest({ body: bulkActionSchema }),
  (req, res) => patientController.handleBulkAction(req, res)
);

export default router;
