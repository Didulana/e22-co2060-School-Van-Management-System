const API_BASE_URL = "http://localhost:5001/api";

export async function getJourneyStatus(journeyId: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/journey/${journeyId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch journey status");
  }

  return response.json();
}

export async function getJourneyTimeline(journeyId: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/journey/${journeyId}/timeline`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch journey timeline");
  }

  return response.json();
}

export async function getNotifications(journeyId: number, token: string) {
  const response = await fetch(
    `${API_BASE_URL}/notifications?journeyId=${journeyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function getUnreadNotificationCount(journeyId: number, token: string) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/unread-count?journeyId=${journeyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch unread notification count");
  }

  return response.json();
}

export async function markNotificationAsRead(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}