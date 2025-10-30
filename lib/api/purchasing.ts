import { 
  PurchaseRequest, 
  PurchaseOrder, 
  WarehouseReceivingReport,
  Supplier,
  PurchaseInvoice
} from "@/types/purchasing";
import {
  mockPurchaseRequests,
  mockPurchaseOrders,
  mockWarehouseReceivingReports,
  mockSuppliers,
  mockPurchaseInvoices,
} from "@/lib/mock-data";

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Purchase Requests
export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  await delay();
  return mockPurchaseRequests;
}

export async function getPurchaseRequestById(id: string): Promise<PurchaseRequest | null> {
  await delay();
  return mockPurchaseRequests.find(pr => pr.id === id) || null;
}

export async function createPurchaseRequest(data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
  await delay();
  const newPR: PurchaseRequest = {
    id: `PR-${Date.now()}`,
    prNumber: `PR-2025-${String(mockPurchaseRequests.length + 1).padStart(3, '0')}`,
    date: new Date(),
    requestingDepartment: data.requestingDepartment || "",
    costCenter: data.costCenter || "",
    status: "draft",
    items: data.items || [],
    requestedBy: data.requestedBy || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  return newPR;
}

export async function updatePurchaseRequest(id: string, data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
  await delay();
  const pr = mockPurchaseRequests.find(p => p.id === id);
  if (!pr) throw new Error("Purchase Request not found");
  return { ...pr, ...data, updatedAt: new Date() };
}

export async function approvePurchaseRequest(id: string, approvedBy: string): Promise<PurchaseRequest> {
  await delay();
  const pr = mockPurchaseRequests.find(p => p.id === id);
  if (!pr) throw new Error("Purchase Request not found");
  return { 
    ...pr, 
    status: "approved", 
    approvedBy, 
    approvedDate: new Date(),
    updatedAt: new Date() 
  };
}

export async function denyPurchaseRequest(id: string, reason: string): Promise<PurchaseRequest> {
  await delay();
  const pr = mockPurchaseRequests.find(p => p.id === id);
  if (!pr) throw new Error("Purchase Request not found");
  return { 
    ...pr, 
    status: "denied", 
    deniedReason: reason,
    updatedAt: new Date() 
  };
}

// Purchase Orders
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  await delay();
  return mockPurchaseOrders;
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
  await delay();
  return mockPurchaseOrders.find(po => po.id === id) || null;
}

export async function createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  await delay();
  const newPO: PurchaseOrder = {
    id: `PO-${Date.now()}`,
    poNumber: `PO-2025-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
    date: new Date(),
    supplier: data.supplier!,
    status: "draft",
    items: data.items || [],
    subtotal: data.subtotal || 0,
    discount: data.discount || 0,
    tax: data.tax || 0,
    total: data.total || 0,
    createdBy: data.createdBy || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  return newPO;
}

export async function updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  await delay();
  const po = mockPurchaseOrders.find(p => p.id === id);
  if (!po) throw new Error("Purchase Order not found");
  return { ...po, ...data, updatedAt: new Date() };
}

export async function approvePurchaseOrder(id: string, approvedBy: string): Promise<PurchaseOrder> {
  await delay();
  const po = mockPurchaseOrders.find(p => p.id === id);
  if (!po) throw new Error("Purchase Order not found");
  return { 
    ...po, 
    status: "approved", 
    approvedBy, 
    approvedDate: new Date(),
    updatedAt: new Date() 
  };
}

// Warehouse Receiving Reports
export async function getWarehouseReceivingReports(): Promise<WarehouseReceivingReport[]> {
  await delay();
  return mockWarehouseReceivingReports;
}

export async function getWarehouseReceivingReportById(id: string): Promise<WarehouseReceivingReport | null> {
  await delay();
  return mockWarehouseReceivingReports.find(wrr => wrr.id === id) || null;
}

export async function createWarehouseReceivingReport(data: Partial<WarehouseReceivingReport>): Promise<WarehouseReceivingReport> {
  await delay();
  const newWRR: WarehouseReceivingReport = {
    id: `WRR-${Date.now()}`,
    wrrNumber: `WRR-2025-${String(mockWarehouseReceivingReports.length + 1).padStart(3, '0')}`,
    poId: data.poId!,
    poNumber: data.poNumber!,
    date: new Date(),
    supplier: data.supplier!,
    location: data.location || "",
    status: "receiving",
    items: data.items || [],
    receivedBy: data.receivedBy || "",
    total: data.total || 0,
    hasDiscrepancy: data.hasDiscrepancy || false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  return newWRR;
}

export async function completeWarehouseReceiving(id: string): Promise<WarehouseReceivingReport> {
  await delay();
  const wrr = mockWarehouseReceivingReports.find(w => w.id === id);
  if (!wrr) throw new Error("Warehouse Receiving Report not found");
  return { 
    ...wrr, 
    status: "completed",
    updatedAt: new Date() 
  };
}

// Suppliers
export async function getSuppliers(): Promise<Supplier[]> {
  await delay();
  return mockSuppliers;
}

// Purchase Invoices
export async function getPurchaseInvoices(): Promise<PurchaseInvoice[]> {
  await delay();
  return mockPurchaseInvoices;
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  await delay();
  return mockSuppliers.find(s => s.id === id) || null;
}

