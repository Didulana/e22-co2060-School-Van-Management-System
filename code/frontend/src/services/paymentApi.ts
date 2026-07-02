import { API_BASE_URL } from "../config/api";
import { Payment, PaymentSettings } from "../types/payment";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getPaymentSettings = async (token: string): Promise<PaymentSettings> => {
  const res = await fetch(`${API_BASE_URL}/payments/driver/settings`, { headers: getHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

export const updatePaymentSettings = async (token: string, settings: PaymentSettings): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/payments/driver/settings`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
};

export const generateMonthlyPayments = async (token: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE_URL}/payments/driver/generate`, {
    method: "POST",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to generate payments");
  return res.json();
};

export const getDriverPayments = async (token: string): Promise<Payment[]> => {
  const res = await fetch(`${API_BASE_URL}/payments/driver/students`, { headers: getHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
};

export const verifyPayment = async (
  token: string,
  id: number,
  status: 'paid' | 'rejected',
  rejectReason?: string
): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/payments/driver/verify/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify({ status, reject_reason: rejectReason }),
  });
  if (!res.ok) throw new Error("Failed to verify payment");
};

export const getParentPayments = async (token: string): Promise<Payment[]> => {
  const res = await fetch(`${API_BASE_URL}/payments/parent/dues`, { headers: getHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch dues");
  return res.json();
};

export const uploadPaymentReceipt = async (
  token: string,
  id: number,
  receiptUrl: string,
  receiptRef: string
): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/payments/parent/upload/${id}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ receipt_url: receiptUrl, receipt_ref: receiptRef }),
  });
  if (!res.ok) throw new Error("Failed to upload receipt");
};
