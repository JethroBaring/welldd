# WellSync Dalaguete - System ERD (Entity Relationship Diagram)

## Complete System Architecture

This document provides a comprehensive Entity Relationship Diagram (ERD) for the entire WellSync Dalaguete Healthcare Information System.

## Mermaid ERD Diagram

```mermaid
erDiagram
    %% ========================================
    %% USER MANAGEMENT & AUTHENTICATION
    %% ========================================
    
    User {
        string id PK
        string username UK
        string email UK
        string firstName
        string lastName
        string passwordHash
        enum role "super_admin, gso_staff, medical_staff, admin_staff"
        string lguId FK
        string facilityId FK
        string position
        string department
        boolean isActive
        datetime lastLogin
        datetime createdAt
        datetime updatedAt
    }
    
    Role {
        string id PK
        string name UK "super_admin, gso_staff, medical_staff, admin_staff"
        string description
        json permissions
    }
    
    UserSession {
        string id PK
        string userId FK
        string token
        datetime expiresAt
        string ipAddress
        string userAgent
        datetime createdAt
    }
    
    AuditLog {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        json changes
        string ipAddress
        datetime createdAt
    }
    
    %% ========================================
    %% LGU MANAGEMENT
    %% ========================================
    
    LGU {
        string id PK
        string code UK
        string name
        string region
        string province
        string municipality
        string address
        string phone
        string email
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Barangay {
        string id PK
        string lguId FK
        string name
        int population
        string zipCode
        string captain
        string contactNumber
        decimal latitude
        decimal longitude
        datetime createdAt
        datetime updatedAt
    }
    
    Facility {
        string id PK
        string lguId FK
        string facilityCode UK
        string name
        enum type "hospital, clinic, health_center, pharmacy, other"
        string address
        string barangayId FK
        string phone
        string email
        int bedCapacity
        int staffCount
        json operatingHours
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    %% ========================================
    %% PATIENT MANAGEMENT
    %% ========================================
    
    Patient {
        string id PK
        string patientId UK
        string firstName
        string middleName
        string lastName
        date dateOfBirth
        int age
        enum gender "male, female, other"
        string barangayId FK
        string municipality
        string province
        string zipCode
        string contactNumber
        string email
        string bloodType
        json allergies
        json emergencyContact
        enum status "active, inactive, deceased"
        date registrationDate
        datetime createdAt
        datetime updatedAt
    }
    
    MedicalRecord {
        string id PK
        string patientId FK
        string facilityId FK
        string recordNumber UK
        date visitDate
        string chiefComplaint
        string diagnosis
        json prescriptions
        json vitalSigns
        string labResults
        string treatmentPlan
        date followUpDate
        string attendingPhysician
        json documentUrls
        string remarks
        datetime createdAt
        datetime updatedAt
    }
    
    Appointment {
        string id PK
        string patientId FK
        string facilityId FK
        date appointmentDate
        string appointmentTime
        string type
        string physician
        enum status "scheduled, completed, cancelled, no_show"
        string reason
        string notes
        datetime createdAt
        datetime updatedAt
    }
    
    %% ========================================
    %% DISEASE SURVEILLANCE
    %% ========================================
    
    DiseaseCase {
        string id PK
        string patientId FK
        string medicalRecordId FK
        string disease
        date diagnosisDate
        string barangayId FK
        enum status "active, recovered, deceased"
        enum severity "mild, moderate, severe"
        boolean isNotifiable
        date reportedDate
        string reportedBy
        json symptoms
        string notes
        datetime createdAt
        datetime updatedAt
    }
    
    OutbreakAlert {
        string id PK
        string disease
        string barangayId FK
        string lguId FK
        int caseCount
        int threshold
        enum severity "high, medium, low"
        enum status "pending, acknowledged, contained, resolved"
        date dateTriggered
        date dateResolved
        string recommendedAction
        string actionTaken
        string acknowledgedBy
        datetime createdAt
        datetime updatedAt
    }
    
    DiseaseForecast {
        string id PK
        string disease
        string lguId FK
        string barangayId FK
        date forecastDate
        int predictedCases
        decimal confidence
        json factors
        datetime createdAt
    }
    
    %% ========================================
    %% INVENTORY MANAGEMENT
    %% ========================================
    
    InventoryItem {
        string id PK
        string itemCode UK
        string itemName
        string category
        enum subType "supplied, donated"
        string unit
        int totalQuantity
        int availableQuantity
        int reorderLevel
        decimal unitCost
        string description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Batch {
        string id PK
        string batchNumber UK
        string itemId FK
        string supplierId FK
        string wrrId FK
        int quantity
        int availableQuantity
        date expiryDate
        date receivedDate
        string location
        decimal unitCost
        enum status "active, expired, depleted"
        datetime createdAt
        datetime updatedAt
    }
    
    InventoryTransaction {
        string id PK
        string transactionNumber UK
        datetime transactionDate
        enum type "receiving, dispense, transfer_out, transfer_in, adjustment, disposal"
        string itemId FK
        string batchId FK
        int quantity
        int beginningQuantity
        int endingQuantity
        string performedBy FK
        string recipientLGU
        string reason
        string remarks
        string referenceNumber
        datetime createdAt
    }
    
    StockAdjustment {
        string id PK
        string adjustmentNumber UK
        date adjustmentDate
        enum type "physical_count, damage, expired, correction, other"
        string itemId FK
        string batchId FK
        int quantityBefore
        int quantityAfter
        int variance
        string reason
        string adjustedBy FK
        string approvedBy FK
        date approvedDate
        datetime createdAt
        datetime updatedAt
    }
    
    TransferOut {
        string id PK
        string transferNumber UK
        date transferDate
        string sourceLGU FK
        string destinationLGU FK
        string receivingContact
        enum status "draft, approved, issued, received"
        string requestedBy FK
        string approvedBy FK
        date approvedDate
        string remarks
        datetime createdAt
        datetime updatedAt
    }
    
    TransferOutItem {
        string id PK
        string transferOutId FK
        string itemId FK
        string batchId FK
        int quantityRequested
        int quantityIssued
        int quantityReceived
        string remarks
    }
    
    StockAlert {
        string id PK
        string itemId FK
        string batchId FK
        enum type "low_stock, expiring_soon, expired, reorder"
        enum severity "high, medium, low"
        enum status "active, acknowledged, resolved"
        date triggeredDate
        date acknowledgedDate
        string acknowledgedBy FK
        string notes
        datetime createdAt
    }
    
    %% ========================================
    %% PROCUREMENT & PURCHASING
    %% ========================================
    
    Supplier {
        string id PK
        string code UK
        string name
        string contactPerson
        string phone
        string email
        string address
        string tin
        enum taxType "VAT, Non-VAT"
        decimal withholdingTax
        string paymentTerms
        boolean isActive
        decimal rating
        datetime createdAt
        datetime updatedAt
    }
    
    PurchaseRequest {
        string id PK
        string prNumber UK
        date requestDate
        string lguId FK
        string requestingDepartment
        string costCenter
        enum status "draft, pending, approved, denied, completed"
        string requestedBy FK
        string approvedBy FK
        date approvedDate
        string deniedReason
        string remarks
        datetime createdAt
        datetime updatedAt
    }
    
    PurchaseRequestItem {
        string id PK
        string prId FK
        string itemName
        string itemCode
        int quantity
        string unit
        decimal estimatedPrice
        decimal totalEstimate
        string notes
    }
    
    PurchaseOrder {
        string id PK
        string poNumber UK
        string prId FK
        date orderDate
        string supplierId FK
        string lguId FK
        enum status "draft, pending, approved, sent, completed"
        decimal subtotal
        decimal discount
        decimal tax
        decimal total
        string createdBy FK
        string approvedBy FK
        date approvedDate
        date expectedDelivery
        string remarks
        datetime createdAt
        datetime updatedAt
    }
    
    PurchaseOrderItem {
        string id PK
        string poId FK
        string itemName
        string itemCode
        int quantity
        string unit
        decimal unitPrice
        decimal discount
        decimal subtotal
    }
    
    WarehouseReceivingReport {
        string id PK
        string wrrNumber UK
        string poId FK
        date receivingDate
        string supplierId FK
        string lguId FK
        string location
        enum status "pending, receiving, completed, discrepancy"
        decimal total
        boolean hasDiscrepancy
        string discrepancyNotes
        string receivedBy FK
        string inspectedBy FK
        string remarks
        datetime createdAt
        datetime updatedAt
    }
    
    WarehouseReceivingItem {
        string id PK
        string wrrId FK
        string itemName
        string itemCode
        int orderedQuantity
        int receivedQuantity
        int remainingQuantity
        string unit
        date expiryDate
        string batchNumber
        string remarks
    }
    
    %% ========================================
    %% REPORTING & ANALYTICS
    %% ========================================
    
    Report {
        string id PK
        string reportCode UK
        string reportName
        enum type "inventory, patient, surveillance, procurement, financial"
        enum frequency "daily, weekly, monthly, quarterly, annual, ad_hoc"
        json parameters
        string generatedBy FK
        datetime generatedAt
        string fileUrl
        enum format "pdf, excel, csv"
        datetime createdAt
    }
    
    Dashboard {
        string id PK
        string name
        string userId FK
        enum type "executive, inventory, surveillance, procurement"
        json widgets
        json layout
        boolean isDefault
        datetime createdAt
        datetime updatedAt
    }
    
    %% ========================================
    %% INTEGRATION & EXTERNAL SYSTEMS
    %% ========================================
    
    ExternalIntegration {
        string id PK
        string name "PhilHealth, DOH-eLMIS, Urbanwatch"
        enum type "philhealth, doh_elmis, urbanwatch, custom"
        string apiEndpoint
        json credentials
        boolean isActive
        datetime lastSyncDate
        string lastSyncStatus
        datetime createdAt
        datetime updatedAt
    }
    
    SyncLog {
        string id PK
        string integrationId FK
        datetime syncDate
        enum direction "inbound, outbound"
        string entityType
        int recordsProcessed
        int recordsSucceeded
        int recordsFailed
        json errorDetails
        datetime createdAt
    }
    
    %% ========================================
    %% NOTIFICATIONS & MESSAGING
    %% ========================================
    
    Notification {
        string id PK
        string userId FK
        enum type "alert, reminder, approval, info"
        string title
        string message
        json data
        boolean isRead
        datetime readAt
        enum priority "high, medium, low"
        datetime createdAt
    }
    
    EmailQueue {
        string id PK
        string recipient
        string subject
        string body
        json attachments
        enum status "pending, sent, failed"
        int retryCount
        string errorMessage
        datetime sentAt
        datetime createdAt
    }
    
    %% ========================================
    %% RELATIONSHIPS
    %% ========================================
    
    %% User Management Relationships
    User ||--|| Role : "has"
    User }o--|| LGU : "assigned to"
    User }o--o| Facility : "works at"
    User ||--o{ UserSession : "has"
    User ||--o{ AuditLog : "performs"
    
    %% LGU Relationships
    LGU ||--o{ Barangay : "contains"
    LGU ||--o{ Facility : "manages"
    LGU ||--o{ User : "employs"
    LGU ||--o{ PurchaseRequest : "creates"
    LGU ||--o{ PurchaseOrder : "orders"
    LGU ||--o{ WarehouseReceivingReport : "receives"
    
    %% Facility & Barangay Relationships
    Barangay ||--o{ Patient : "resides in"
    Barangay ||--o{ DiseaseCase : "located in"
    Barangay ||--o{ OutbreakAlert : "affected by"
    Barangay ||--o{ Facility : "hosts"
    
    %% Patient Management Relationships
    Patient ||--o{ MedicalRecord : "has"
    Patient ||--o{ Appointment : "schedules"
    Patient ||--o{ DiseaseCase : "diagnosed with"
    Facility ||--o{ MedicalRecord : "maintains"
    Facility ||--o{ Appointment : "hosts"
    
    %% Disease Surveillance Relationships
    DiseaseCase }o--|| Patient : "belongs to"
    DiseaseCase }o--o| MedicalRecord : "documented in"
    DiseaseCase }o--|| Barangay : "located in"
    OutbreakAlert }o--|| Barangay : "occurs in"
    OutbreakAlert }o--|| LGU : "affects"
    DiseaseForecast }o--|| LGU : "predicts for"
    DiseaseForecast }o--o| Barangay : "specific to"
    
    %% Inventory Relationships
    InventoryItem ||--o{ Batch : "has"
    InventoryItem ||--o{ InventoryTransaction : "tracks"
    InventoryItem ||--o{ StockAdjustment : "adjusted"
    InventoryItem ||--o{ StockAlert : "triggers"
    Batch ||--o{ InventoryTransaction : "used in"
    Batch ||--o{ StockAdjustment : "adjusted"
    Batch }o--o| Supplier : "supplied by"
    Batch }o--o| WarehouseReceivingReport : "received in"
    
    %% Transfer Relationships
    TransferOut ||--o{ TransferOutItem : "contains"
    TransferOut }o--|| LGU : "from"
    TransferOut }o--|| LGU : "to"
    TransferOutItem }o--|| InventoryItem : "transfers"
    TransferOutItem }o--o| Batch : "from batch"
    
    %% Procurement Relationships
    Supplier ||--o{ PurchaseOrder : "receives"
    Supplier ||--o{ WarehouseReceivingReport : "delivers"
    PurchaseRequest ||--o{ PurchaseRequestItem : "contains"
    PurchaseRequest }o--|| User : "requested by"
    PurchaseRequest }o--|| LGU : "from"
    PurchaseOrder ||--o{ PurchaseOrderItem : "contains"
    PurchaseOrder }o--o| PurchaseRequest : "fulfills"
    PurchaseOrder }o--|| Supplier : "ordered from"
    PurchaseOrder }o--|| User : "created by"
    WarehouseReceivingReport ||--o{ WarehouseReceivingItem : "contains"
    WarehouseReceivingReport }o--|| PurchaseOrder : "receives"
    WarehouseReceivingReport }o--|| Supplier : "from"
    WarehouseReceivingReport }o--|| User : "received by"
    
    %% Reporting Relationships
    Report }o--|| User : "generated by"
    Dashboard }o--|| User : "belongs to"
    
    %% Integration Relationships
    ExternalIntegration ||--o{ SyncLog : "logs"
    
    %% Notification Relationships
    Notification }o--|| User : "sent to"
    User ||--o{ EmailQueue : "receives"
```

## Entity Descriptions

### 1. User Management Module

#### **User**
Core user entity containing authentication and profile information. Users are assigned to specific LGUs and facilities with role-based access control.

#### **Role**
Defines access permissions:
- **Super Admin**: Full system access, configuration, and user management
- **GSO Staff**: Inventory management, procurement, and warehouse operations
- **Medical Staff**: Patient records, clinical functions, and disease surveillance
- **Admin Staff**: Records management, reporting, and administrative tasks

#### **UserSession**
Tracks active user sessions for security and audit purposes.

#### **AuditLog**
Records all user actions for compliance and security monitoring.

---

### 2. LGU Management Module

#### **LGU (Local Government Unit)**
Represents municipalities/cities in the healthcare network. Each LGU manages multiple facilities and barangays.

#### **Barangay**
Smallest administrative division. Critical for disease surveillance and geographic tracking of health data.

#### **Facility**
Healthcare facilities (hospitals, clinics, health centers, pharmacies) operated by LGUs.

---

### 3. Patient Management Module

#### **Patient**
Central patient registry with demographics, contact information, and medical history references.

#### **MedicalRecord**
Complete clinical documentation including diagnoses, prescriptions, vital signs, and treatment plans.

#### **Appointment**
Scheduling system for patient visits and follow-ups.

---

### 4. Disease Surveillance Module

#### **DiseaseCase**
Individual disease cases linked to patients for epidemiological tracking and outbreak detection.

#### **OutbreakAlert**
Automated alerts triggered when disease cases exceed defined thresholds in specific areas.

#### **DiseaseForecast**
Predictive analytics for disease trends using historical data and risk factors.

---

### 5. Inventory Management Module

#### **InventoryItem**
Master catalog of medical supplies, medicines, and equipment.

#### **Batch**
Tracks specific batches with expiry dates, lot numbers, and FEFO (First Expired, First Out) logic.

#### **InventoryTransaction**
Complete audit trail of all inventory movements (receiving, dispensing, transfers, adjustments).

#### **StockAdjustment**
Records discrepancies and corrections (physical counts, damage, expiry).

#### **TransferOut** / **TransferOutItem**
Inter-LGU inventory transfers for resource sharing.

#### **StockAlert**
Automated alerts for low stock, expiring items, and reorder points.

---

### 6. Procurement Module

#### **Supplier**
Vendor master data including tax information, payment terms, and ratings.

#### **PurchaseRequest (PR)**
Initial requisition by departments for needed supplies.

#### **PurchaseOrder (PO)**
Formal order to suppliers, linked to approved PRs.

#### **WarehouseReceivingReport (WRR)**
Documents actual receipt of goods, tracks discrepancies, and triggers inventory updates.

---

### 7. Reporting & Analytics Module

#### **Report**
Generated reports (inventory, surveillance, financial) with various formats and schedules.

#### **Dashboard**
Customizable user dashboards with role-specific widgets and KPIs.

---

### 8. Integration Module

#### **ExternalIntegration**
Connections to external systems:
- **PhilHealth**: Claims and member verification
- **DOH-eLMIS**: National logistics management
- **Urbanwatch**: Disease surveillance and outbreak monitoring

#### **SyncLog**
Tracks data synchronization with external systems for troubleshooting and audit.

---

### 9. Notifications Module

#### **Notification**
In-app notifications for alerts, reminders, approvals, and system updates.

#### **EmailQueue**
Email delivery queue with retry logic for credential delivery, alerts, and reports.

---

## Key Relationships

1. **User-LGU-Facility**: Users belong to specific LGUs and may work at specific facilities
2. **Patient-Barangay-LGU**: Patients are geographically tracked for disease surveillance
3. **Disease-Patient-Barangay**: Disease cases are linked to patients and locations for outbreak detection
4. **Inventory-Batch-Supplier**: Complete supply chain tracking from procurement to dispensing
5. **PR-PO-WRR**: Procurement workflow from requisition to receipt
6. **Transfer-LGU**: Inter-LGU resource sharing and emergency response

---

## Data Flow Patterns

### Procurement Flow
```
PurchaseRequest → PurchaseOrder → WarehouseReceivingReport → Batch → InventoryTransaction
```

### Patient Care Flow
```
Patient → Appointment → MedicalRecord → DiseaseCase → OutbreakAlert
```

### Inventory Management Flow
```
Batch → InventoryTransaction → StockAdjustment → StockAlert
```

### Disease Surveillance Flow
```
Patient → MedicalRecord → DiseaseCase → OutbreakAlert → DiseaseForecast
```

---

## Implementation Notes

### Indexing Strategy
- **Primary Keys**: UUID for all entities
- **Foreign Keys**: Indexed for join performance
- **Composite Indexes**: 
  - (lguId, date) for temporal queries
  - (barangayId, disease, date) for surveillance
  - (itemId, batchNumber) for inventory
  - (patientId, visitDate) for medical records

### Data Retention
- **Audit Logs**: 7 years
- **Transactions**: Perpetual
- **Sessions**: 30 days
- **Notifications**: 90 days

### Security
- Row-level security (RLS) based on LGU assignment
- Encrypted fields: passwordHash, API credentials
- Audit trail for all sensitive operations

---

## Future Enhancements (Phase 3 & 4)

1. **E-Prescribing Integration**
2. **Telemedicine Module**
3. **Mobile Health Worker App**
4. **Advanced Analytics & ML**
5. **Multi-Language Support**
6. **Patient Portal**
7. **Laboratory Information System (LIS)**
8. **Radiology Information System (RIS)**

---

*Last Updated: January 2025*
*Version: 2.0 - Phase 2 Implementation*