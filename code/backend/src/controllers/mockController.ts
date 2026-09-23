import { Request, Response } from "express";
import * as parentModel from "../models/parentModel";
import { processLocationUpdate } from "../services/trackingService";
import db from "../config/db";

export async function startMockJourney(req: Request, res: Response) {
  try {
    const studentId = parseInt(req.params.id as string, 10);
    
    // 1. Get student and their route
    const student = await parentModel.getChildById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Find a route that contains the student's pickup stop
    const routes = await parentModel.getAvailableRoutes();
    const route = routes.find((r: any) => r.stops.some((s: any) => s.id === student.pickup_stop_id));
    if (!route) return res.status(404).json({ error: "No active route found for this student" });

    // 2. Create a Mock Journey
    const journeyRes = await db.query(
        "INSERT INTO journeys (route_id, driver_id, vehicle_id, status) VALUES ($1, $2, $3, $4) RETURNING id",
        [route.id, route.driver_id || 1, 1, 'started']
    );
    const journeyId = journeyRes.rows[0].id;

    // 3. Register student for this journey (boarding)
    await db.query(
        "INSERT INTO student_boarding (journey_id, student_id, driver_id) VALUES ($1, $2, $3)",
        [journeyId, studentId, route.driver_id || 1]
    );

    // 4. Fetch Road Path (OSRM)
    const coordsString = route.stops
        .sort((a: any, b: any) => a.order - b.order)
        .map((s: any) => `${s.longitude},${s.latitude}`)
        .join(";");

    const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
    const data: any = await osrmRes.json();
    
    if (!data.routes || !data.routes[0]) {
        return res.status(500).json({ error: "Could not calculate road path" });
    }

    const coords = data.routes[0].geometry.coordinates; // [lng, lat]
    
    // 5. Start async simulation (don't await)
    simulateMovement(journeyId, route.driver_id || 1, coords);

    res.json({ message: "Mock journey started", journeyId, totalPoints: coords.length });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to start mock journey", details: error.message });
  }
}

async function simulateMovement(journeyId: number, driverId: number, coords: [number, number][]) {
    console.log(`Starting mock simulation for journey ${journeyId} with ${coords.length} points`);
    
    for (let i = 0; i < coords.length; i++) {
        const [lng, lat] = coords[i];
        
        // Update every 2 seconds for a "fast" demo
        await processLocationUpdate({
            driverId,
            journeyId,
            lat,
            lng
        });
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if journey is still active (optional)
    }
    
    console.log(`Mock simulation for journey ${journeyId} completed.`);
}
