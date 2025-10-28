export type ItemStatus = "active" | "low_stock" | "expiring_soon" | "expired" | "out_of_stock";
export type TransactionType = 
  | "warehouse_receiving" 
  | "dispense" 
  | "transfer_out" 
  | "transfer_in" 
  | "adjustment" 
  | "disposal";

export interface Batch {
  id: string;
  batchNumber: string;
  itemId: string;
  itemName: string;
  expiryDate: Date;
  quantity: number;
  receivedDate: Date;
  supplier: string;
  wrrNumber?: string;
  location: string;
  status: ItemStatus;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  subType: "supplied" | "donated";
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  batches: Batch[];
  status: ItemStatus;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  date: Date;
  type: TransactionType;
  itemId: string;
  itemName: string;
  itemSubType: "supplied" | "donated";
  batchNumber?: string;
  quantity: number;
  beginningQuantity: number;
  endingQuantity: number;
  expiryDate?: Date;
  referenceNumber?: string;
  location: string;
  performedBy: string;
  approvedBy?: string;
  remarks?: string;
  createdAt: Date;
}

export interface TransferOut {
  id: string;
  transferNumber: string;
  date: Date;
  receivingLGU: string;
  receivingContact?: string;
  status: "draft" | "approved" | "issued" | "received";
  items: {
    id: string;
    itemName: string;
    itemCode: string;
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
    shelfLife: number;
    remarks?: string;
  }[];
  totalValue: number;
  approvedBy?: string;
  issuedBy?: string;
  receivedBy?: string;
  receivedDate?: Date;
  remarks?: string;
  createdAt: Date;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  date: Date;
  type: "physical_count" | "damage" | "expired" | "correction" | "other";
  itemId: string;
  itemName: string;
  batchNumber?: string;
  quantityBefore: number;
  quantityAfter: number;
  difference: number;
  reason: string;
  performedBy: string;
  approvedBy?: string;
  remarks?: string;
  createdAt: Date;
}

