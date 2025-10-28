export type PatientStatus = "active" | "inactive" | "deceased";
export type Gender = "male" | "female" | "other";

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  gender: Gender;
  address: {
    barangay: string;
    municipality: string;
    province: string;
    zipCode?: string;
  };
  contactNumber?: string;
  email?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodType?: string;
  allergies?: string[];
  status: PatientStatus;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordNumber: string;
  date: Date;
  chiefComplaint?: string;
  diagnosis: string;
  prescriptions?: {
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  vitalSigns?: {
    bloodPressure?: string;
    temperature?: number;
    pulseRate?: number;
    respiratoryRate?: number;
    weight?: number;
    height?: number;
  };
  labResults?: string;
  treatmentPlan?: string;
  followUpDate?: Date;
  attendingPhysician: string;
  documentUrls?: string[];
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  time: string;
  type: string;
  physician: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  reason?: string;
  notes?: string;
  createdAt: Date;
}

