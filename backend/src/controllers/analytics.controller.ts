import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getOverviewMetrics();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate overview analytics',
      });
    }
  }

  async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const range = (req.query.range as any) || '30D';
      const data = await analyticsService.getIntakeTrends(range);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate trends',
      });
    }
  }

  async getSpecialties(req: Request, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getSpecialtyBreakdown();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve specialties breakdown',
      });
    }
  }

  async getWorkload(req: Request, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getWorkloadAndCapacity();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve workload metrics',
      });
    }
  }

  async getRecentAdmissions(req: Request, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getRecentAdmissions();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve recent admissions stream',
      });
    }
  }
}

export const analyticsController = new AnalyticsController();
