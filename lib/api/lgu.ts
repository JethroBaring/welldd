import { LGU, Facility, LGUUser } from "@/types/lgu";
import { mockLGUs, mockFacilities, mockLGUUsers } from "@/lib/mock-data/lgu";

// LGU Management
export const getLGUs = async (): Promise<LGU[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLGUs;
};

export const getLGUById = async (id: string): Promise<LGU> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const lgu = mockLGUs.find((l) => l.id === id);
  if (!lgu) throw new Error("LGU not found");
  return lgu;
};

export const createLGU = async (lguData: Partial<LGU>): Promise<LGU> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newLGU: LGU = {
    id: `lgu-${Date.now()}`,
    code: lguData.code || "",
    name: lguData.name || "",
    region: lguData.region || "",
    province: lguData.province || "",
    municipality: lguData.municipality || "",
    barangays: lguData.barangays || [],
    contactInformation: lguData.contactInformation || {
      address: "",
      phone: "",
      email: "",
    },
    isActive: lguData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newLGU;
};

export const updateLGU = async (id: string, lguData: Partial<LGU>): Promise<LGU> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const lgu = mockLGUs.find((l) => l.id === id);
  if (!lgu) throw new Error("LGU not found");
  return { ...lgu, ...lguData, updatedAt: new Date() };
};

// Facility Management
export const getFacilities = async (lguId: string): Promise<Facility[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockFacilities.filter((f) => f.lguId === lguId);
};

export const getFacilityById = async (id: string): Promise<Facility> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const facility = mockFacilities.find((f) => f.id === id);
  if (!facility) throw new Error("Facility not found");
  return facility;
};

export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newFacility: Facility = {
    id: `fac-${Date.now()}`,
    lguId: facilityData.lguId || "",
    facilityCode: facilityData.facilityCode || "",
    name: facilityData.name || "",
    type: facilityData.type || "other",
    address: facilityData.address || "",
    barangay: facilityData.barangay || "",
    contactInformation: facilityData.contactInformation || { phone: "" },
    capacity: facilityData.capacity,
    operatingHours: facilityData.operatingHours,
    isActive: facilityData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newFacility;
};

export const updateFacility = async (
  id: string,
  facilityData: Partial<Facility>
): Promise<Facility> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const facility = mockFacilities.find((f) => f.id === id);
  if (!facility) throw new Error("Facility not found");
  return { ...facility, ...facilityData, updatedAt: new Date() };
};

// LGU User Management
export const getLGUUsers = async (lguId: string): Promise<LGUUser[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLGUUsers.filter((u) => u.lguId === lguId);
};

export const getLGUUserById = async (id: string): Promise<LGUUser> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = mockLGUUsers.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return user;
};

export const createLGUUser = async (userData: Partial<LGUUser>): Promise<LGUUser> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newUser: LGUUser = {
    id: `user-lgu-${Date.now()}`,
    lguId: userData.lguId || "",
    facilityId: userData.facilityId,
    username: userData.username || "",
    email: userData.email || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    role: userData.role || "admin_staff",
    position: userData.position,
    department: userData.department,
    isActive: userData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newUser;
};

export const updateLGUUser = async (
  id: string,
  userData: Partial<LGUUser>
): Promise<LGUUser> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = mockLGUUsers.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return { ...user, ...userData, updatedAt: new Date() };
};

