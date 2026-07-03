export interface PaymentSettings {
  mode: 'fixed' | 'dynamic';
  fixed_amount: number;
  base_charge: number;
  charge_per_km: number;
  due_date_day: number;
}

export interface Payment {
  id: number;
  student_id: number;
  driver_id: number;
  month: string;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'receipt_submitted' | 'rejected';
  receipt_url?: string;
  receipt_ref?: string;
  reject_reason?: string;
  approved_at?: string;
  created_at: string;
  student_name?: string;
  parent_name?: string;
  distance?: number;
}
