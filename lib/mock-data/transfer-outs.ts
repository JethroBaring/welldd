import { TransferOut } from "@/types/inventory";
import { mockLGUs } from "./lgu";

export const mockTransferOuts: TransferOut[] = [
  {
    id: "transfer-001",
    transferNumber: "TO-2025-001",
    date: new Date("2025-10-15"),
    receivingLGU: "Argao Municipality",
    receivingContact: "Dr. Juan Santos - Pharmacy Head",
    status: "received",
    items: [
      {
        id: "toi-001",
        itemName: "Paracetamol 500mg Tablets",
        itemCode: "MED-001",
        batchNumber: "PARA2024-Z01",
        expiryDate: new Date("2026-03-15"),
        quantity: 100,
        shelfLife: 5,
        remarks: "Expiring stock transfer"
      },
      {
        id: "toi-002",
        itemName: "Amoxicillin 500mg Capsules",
        itemCode: "MED-002",
        batchNumber: "AMOX2024-B02",
        expiryDate: new Date("2026-04-20"),
        quantity: 50,
        shelfLife: 6,
        remarks: "Near expiry - preventive transfer"
      }
    ],
    totalValue: 12500.00,
    approvedBy: "Marisa Gonzales",
    issuedBy: "Carmen Lopez",
    receivedBy: "Dr. Juan Santos",
    receivedDate: new Date("2025-10-16"),
    remarks: "Emergency stock support for flu season",
    createdAt: new Date("2025-10-15"),
  },
  {
    id: "transfer-002",
    transferNumber: "TO-2025-002",
    date: new Date("2025-10-20"),
    receivingLGU: "Argao Municipality",
    receivingContact: "Maria Reyes - Chief Nurse",
    status: "issued",
    items: [
      {
        id: "toi-003",
        itemName: "Vitamin C 500mg Tablets",
        itemCode: "MED-009",
        batchNumber: "VITC2024-A01",
        expiryDate: new Date("2026-05-30"),
        quantity: 200,
        shelfLife: 7,
        remarks: "Excess stock donation"
      }
    ],
    totalValue: 8000.00,
    approvedBy: "Marisa Gonzales",
    issuedBy: "Carmen Lopez",
    remarks: "Preventive stock sharing before rainy season",
    createdAt: new Date("2025-10-20"),
  },
  {
    id: "transfer-003",
    transferNumber: "TO-2025-003",
    date: new Date("2025-10-25"),
    receivingLGU: "Alcoy Municipality",
    receivingContact: "Dr. Roberto Cruz - Health Officer",
    status: "approved",
    items: [
      {
        id: "toi-004",
        itemName: "Ibuprofen 400mg Tablets",
        itemCode: "MED-003",
        batchNumber: "IBUP2024-C01",
        expiryDate: new Date("2026-06-10"),
        quantity: 150,
        shelfLife: 7,
        remarks: "Dengue prevention stock"
      },
      {
        id: "toi-005",
        itemName: "Oral Rehydration Salts",
        itemCode: "SUP-001",
        batchNumber: "ORS2024-D01",
        expiryDate: new Date("2026-07-15"),
        quantity: 300,
        shelfLife: 8,
        remarks: "Diarrhea prevention program"
      },
      {
        id: "toi-006",
        itemName: "Multivitamins for Children",
        itemCode: "MED-011",
        batchNumber: "MUL2024-E01",
        expiryDate: new Date("2026-08-20"),
        quantity: 100,
        shelfLife: 9,
        remarks: "Nutrition program support"
      }
    ],
    totalValue: 25000.00,
    approvedBy: "Marisa Gonzales",
    remarks: "Public health emergency support",
    createdAt: new Date("2025-10-25"),
  },
  {
    id: "transfer-004",
    transferNumber: "TO-2025-004",
    date: new Date("2025-10-27"),
    receivingLGU: "Boljoon Municipality",
    receivingContact: "Ana Maria Santos - Rural Health Unit",
    status: "draft",
    items: [
      {
        id: "toi-007",
        itemName: "Cough Syrup",
        itemCode: "MED-004",
        batchNumber: "COUGH2024-F01",
        expiryDate: new Date("2026-09-01"),
        quantity: 75,
        shelfLife: 10,
        remarks: "Respiratory illness season preparation"
      }
    ],
    totalValue: 5625.00,
    remarks: "Prepared for transfer - awaiting final approval",
    createdAt: new Date("2025-10-27"),
  },
  {
    id: "transfer-005",
    transferNumber: "TO-2025-005",
    date: new Date("2025-10-26"),
    receivingLGU: "Carcar Municipality",
    receivingContact: "Dr. Miguel Reyes - Municipal Health Officer",
    status: "pending",
    items: [
      {
        id: "toi-008",
        itemName: "Antihistamine Tablets",
        itemCode: "MED-005",
        batchNumber: "ANTI2024-G01",
        expiryDate: new Date("2026-10-15"),
        quantity: 120,
        shelfLife: 11,
        remarks: "Allergy season preparation"
      },
      {
        id: "toi-009",
        itemName: "Thermometers (Digital)",
        itemCode: "SUP-002",
        batchNumber: "TEMP2024-H01",
        expiryDate: new Date("2027-12-31"),
        quantity: 50,
        shelfLife: 24,
        remarks: "Medical equipment sharing"
      }
    ],
    totalValue: 18500.00,
    remarks: "Seasonal illness preparation support",
    createdAt: new Date("2025-10-26"),
  }
];