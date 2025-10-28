import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "USER-001",
    name: "Marisa Gonzales",
    email: "marisa.gonzales@dalaguete-rhu.gov.ph",
    role: "super_admin",
    department: "RHU Administration",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "USER-002",
    name: "Dr. Maria Santos",
    email: "maria.santos@dalaguete-rhu.gov.ph",
    role: "medical_staff",
    department: "Medical Services",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "USER-003",
    name: "Carmen Lopez",
    email: "carmen.lopez@dalaguete-rhu.gov.ph",
    role: "gso_staff",
    department: "General Services Office",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "USER-004",
    name: "Ana Reyes",
    email: "ana.reyes@dalaguete-rhu.gov.ph",
    role: "admin_staff",
    department: "Administration",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "USER-005",
    name: "Nurse Pedro Cruz",
    email: "pedro.cruz@dalaguete-rhu.gov.ph",
    role: "medical_staff",
    department: "Nursing Services",
    createdAt: new Date("2024-01-15"),
  },
];

