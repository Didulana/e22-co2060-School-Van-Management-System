import { Request, Response } from 'express';
import * as adminService from '../services/adminService';

export async function getAdminSummary(req: Request, res: Response): Promise<void> {
  try {
    const summary = await adminService.getAdminSummary();
    res.status(200).json(summary);
  } catch (error) {
    console.error('Admin summary error:', error);
    res.status(500).json({
      message: 'Failed to fetch admin summary'
    });
  }
}
