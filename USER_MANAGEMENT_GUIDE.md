# WellSync - User Management Implementation Guide

## Overview
This guide covers the comprehensive user management features implemented in the WellSync system. The system includes role-based access control (RBAC), LGU-based user assignment, and full CRUD operations for user accounts.

---

## 📋 Table of Contents
1. [User Roles and Permissions](#user-roles-and-permissions)
2. [LGU Management](#lgu-management)
3. [User Management](#user-management)
4. [Role-Based Access Control](#role-based-access-control)
5. [Implementation Details](#implementation-details)
6. [API Reference](#api-reference)

---

## 🔐 User Roles and Permissions

### Available Roles

#### 1. **Super Admin** (`super_admin`)
**Badge Color:** Purple

**Description:** Full system access and configuration capabilities

**Permissions:**
- ✅ User Management (Create, Edit, Delete, Activate/Deactivate)
- ✅ LGU Management (All LGUs)
- ✅ System Configuration
- ✅ Full Audit Trail Access
- ✅ Alert Threshold Configuration
- ✅ All Module Access
- ✅ All Reporting
- ✅ Procurement Oversight
- ✅ Inventory Management (View All)
- ✅ Patient Management (View All)
- ✅ Disease Surveillance (All LGUs)

**Use Cases:**
- RHU Head
- IT Lead/Administrator
- System Configurator

---

#### 2. **GSO Staff** (`gso_staff`)
**Badge Color:** Blue

**Description:** Inventory management and procurement focus

**Permissions:**
- ✅ Inventory Management (Full Access)
- ✅ Stock Monitoring & Alerts
- ✅ Warehouse Receiving (WRR)
- ✅ Purchase Requests (Create)
- ✅ Purchase Orders (Create, Manage)
- ✅ Barcode/QR Scanning
- ✅ Stock Adjustments
- ✅ Transfer Out/Consignment
- ✅ Inventory Reports
- ✅ Patient Profiles (View-Only)
- ✅ Supplier Management
- ❌ User Management
- ❌ System Configuration

**Use Cases:**
- Inventory Manager
- Supply Officer
- Warehouse Personnel
- Procurement Staff

---

#### 3. **Medical Staff** (`medical_staff`)
**Badge Color:** Green

**Description:** Patient records and clinical functions

**Permissions:**
- ✅ Patient Management (Full Access)
- ✅ Medical Records (Create, Edit, View)
- ✅ Patient Registration
- ✅ Medical History
- ✅ Disease Surveillance Dashboard
- ✅ Outbreak Monitoring
- ✅ Trend Analysis
- ✅ Purchase Requests (Create)
- ✅ Inventory (View Stock Levels)
- ✅ Medical Reports
- ❌ Inventory Management
- ❌ User Management
- ❌ System Configuration

**Use Cases:**
- Doctors
- Nurses
- Medical Officers
- Health Workers

---

#### 4. **Admin Staff** (`admin_staff`)
**Badge Color:** Orange

**Description:** Records management and reporting

**Permissions:**
- ✅ Patient Profiles (Full Access)
- ✅ Patient Records Management
- ✅ Purchase Requests (Create, Manage)
- ✅ Purchase Orders (Create)
- ✅ All Reports (Generate, Export)
- ✅ Disease Surveillance (View)
- ✅ Inventory (View-Only)
- ✅ Assigned LGU Management (Own LGU Only)
- ❌ Inventory Management
- ❌ Other LGU Access
- ❌ System Configuration

**Use Cases:**
- Administrative Personnel
- Records Officer
- Reporting Staff
- Data Entry Clerk

---

## 🏥 LGU Management

### Creating a New LGU

**Location:** `/lgu/new`

**Access:** Super Admin Only

**Steps:**

1. **Navigate to LGU Management**
   - Click "LGU Management" in sidebar
   - Click "Add LGU" button

2. **Fill Basic Information**
   - LGU Name (e.g., "Dalaguete Rural Health Unit")
   - LGU Code (e.g., "RHU-DAL-001")
   - Region (Select from dropdown)
   - Province (Select from dropdown)
   - Municipality (Enter manually)

3. **Add Contact Information**
   - Contact Person Name
   - Phone Number
   - Email Address
   - Physical Address

4. **Add Barangays**
   - Enter barangay name
   - Click "Add" or press Enter
   - Repeat for all barangays
   - Remove by clicking X on badge

5. **Submit**
   - Click "Create LGU"
   - System validates all fields
   - Redirects to LGU list on success

### Viewing LGU Details

**Location:**
