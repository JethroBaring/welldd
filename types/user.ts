export type UserRole = 
  | "super_admin" 
  | "gso_staff" 
  | "medical_staff" 
  | "admin_staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
}

export interface RolePermissions {
  canCreatePR: boolean;
  canApprovePR: boolean;
  canCreatePO: boolean;
  canApprovePO: boolean;
  canReceiveStock: boolean;
  canDispenseMedicine: boolean;
  canManageInventory: boolean;
  canManagePatients: boolean;
  canViewReports: boolean;
  canExportReports: boolean;
  canManageUsers: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  super_admin: {
    canCreatePR: true,
    canApprovePR: true,
    canCreatePO: true,
    canApprovePO: true,
    canReceiveStock: true,
    canDispenseMedicine: true,
    canManageInventory: true,
    canManagePatients: true,
    canViewReports: true,
    canExportReports: true,
    canManageUsers: true,
  },
  gso_staff: {
    canCreatePR: true,
    canApprovePR: false,
    canCreatePO: true,
    canApprovePO: false,
    canReceiveStock: true,
    canDispenseMedicine: true,
    canManageInventory: true,
    canManagePatients: false,
    canViewReports: true,
    canExportReports: false,
    canManageUsers: false,
  },
  medical_staff: {
    canCreatePR: true,
    canApprovePR: false,
    canCreatePO: false,
    canApprovePO: false,
    canReceiveStock: false,
    canDispenseMedicine: false,
    canManageInventory: false,
    canManagePatients: true,
    canViewReports: true,
    canExportReports: false,
    canManageUsers: false,
  },
  admin_staff: {
    canCreatePR: true,
    canApprovePR: false,
    canCreatePO: true,
    canApprovePO: false,
    canReceiveStock: false,
    canDispenseMedicine: false,
    canManageInventory: false,
    canManagePatients: true,
    canViewReports: true,
    canExportReports: true,
    canManageUsers: false,
  },
};

