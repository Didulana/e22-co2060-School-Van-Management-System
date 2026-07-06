export interface PaymentSettings {
  id?: number;
  driver_id: number;
  mode: 'fixed' | 'dynamic';
  fixed_amount: number;
  base_charge: number;
  charge_per_km: number;
  due_date_day: number;
  updated_at?: Date;
}

export interface Payment {
  id?: number;
  student_id: number;
  driver_id: number;
  month: string;
  amount_due: number;
  amount_paid: number;
  due_date: Date;
  status: 'pending' | 'paid' | 'overdue' | 'receipt_submitted' | 'rejected';
  receipt_url?: string | null;
  receipt_ref?: string | null;
  reject_reason?: string | null;
  approved_at?: Date | null;
  created_at?: Date;
}
