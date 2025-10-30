export interface Barangay {
  id: string;
  name: string;
  population?: number;
  zipCode?: string;
}

export interface LGU {
  id: string;
  code: string;
  name: string;
  region: string;
  province: string;
  municipality: string;
  barangays: Barangay[];
  contactInformation: {
    address: string;
    phone: string;
    email: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  lguId: string;
  facilityCode: string;
  name: string;
  type: "hospital" | "clinic" | "health_center" | "pharmacy" | "other";
  address: string;
  barangay: string;
  contactInformation: {
    phone: string;
    email?: string;
  };
  capacity?: {
    beds?: number;
    staff?: number;
  };
  operatingHours?: {
    open: string;
    close: string;
    days: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LGUUser {
  id: string;
  lguId: string;
  facilityId?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | "super_admin"
  | "gso_staff"
  | "medical_staff"
  | "admin_staff";
