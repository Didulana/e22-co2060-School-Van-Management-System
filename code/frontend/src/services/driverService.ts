const API_BASE = "http://localhost:5001/api/driver";

export interface Journey {
  id: number;
  driver_id: number;
  route_id: number;
  route_name: string;
  status: string;
  started_at: string;
  completed_at: string | null;
}

export interface StudentStatus {
  student_id: number;
  student_name: string;
  boarded_at: string | null;
  dropped_at: string | null;
}

export interface AttendanceRecord {
  journey_id: number;
  started_at: string;
  completed_at: string | null;
  status: string;
  route_name: string;
  boarded_count: number;
  dropped_count: number;
}

// ---- Journey lifecycle ----

export async function startJourney(driverId: number, routeId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ driver_id: driverId, route_id: routeId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start journey");
  return data;
}

export async function boardStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/board/${studentId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to board student");
  }
}

export async function arriveAtSchool(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/arrive-school`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
}

export async function startReturn(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/start-return`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
}

export async function dropStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/drop/${studentId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to drop student");
  }
}

export async function completeJourney(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/complete`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to complete journey");
  return data;
}

// ---- Query endpoints ----

export async function getActiveJourney(driverId: number): Promise<{
  active: boolean;
  journey: Journey | null;
  students?: StudentStatus[];
}> {
  const res = await fetch(`${API_BASE}/journey/active?driver_id=${driverId}`);
  return await res.json();
}

export async function getJourneyHistory(driverId: number): Promise<Journey[]> {
  const res = await fetch(`${API_BASE}/journey/history?driver_id=${driverId}`);
  return await res.json();
}

export async function getJourneyStudents(journeyId: number): Promise<StudentStatus[]> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/students`);
  return await res.json();
}

export async function getAttendance(driverId: number): Promise<AttendanceRecord[]> {
  const res = await fetch(`${API_BASE}/journey/attendance?driver_id=${driverId}`);
  return await res.json();
}

// ---- Announcements ----

export async function sendAnnouncement(
  driverId: number,
  message: string
): Promise<{ message: string; recipientCount: number }> {
  const res = await fetch(`${API_BASE}/announce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ driver_id: driverId, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send announcement");
  return data;
}
