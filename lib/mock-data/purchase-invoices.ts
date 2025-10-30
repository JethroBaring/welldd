import { PurchaseInvoice } from "@/types/purchasing";
import { mockSuppliers } from "./suppliers";

export const mockPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: "PI-001",
    piNumber: "PI-2025-001",
    date: new Date("2025-10-20"),
    dueDate: new Date("2025-11-20"),
    status: "posted",
    cvStatus: "for processing",
    supplier: mockSuppliers[0],
    refNumber: "RR-10001",
    poNumber: "PO-2025-001",
    amountDue: 1926.4,
    createdBy: "Super Admin",
    approver: "Finance Admin",
    createdAt: new Date("2025-10-20"),
    updatedAt: new Date("2025-10-20"),
  },
  {
    id: "PI-002",
    piNumber: "PI-2025-002",
    date: new Date("2025-10-22"),
    dueDate: new Date("2025-11-21"),
    status: "draft",
    cvStatus: "n/a",
    supplier: mockSuppliers[1],
    refNumber: "RR-10002",
    poNumber: "PO-2025-002",
    amountDue: 2500,
    createdBy: "GSO Staff",
    approver: undefined,
    createdAt: new Date("2025-10-22"),
    updatedAt: new Date("2025-10-22"),
  },
];


