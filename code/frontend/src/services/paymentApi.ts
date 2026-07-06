import { API_BASE_URL, ensureApiConfigured } from "../config/api";
import { Payment, PaymentSettings } from "../types/payment";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

async function parseResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.details || data?.error || fallbackMessage);
  }
  return data as T;
}

export const getPaymentSettings = async (token: string): Promise<PaymentSettings> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/driver/settings`, { headers: getHeaders(token) });
  return parseResponse<PaymentSettings>(res, "Failed to fetch settings");
};

export const updatePaymentSettings = async (token: string, settings: PaymentSettings): Promise<void> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/driver/settings`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(settings),
  });
  await parseResponse<{ success: boolean }>(res, "Failed to update settings");
};

export const generateMonthlyPayments = async (token: string): Promise<{ message: string }> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/driver/generate`, {
    method: "POST",
    headers: getHeaders(token),
  });
  return parseResponse<{ message: string }>(res, "Failed to generate payments");
};

export const getDriverPayments = async (token: string): Promise<Payment[]> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/driver/students`, { headers: getHeaders(token) });
  return parseResponse<Payment[]>(res, "Failed to fetch payments");
};

export const verifyPayment = async (
  token: string,
  id: number,
  status: 'paid' | 'rejected',
  rejectReason?: string
): Promise<void> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/driver/verify/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify({ status, reject_reason: rejectReason }),
  });
  await parseResponse<{ success: boolean }>(res, "Failed to verify payment");
};

export const getParentPayments = async (token: string): Promise<Payment[]> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/parent/dues`, { headers: getHeaders(token) });
  return parseResponse<Payment[]>(res, "Failed to fetch dues");
};

export const uploadPaymentReceipt = async (
  token: string,
  id: number,
  receiptUrl: string,
  receiptRef: string
): Promise<void> => {
  ensureApiConfigured();
  const res = await fetch(`${API_BASE_URL}/payments/parent/upload/${id}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ receipt_url: receiptUrl, receipt_ref: receiptRef }),
  });
  await parseResponse<{ success: boolean }>(res, "Failed to upload receipt");
};
