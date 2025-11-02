export type PRStatus = "draft" | "pending" | "approved" | "denied" | "completed";
export type POStatus = "draft" | "pending" | "approved" | "sent" | "completed";
export type WRRStatus = "pending" | "receiving" | "completed" | "discrepancy";
export type PIStatus = "draft" | "posted" | "void" | "partial" | "paid";

export interface PRItem {
  id: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  date: Date;
  requestingDepartment: string;
  costCenter: string;
  status: PRStatus;
  items: PRItem[];
  requestedBy: string;
  approvedBy?: string;
  approvedDate?: Date;
  deniedReason?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface POItem {
  id: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount?: number;
  subtotal: number;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string;
  taxType: "VAT" | "Non-VAT";
  withholdingTax?: number;
  paymentTerms?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prId?: string;
  prNumber?: string;
  date: Date;
  supplier: Supplier;
  status: POStatus;
  items: POItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: Date;
  expectedDelivery?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WRRItem {
  id: string;
  itemName: string;
  itemCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  remainingQuantity: number;
  unit: string;
  expiryDate?: Date;
  batchNumber?: string;
  remarks?: string;
}

export interface WarehouseReceivingReport {
  id: string;
  wrrNumber: string;
  poId: string;
  poNumber: string;
  date: Date;
  supplier: Supplier;
  location: string;
  status: WRRStatus;
  items: WRRItem[];
  receivedBy: string;
  total: number;
  hasDiscrepancy: boolean;
  discrepancyNotes?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  approver?: string;
}

export interface PurchaseInvoice {
  id: string;
  piNumber: string; // PI No.
  date: Date; // PI Date
  dueDate: Date; // PI Due Date
  status: PIStatus | string; // allow arbitrary for flexibility
  cvStatus: string; // check voucher status
  supplier: Supplier;
  refNumber?: string; // Ref No.
  poNumber?: string; // PO No.
  amountDue: number; // Amount Due
  createdBy: string;
  approver?: string; // Approver
  createdAt: Date;
  updatedAt: Date;
}

