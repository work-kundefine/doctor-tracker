import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Pipeline: Route -> Validate Request (Zod) -> Controller -> Service
router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  (req, res) => authController.login(req, res)
);

router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  (req, res) => authController.register(req, res)
);

router.get('/me', authenticateJWT, (req, res) => authController.getMe(req, res));

export default router;
