export type UserRole = "parent" | "driver" | "admin";

export interface ParentProfileDetails {
  phone?: string;
  alternatePhone?: string;
  relationshipToStudent?: string;
  nicOrPassport?: string;
  homeAddress?: string;
  city?: string;
  schoolName?: string;
  preferredPickupStop?: string;
  preferredDropoffStop?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  notes?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
  parentProfile?: ParentProfileDetails;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface DemoAccount extends AuthUser {
  passwordHint: string;
}
