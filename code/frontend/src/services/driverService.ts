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

export interface PredefinedStop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface OnboardingStatus {
  completed: boolean;
  step?: number;
  driverId?: number;
}

// ---- Journey lifecycle ----

export async function startJourney(driverId: number, routeId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/start`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ driver_id: driverId, route_id: routeId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to start journey");
  return data;
}

export async function boardStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`http://localhost:5001/api/boarding`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ journeyId, studentId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to board student");
  }
}

export async function arriveAtSchool(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/arrive-school`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
}

export async function startReturn(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/start-return`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
}

export async function dropStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`http://localhost:5001/api/dropoff`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ journeyId, studentId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to drop student");
  }
}

export async function completeJourney(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/complete`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to complete journey");
  return data;
}

export async function getActiveJourney(driverId: number): Promise<{
  active: boolean;
  journey: Journey | null;
  students?: StudentStatus[];
}> {
  const res = await fetch(`${API_BASE}/journey/active?driver_id=${driverId}`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  return await res.json().catch(() => ({ active: false, journey: null }));
}

export async function getJourneyHistory(driverId: number): Promise<Journey[]> {
  const res = await fetch(`${API_BASE}/journey/history?driver_id=${driverId}`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  return await res.json().catch(() => []);
}

export async function getJourneyStudents(journeyId: number): Promise<StudentStatus[]> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/students`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  return await res.json().catch(() => []);
}

export async function getAttendance(driverId: number): Promise<AttendanceRecord[]> {
  const res = await fetch(`${API_BASE}/journey/attendance?driver_id=${driverId}`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  return await res.json().catch(() => []);
}

// ---- Announcements ----

export async function sendAnnouncement(
  driverId: number,
  message: string
): Promise<{ message: string; recipientCount: number }> {
  const res = await fetch(`${API_BASE}/announce`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ driver_id: driverId, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to send announcement");
  return data;
}

// ---- Onboarding ----

const getAuthToken = () => {
    const session = JSON.parse(localStorage.getItem("school-van-auth-session") || "{}");
    return session.token;
};

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const res = await fetch(`${API_BASE}/onboarding/status`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch onboarding status");
  }
  return data;
}

export async function getPredefinedStops(): Promise<PredefinedStop[]> {
  const res = await fetch(`${API_BASE}/onboarding/stops`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch stops");
  }
  return data;
}

export async function submitOnboarding(data: any): Promise<void> {
  const res = await fetch(`${API_BASE}/onboarding/submit`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}` 
    },
    body: JSON.stringify(data),
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(resData.error || "Failed to submit onboarding");
  }
}
