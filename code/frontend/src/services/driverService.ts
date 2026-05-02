const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001") + "/api/driver";

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

// ---- Auth Helper ----

export const getAuthToken = () => {
    const session = JSON.parse(localStorage.getItem("school-van-auth-session") || "{}");
    return session.token;
};

// ---- Journey lifecycle ----

export async function getActiveJourney(driverId: number): Promise<{
  active: boolean;
  journey: Journey | null;
  students: StudentStatus[];
}> {
  const res = await fetch(`${API_BASE}/journey/active?driver_id=${driverId}`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to retrieve active journey manifest.");
  }

  return await res.json();
}

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
  if (!res.ok) throw new Error(data.error || "Ignition failure: Unable to initiate route.");
  return data;
}

export async function boardStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/boarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ journeyId, studentId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Protocol failure: Student boarding not recorded.");
  }
}

export async function dropStudent(journeyId: number, studentId: number): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/dropoff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ journeyId, studentId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Protocol failure: Student drop-off not recorded.");
  }
}

export async function arriveAtSchool(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/arrive-school`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Link failure: School arrival sequence failed.");
  return data;
}

export async function startReturn(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/start-return`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Route shift failure: Afternoon trip initiation failed.");
  return data;
}

export async function completeJourney(journeyId: number): Promise<Journey> {
  const res = await fetch(`${API_BASE}/journey/${journeyId}/complete`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Shutdown failure: Unable to complete mission sequence.");
  return data;
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

export async function triggerSOS(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/sos`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Emergency protocol failure: Unable to broadcast SOS.");
  }

  return await res.json();
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

// ---- Tracking ----

export async function updateDriverLocation(journeyId: number, lat: number, lng: number): Promise<void> {
  // Use absolute URL to match other endpoints
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/tracking/location`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}` 
    },
    body: JSON.stringify({ journeyId, lat, lng }),
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Failed to broadcast location:", resData.error);
  }
}
