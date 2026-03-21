import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as parentModel from "../models/parentModel";

export async function getChildren(req: AuthenticatedRequest, res: Response) {
  try {
    const parentId = req.user!.id;
    const children = await parentModel.getChildrenByParentId(parentId);
    
    // Add current status to each child (placeholder for now, could be fetched from journeys)
    const childrenWithStatus = await Promise.all(children.map(async (child) => {
      const boarding = await parentModel.getLatestBoardingForStudent(child.id);
      const dropoff = await parentModel.getLatestDropoffForStudent(child.id);
      
      let status = "at_home";
      if (boarding && (!dropoff || boarding.boarded_at > dropoff.dropped_at)) {
        status = "en_route";
      } else if (dropoff) {
        status = "dropped_off";
      }

      return { ...child, current_status: status };
    }));

    res.json(childrenWithStatus);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch children", details: error.message });
  }
}

export async function registerChild(req: AuthenticatedRequest, res: Response) {
  try {
    const parentId = req.user!.id;
    const { name, school, pickup_stop_id, dropoff_stop_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Child name is required" });
    }

    const child = await parentModel.createChild(parentId, name, school, pickup_stop_id, dropoff_stop_id);
    res.status(201).json(child);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to register child", details: error.message });
  }
}

export async function updateChild(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = parseInt(req.params.id as string, 10);
    const { name, school, pickup_stop_id, dropoff_stop_id } = req.body;

    // Verify parent owns this child
    const parentId = req.user!.id;
    const children = await parentModel.getChildrenByParentId(parentId);
    if (!children.find(c => c.id === studentId)) {
      return res.status(403).json({ error: "Forbidden: Not your child" });
    }

    const updated = await parentModel.updateChild(studentId, name, school, pickup_stop_id, dropoff_stop_id);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update child", details: error.message });
  }
}

export async function markAbsent(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = parseInt(req.params.id as string, 10);
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const parentId = req.user!.id;
    const children = await parentModel.getChildrenByParentId(parentId);
    if (!children.find(c => c.id === studentId)) {
      return res.status(403).json({ error: "Forbidden: Not your child" });
    }

    const absence = await parentModel.markChildAbsent(studentId, date, reason);
    res.status(201).json(absence);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to mark absent", details: error.message });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const parentId = req.user!.id;
    const history = await parentModel.getJourneyHistory(parentId);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch history", details: error.message });
  }
}

export async function getEmergencyContacts(req: AuthenticatedRequest, res: Response) {
  try {
    const parentId = req.user!.id;
    const contacts = await parentModel.getEmergencyContacts(parentId);
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch emergency contacts", details: error.message });
  }
}

export async function getAvailableRoutes(req: AuthenticatedRequest, res: Response) {
  try {
    const routes = await parentModel.getAvailableRoutes();
    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch available routes", details: error.message });
  }
}