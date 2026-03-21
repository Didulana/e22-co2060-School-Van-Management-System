import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/parent";

const getAuthHeader = () => {
    const sessionStr = window.localStorage.getItem("school-van-auth-session");
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            return { Authorization: `Bearer ${session.token}` };
        } catch (e) {
            return {};
        }
    }
    return {};
};

export interface Stop {
    id: number;
    name: string;
    order: number;
    latitude: number;
    longitude: number;
}

export interface Route {
    id: number;
    name: string;
    driver_name: string;
    driver_phone: string;
    stops: Stop[];
}

export interface Child {
    id: number;
    name: string;
    school: string;
    pickup_stop_id: number;
    dropoff_stop_id: number;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_lat?: number;
    dropoff_lng?: number;
    status: string;
    current_status?: string;
}

export interface JourneyHistoryItem {
    event_id: number;
    type: "boarding" | "dropoff";
    event_time: string;
    student_name: string;
    journey_id: number;
    route_name: string;
}

export interface EmergencyContact {
    driver_name: string;
    driver_phone: string;
    route_name: string;
    student_name: string;
}

export const getChildren = async (): Promise<Child[]> => {
    const response = await axios.get(`${API_BASE_URL}/children`, { headers: getAuthHeader() });
    return response.data;
};

export const registerChild = async (childData: Partial<Child>): Promise<Child> => {
    const response = await axios.post(`${API_BASE_URL}/children`, childData, { headers: getAuthHeader() });
    return response.data;
};

export const updateChild = async (id: number, childData: Partial<Child>): Promise<Child> => {
    const response = await axios.put(`${API_BASE_URL}/children/${id}`, childData, { headers: getAuthHeader() });
    return response.data;
};

export const markAbsent = async (id: number, date: string, reason?: string) => {
    const response = await axios.post(`${API_BASE_URL}/children/${id}/absent`, { date, reason }, { headers: getAuthHeader() });
    return response.data;
};

export const getJourneyHistory = async (): Promise<JourneyHistoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/journey-history`, { headers: getAuthHeader() });
    return response.data;
};

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    const response = await axios.get(`${API_BASE_URL}/emergency-contacts`, { headers: getAuthHeader() });
    return response.data;
};

export const getChildStatus = async (studentId: number) => {
    const response = await axios.get(`${API_BASE_URL}/children/${studentId}/status`, { headers: getAuthHeader() });
    return response.data;
};

export const markNotificationAsRead = async (notificationId: number) => {
    const response = await axios.patch(`http://localhost:5001/api/notifications/${notificationId}/read`, {}, { headers: getAuthHeader() });
    return response.data;
};

export const getAvailableRoutes = async (): Promise<Route[]> => {
    const response = await axios.get(`${API_BASE_URL}/available-routes`, { headers: getAuthHeader() });
    return response.data;
};
