import { Patient, MedicalRecord } from "@/types/patient";
import { mockPatients, mockMedicalRecords } from "@/lib/mock-data";

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Patients
export async function getPatients(): Promise<Patient[]> {
  await delay();
  return mockPatients;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  await delay();
  return mockPatients.find(p => p.id === id) || null;
}

export async function searchPatients(query: string): Promise<Patient[]> {
  await delay();
  const lowerQuery = query.toLowerCase();
  return mockPatients.filter(
    p =>
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.patientId.toLowerCase().includes(lowerQuery) ||
      p.contactNumber?.includes(query)
  );
}

export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  await delay();
  const newPatient: Patient = {
    id: `PAT-${Date.now()}`,
    patientId: `2025-${String(mockPatients.length + 1).padStart(3, '0')}`,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    dateOfBirth: data.dateOfBirth || new Date(),
    age: data.age || 0,
    gender: data.gender || "other",
    address: data.address || {
      barangay: "",
      municipality: "Dalaguete",
      province: "Cebu",
    },
    status: "active",
    registrationDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  return newPatient;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  await delay();
  const patient = mockPatients.find(p => p.id === id);
  if (!patient) throw new Error("Patient not found");
  return { ...patient, ...data, updatedAt: new Date() };
}

// Medical Records
export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  await delay();
  return mockMedicalRecords;
}

export async function getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
  await delay();
  return mockMedicalRecords.filter(mr => mr.patientId === patientId);
}

export async function getMedicalRecordById(id: string): Promise<MedicalRecord | null> {
  await delay();
  return mockMedicalRecords.find(mr => mr.id === id) || null;
}

export async function createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
  await delay();
  const newRecord: MedicalRecord = {
    id: `MR-${Date.now()}`,
    recordNumber: `MR-2025-${String(mockMedicalRecords.length + 1).padStart(3, '0')}`,
    patientId: data.patientId!,
    date: new Date(),
    diagnosis: data.diagnosis || "",
    attendingPhysician: data.attendingPhysician || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  return newRecord;
}

export async function updateMedicalRecord(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
  await delay();
  const record = mockMedicalRecords.find(mr => mr.id === id);
  if (!record) throw new Error("Medical Record not found");
  return { ...record, ...data, updatedAt: new Date() };
}

