import { Request, Response } from "express";
import * as routeService from "../services/route.service";

/**
 * POST /api/routes
 */
export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = await routeService.createRoute(req.body);
    return res.status(201).json(route);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/routes
 * Optional: /api/routes?driver_id=1
 */
export const getRoutes = async (req: Request, res: Response) => {
  try {
    const driverId = req.query.driver_id ? parseInt(req.query.driver_id as string, 10) : undefined;
    const routes = await routeService.getRoutes(driverId);
    return res.status(200).json(routes);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
