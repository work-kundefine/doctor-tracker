import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
  addDoctorPatientSchema,
} from '../validators/doctor.validator';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Pipeline: Route -> Validate Request -> Controller -> DTO -> Service
router.get(
  '/',
  authenticateJWT,
  validateRequest({ query: doctorQuerySchema }),
  (req, res) => doctorController.getAllDoctors(req, res)
);

router.get('/:id', authenticateJWT, (req, res) =>
  doctorController.getDoctorById(req, res)
);

router.post(
  '/',
  authenticateJWT,
  validateRequest({ body: createDoctorSchema }),
  (req, res) => doctorController.createDoctor(req, res)
);

router.put(
  '/:id',
  authenticateJWT,
  validateRequest({ body: updateDoctorSchema }),
  (req, res) => doctorController.updateDoctor(req, res)
);

router.delete('/:id', authenticateJWT, (req, res) =>
  doctorController.deleteDoctor(req, res)
);

// Corresponding patients routes for a specific doctor
router.get('/:id/patients', authenticateJWT, (req, res) =>
  doctorController.getDoctorPatients(req, res)
);

router.post(
  '/:id/patients',
  authenticateJWT,
  validateRequest({ body: addDoctorPatientSchema }),
  (req, res) => doctorController.addPatientToDoctor(req, res)
);

router.delete('/:id/patients/:patientId', authenticateJWT, (req, res) =>
  doctorController.deletePatientFromDoctor(req, res)
);

export default router;
