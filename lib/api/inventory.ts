import {
  InventoryItem,
  InventoryTransaction,
  TransferOut,
  StockAdjustment,
  Batch,
} from "@/types/inventory";
import {
  mockInventoryItems,
  mockInventoryTransactions,
  mockBatches,
} from "@/lib/mock-data";

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Inventory Items
export async function getInventoryItems(): Promise<InventoryItem[]> {
  await delay();
  return mockInventoryItems;
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  await delay();
  return mockInventoryItems.find(item => item.id === id) || null;
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  await delay();
  return mockInventoryItems.filter(
    item => item.status === "low_stock" || item.status === "out_of_stock"
  );
}

export async function getExpiringItems(daysThreshold: number = 180): Promise<Batch[]> {
  await delay();
  const today = new Date();
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return mockBatches.filter(
    batch => batch.expiryDate <= thresholdDate && batch.expiryDate >= today
  );
}

// Inventory Transactions
export async function getInventoryTransactions(): Promise<InventoryTransaction[]> {
  await delay();
  return mockInventoryTransactions;
}

export async function getInventoryTransactionsByItem(itemId: string): Promise<InventoryTransaction[]> {
  await delay();
  return mockInventoryTransactions.filter(txn => txn.itemId === itemId);
}

export async function createInventoryTransaction(data: Partial<InventoryTransaction>): Promise<InventoryTransaction> {
  await delay();
  const newTxn: InventoryTransaction = {
    id: `TRX-${Date.now()}`,
    transactionNumber: `TRX-2025-${String(mockInventoryTransactions.length + 1).padStart(3, '0')}`,
    date: new Date(),
    type: data.type!,
    itemId: data.itemId!,
    itemName: data.itemName!,
    itemSubType: data.itemSubType || "supplied",
    quantity: data.quantity || 0,
    beginningQuantity: data.beginningQuantity || 0,
    endingQuantity: data.endingQuantity || 0,
    location: data.location || "",
    performedBy: data.performedBy || "",
    createdAt: new Date(),
    ...data,
  };
  return newTxn;
}

// Dispense Medicine
export async function dispenseMedicine(
  itemId: string,
  batchNumber: string,
  quantity: number,
  performedBy: string,
  remarks?: string
): Promise<InventoryTransaction> {
  await delay();
  const item = mockInventoryItems.find(i => i.id === itemId);
  if (!item) throw new Error("Item not found");
  
  return createInventoryTransaction({
    type: "dispense",
    itemId,
    itemName: item.itemName,
    itemSubType: item.subType,
    batchNumber,
    quantity: -quantity,
    beginningQuantity: item.totalQuantity,
    endingQuantity: item.totalQuantity - quantity,
    location: item.location,
    performedBy,
    remarks,
  });
}

// Transfer Out
export async function createTransferOut(data: Partial<TransferOut>): Promise<TransferOut> {
  await delay();
  const newTransfer: TransferOut = {
    id: `TO-${Date.now()}`,
    transferNumber: `TO-2025-${String(Date.now()).slice(-3)}`,
    date: new Date(),
    receivingLGU: data.receivingLGU!,
    status: "draft",
    items: data.items || [],
    totalValue: data.totalValue || 0,
    createdAt: new Date(),
    ...data,
  };
  return newTransfer;
}

export async function getTransferOutReports(): Promise<TransferOut[]> {
  await delay();
  return []; // Empty for now, can add mock data if needed
}

// Stock Adjustments
export async function createStockAdjustment(data: Partial<StockAdjustment>): Promise<StockAdjustment> {
  await delay();
  const newAdjustment: StockAdjustment = {
    id: `ADJ-${Date.now()}`,
    adjustmentNumber: `ADJ-2025-${String(Date.now()).slice(-3)}`,
    date: new Date(),
    type: data.type || "correction",
    itemId: data.itemId!,
    itemName: data.itemName!,
    quantityBefore: data.quantityBefore || 0,
    quantityAfter: data.quantityAfter || 0,
    difference: (data.quantityAfter || 0) - (data.quantityBefore || 0),
    reason: data.reason || "",
    performedBy: data.performedBy || "",
    createdAt: new Date(),
    ...data,
  };
  return newAdjustment;
}

export async function getStockAdjustments(): Promise<StockAdjustment[]> {
  await delay();
  return []; // Empty for now, can add mock data if needed
}

// Batches
export async function getBatchesByItem(itemId: string): Promise<Batch[]> {
  await delay();
  return mockBatches.filter(batch => batch.itemId === itemId);
}

