import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Pipeline: Route -> Controller -> Service
router.get('/overview', authenticateJWT, (req, res) =>
  analyticsController.getOverview(req, res)
);

router.get('/trends', authenticateJWT, (req, res) =>
  analyticsController.getTrends(req, res)
);

router.get('/specialties', authenticateJWT, (req, res) =>
  analyticsController.getSpecialties(req, res)
);

router.get('/workload', authenticateJWT, (req, res) =>
  analyticsController.getWorkload(req, res)
);

router.get('/recent', authenticateJWT, (req, res) =>
  analyticsController.getRecentAdmissions(req, res)
);

export default router;
