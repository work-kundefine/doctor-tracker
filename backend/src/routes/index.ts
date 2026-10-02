import { Router } from 'express';
import authRoutes from './auth.routes';
import doctorRoutes from './doctor.routes';
import patientRoutes from './patient.routes';
import analyticsRoutes from './analytics.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/analytics', analyticsRoutes);

// Base health & cluster ping
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Doctor Tracker Clinical Intelligence API',
    cluster: 'US-East-Primary',
    telemetry: 'Active',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
