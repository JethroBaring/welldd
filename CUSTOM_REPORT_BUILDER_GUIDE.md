# Custom Report Builder - Implementation Guide

**Project**: WellSync Dalaguete Healthcare Information System  
**Feature**: Custom Report Builder  
**Version**: 2.0  
**Last Updated**: January 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [User Guide](#user-guide)
5. [Report Templates](#report-templates)
6. [Data Sources](#data-sources)
7. [Filter System](#filter-system)
8. [Visualization Options](#visualization-options)
9. [Export Formats](#export-formats)
10. [Scheduling Reports](#scheduling-reports)
11. [API Documentation](#api-documentation)
12. [Technical Implementation](#technical-implementation)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Custom Report Builder is a powerful, user-friendly tool that enables users to create custom reports without technical knowledge. It provides:

- **Visual Query Builder**: Drag-and-drop interface for building reports
- **Pre-built Templates**: Ready-to-use report templates for common scenarios
- **Flexible Filters**: Advanced filtering with multiple conditions
- **Multiple Visualizations**: Tables, charts, pivot tables, and more
- **Export Options**: PDF, Excel, CSV formats
- **Report Scheduling**: Automated report generation and delivery
- **Save & Share**: Save reports and share with team members

### Key Benefits

✅ **No SQL Required**: Build complex reports visually  
✅ **Fast Setup**: Get started with templates in seconds  
✅ **Real-time Preview**: See results as you build  
✅ **Flexible Output**: Export in multiple formats  
✅ **Automated Delivery**: Schedule reports to run automatically  
✅ **Collaborative**: Share reports with your team

---

## ✨ Features

### Core Features

1. **Visual Report Builder**
   - Step-by-step wizard interface
   - Intuitive field selection
   - Dynamic filter builder
   - Real-time preview
   - Progress indicators

2. **Data Source Selection**
   - Inventory Items
   - Inventory Transactions
   - Patients
   - Medical Records
   - Disease Cases
   - Purchase Orders
   - Suppliers
   - Users & LGUs

3. **Field Management**
   - Select/deselect fields
   - Reorder columns
   - Custom field labels
   - Field formatting options
   - Aggregation functions

4. **Advanced Filtering**
   - Multiple filter conditions
   - Logical operators (AND/OR)
   - Various operators (equals, contains, greater than, etc.)
   - Date range filters
   - Text search filters
   - Numeric comparison filters

5. **Visualization Types**
   - **Table**: Standard tabular data
   - **Bar Chart**: Compare values across categories
   - **Pie Chart**: Show proportions
   - **Line Chart**: Trend analysis over time
   - **Area Chart**: Cumulative trends
   - **Pivot Table**: Multi-dimensional analysis
   - **Summary Cards**: Key metrics display
   - **Timeline**: Chronological view

6. **Export & Share**
   - PDF export (print-ready)
   - Excel export (with formulas)
   - CSV export (data only)
   - JSON export (API integration)
   - Direct email delivery
   - Public sharing links

7. **Report Management**
   - Save reports for reuse
   - Organize in folders
   - Mark as favorites
   - Clone and modify
   - Version history
   - Usage analytics

8. **Scheduling & Automation**
   - Daily, weekly, monthly schedules
   - Custom time selection
   - Email distribution lists
   - Automatic format selection
   - Failure notifications
   - Retry logic

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────┐
│         Custom Report Builder UI                │
│  (React Components + State Management)          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         Report Configuration Service            │
│  (Validation, Transformation, Storage)          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│           Query Builder Engine                  │
│  (SQL Generation, Filter Processing)            │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          Data Source Adapters                   │
│  (Inventory, Medical, Procurement, etc.)        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Database Layer                     │
│  (PostgreSQL with Indexes & Views)              │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
1. User selects data source
   ↓
2. System loads available fields
   ↓
3. User selects fields & adds filters
   ↓
4. Configuration is validated
   ↓
5. Query is generated
   ↓
6. Data is fetched from database
   ↓
7. Results are formatted & displayed
   ↓
8. User exports or saves report
```

---

## 📖 User Guide

### Getting Started

#### Step 1: Access Report Builder

Navigate to **Reports > Custom Reports** in the main menu.

You'll see three options:
- **Build from Scratch**: Create a completely custom report
- **Use Template**: Start with a pre-built template
- **My Saved Reports**: Access your previously saved reports

#### Step 2: Select Data Source

Choose the primary data source for your report:

**Inventory Sources:**
- 📦 Inventory Items - Current stock levels
- 📊 Inventory Transactions - Movement history

**Medical Sources:**
- 👥 Patients - Demographics and registration
- 📋 Medical Records - Clinical documentation
- 🦠 Disease Cases - Surveillance data

**Procurement Sources:**
- 🛒 Purchase Orders - Procurement data
- 🏢 Suppliers - Vendor information

#### Step 3: Select Fields

Choose which fields to include in your report:

1. Click on fields to add/remove them
2. Use "Select All" to include all fields
3. Use "Clear All" to start over
4. Selected fields appear in your report columns

**Tips:**
- Start with fewer fields and add more as needed
- Consider your audience - show only relevant data
- Order matters - fields appear in selection order

#### Step 4: Add Filters (Optional)

Narrow down your data with filters:

1. Click "Add Filter"
2. Select a field to filter on
3. Choose an operator (equals, contains, greater than, etc.)
4. Enter the filter value
5. Add multiple filters with AND/OR logic

**Common Filter Examples:**

```
Stock Level Alerts:
- Field: availableQuantity
- Operator: less_than
- Value: reorderLevel

Recent Records:
- Field: date
- Operator: greater_than
- Value: [Last 30 days]

Specific Location:
- Field: barangay
- Operator: equals
- Value: "Poblacion"
```

#### Step 5: Preview & Generate

1. Click "Generate Report" to preview
2. Review the data in the preview table
3. Adjust filters/fields if needed
4. Generate again to refresh

#### Step 6: Save or Export

**Save the Report:**
1. Click "Save Report"
2. Enter a name and description
3. Click "Save"
4. Report is added to your saved reports

**Export the Report:**
- **PDF**: Print-ready format with headers
- **Excel**: Editable spreadsheet with formatting
- **CSV**: Raw data for further analysis

---

## 📑 Report Templates

### Available Templates

#### 1. Low Stock Items
**Category**: Inventory  
**Description**: Items below reorder level requiring immediate attention  
**Fields**: Item Code, Item Name, Available Quantity, Reorder Level  
**Filters**: Available Quantity < Reorder Level  
**Use Case**: Daily inventory monitoring

#### 2. Transaction History
**Category**: Inventory  
**Description**: Complete inventory transaction log  
**Fields**: Transaction #, Date, Type, Item Name, Quantity, Performed By  
**Filters**: Date range (last 30 days)  
**Use Case**: Audit trail and movement tracking

#### 3. Expiring Items
**Category**: Inventory  
**Description**: Batches expiring in the next 30-90 days  
**Fields**: Item Name, Batch #, Expiry Date, Quantity, Location  
**Filters**: Expiry Date between [Today] and [+90 days]  
**Use Case**: FEFO management

#### 4. Patient Demographics
**Category**: Medical  
**Description**: Patient population analysis  
**Fields**: Patient ID, Name, Age, Gender, Barangay  
**Filters**: None (all active patients)  
**Use Case**: Population health management

#### 5. Disease Outbreak Summary
**Category**: Surveillance  
**Description**: Disease cases grouped by location and severity  
**Fields**: Disease, Diagnosis Date, Barangay, Severity, Status  
**Filters**: Date range (customizable)  
**Use Case**: Outbreak monitoring and response

#### 6. Procurement Spending
**Category**: Procurement  
**Description**: Purchase order totals and supplier analysis  
**Fields**: PO Number, Date, Supplier, Total, Status  
**Filters**: Date range, Status  
**Use Case**: Budget tracking and supplier performance

#### 7. Monthly Inventory Value
**Category**: Financial  
**Description**: Total inventory value by category  
**Fields**: Category, Total Items, Total Quantity, Total Value  
**Aggregation**: SUM(quantity * unitCost) GROUP BY category  
**Use Case**: Financial reporting

#### 8. Patient Visit Trends
**Category**: Medical  
**Description**: Patient visit frequency over time  
**Fields**: Date, Visit Count, New Patients, Return Patients  
**Visualization**: Line Chart  
**Use Case**: Capacity planning

---

## 🗄️ Data Sources

### Inventory Items

**Description**: Current inventory stock levels and item details

**Available Fields**:
| Field | Type | Filterable | Sortable | Description |
|-------|------|------------|----------|-------------|
| itemCode | String | ✅ | ✅ | Unique item identifier |
| itemName | String | ✅ | ✅ | Item name/description |
| category | String | ✅ | ✅ | Item category |
| subType | Enum | ✅ | ✅ | Supplied or Donated |
| unit | String | ✅ | ✅ | Unit of measure |
| totalQuantity | Number | ✅ | ✅ | Total stock |
| availableQuantity | Number | ✅ | ✅ | Available for use |
| reorderLevel | Number | ✅ | ✅ | Minimum stock level |
| unitCost | Currency | ✅ | ✅ | Cost per unit |

**Common Use Cases**:
- Stock level monitoring
- Low stock alerts
- Inventory valuation
- Category analysis

---

### Inventory Transactions

**Description**: All inventory movements and transaction history

**Available Fields**:
| Field | Type | Filterable | Sortable | Description |
|-------|------|------------|----------|-------------|
| transactionNumber | String | ✅ | ✅ | Unique transaction ID |
| transactionDate | Date | ✅ | ✅ | Transaction date |
| type | Enum | ✅ | ✅ | Transaction type |
| itemId | String | ✅ | ✅ | Item reference |
| itemName | String | ✅ | ✅ | Item name |
| batchNumber | String | ✅ | ✅ | Batch identifier |
| quantity | Number | ✅ | ✅ | Quantity moved |
| beginningQuantity | Number | ✅ | ✅ | Stock before |
| endingQuantity | Number | ✅ | ✅ | Stock after |
| performedBy | String | ✅ | ✅ | User who performed |
| reason | String | ✅ | ❌ | Transaction reason |

**Transaction Types**:
- `warehouse_receiving` - Incoming stock
- `dispense` - Issued to patients/departments
- `transfer_out` - Sent to other facilities
- `transfer_in` - Received from other facilities
- `adjustment` - Stock corrections
- `disposal` - Expired/damaged items

**Common Use Cases**:
- Audit trails
- Movement analysis
- User activity tracking
- Dispensing patterns

---

### Patients

**Description**: Patient demographics and registration information

**Available Fields**:
| Field | Type | Filterable | Sortable | Description |
|-------|------|------------|----------|-------------|
| patientId | String | ✅ | ✅ | Unique patient ID |
| firstName | String | ✅ | ✅ | First name |
| middleName | String | ✅ | ✅ | Middle name |
| lastName | String | ✅ | ✅ | Last name |
| dateOfBirth | Date | ✅ | ✅ | Birth date |
| age | Number | ✅ | ✅ | Current age |
| gender | Enum | ✅ | ✅ | Male/Female/Other |
| barangay | String | ✅ | ✅ | Barangay of residence |
| municipality | String | ✅ | ✅ | Municipality |
| contactNumber | String | ✅ | ❌ | Phone number |
| bloodType | String | ✅ | ✅ | Blood type |
| status | Enum | ✅ | ✅ | Active/Inactive/Deceased |
| registrationDate | Date | ✅ | ✅ | Registration date |

**Common Use Cases**:
- Population demographics
- Age/gender distribution
- Geographic analysis
- Registration trends

---

### Disease Cases

**Description**: Disease surveillance and case tracking data

**Available Fields**:
| Field | Type | Filterable | Sortable | Description |
|-------|------|------------|----------|-------------|
| patientId | String | ✅ | ✅ | Patient reference |
| disease | String | ✅ | ✅ | Disease name |
| diagnosisDate | Date | ✅ | ✅ | Diagnosis date |
| barangay | String | ✅ | ✅ | Case location |
| status | Enum | ✅ | ✅ | Active/Recovered/Deceased |
| severity | Enum | ✅ | ✅ | Mild/Moderate/Severe |
| isNotifiable | Boolean | ✅ | ✅ | Requires DOH reporting |
| reportedDate | Date | ✅ | ✅ | Report date |
| symptoms | String | ✅ | ❌ | Symptom description |

**Common Use Cases**:
- Outbreak detection
- Disease patterns
- Geographic clustering
- Severity analysis

---

### Purchase Orders

**Description**: Procurement orders and spending analysis

**Available Fields**:
| Field | Type | Filterable | Sortable | Description |
|-------|------|------------|----------|-------------|
| poNumber | String | ✅ | ✅ | PO number |
| date | Date | ✅ | ✅ | Order date |
| supplierId | String | ✅ | ✅ | Supplier reference |
| supplierName | String | ✅ | ✅ | Supplier name |
| status | Enum | ✅ | ✅ | Order status |
| subtotal | Currency | ✅ | ✅ | Subtotal amount |
| tax | Currency | ✅ | ✅ | Tax amount |
| total | Currency | ✅ | ✅ | Total amount |
| itemCount | Number | ✅ | ✅ | Number of items |
| expectedDelivery | Date | ✅ | ✅ | Expected delivery date |
| createdBy | String | ✅ | ✅ | Created by user |

**Common Use Cases**:
- Spending analysis
- Supplier performance
- Budget tracking
- Procurement trends

---

## 🔍 Filter System

### Filter Operators

#### String Operators
- **Equals**: Exact match (case-sensitive)
- **Not Equals**: Exclude exact matches
- **Contains**: Partial match anywhere in text
- **Not Contains**: Exclude partial matches
- **Starts With**: Match beginning of text
- **Ends With**: Match end of text
- **Is Empty**: Field has no value
- **Is Not Empty**: Field has a value

#### Number Operators
- **Equals**: Exact numeric match
- **Not Equals**: Different from value
- **Greater Than**: > value
- **Less Than**: < value
- **Greater Than or Equal**: >= value
- **Less Than or Equal**: <= value
- **Between**: Between two values (inclusive)
- **Is Empty**: NULL value
- **Is Not Empty**: Has a value

#### Date Operators
- **Equals**: Exact date match
- **Greater Than**: After date
- **Less Than**: Before date
- **Between**: Date range
- **Is Today**: Current date
- **Is This Week**: Current week
- **Is This Month**: Current month
- **Is This Year**: Current year

### Logical Operators

**AND**: All conditions must be true
```
Filter 1: category = "Medicine"
AND
Filter 2: availableQuantity < 100

Result: Medicines with less than 100 units
```

**OR**: Any condition can be true
```
Filter 1: status = "Pending"
OR
Filter 2: status = "Approved"

Result: Orders that are pending OR approved
```

### Complex Filter Examples

#### Example 1: Critical Stock Alert
```
Field: category = "Essential Medicine"
AND
Field: availableQuantity < reorderLevel
AND
Field: status = "Active"
```

#### Example 2: Recent High-Value Orders
```
Field: date >= [Last 30 days]
AND
Field: total > 50000
AND
(
  Field: status = "Completed"
  OR
  Field: status = "Approved"
)
```

#### Example 3: Outbreak Detection
```
Field: disease = "Dengue"
AND
Field: diagnosisDate >= [Last 7 days]
AND
Field: barangay = "Poblacion"
AND
Field: severity IN ["Moderate", "Severe"]
```

---

## 📊 Visualization Options

### Table View (Default)

**Best For**: Detailed data inspection, exports

**Features**:
- Sortable columns
- Searchable
- Pagination
- Row highlighting
- Column resizing
- Fixed headers

**Configuration**:
- Column order
- Column width
- Alignment (left/center/right)
- Number formatting
- Date formatting

---

### Bar Chart

**Best For**: Comparing values across categories

**Configuration**:
- X-axis: Category field
- Y-axis: Numeric field
- Color scheme
- Horizontal/Vertical
- Stacked/Grouped
- Data labels

**Example Use Cases**:
- Items by category
- Cases by barangay
- Spending by supplier

---

### Pie Chart

**Best For**: Showing proportions and percentages

**Configuration**:
- Value field: What to measure
- Label field: Category names
- Show percentages
- Show legends
- Color palette
- Donut style

**Example Use Cases**:
- Stock distribution by category
- Gender distribution
- Disease prevalence

---

### Line Chart

**Best For**: Trends over time

**Configuration**:
- X-axis: Date/Time field
- Y-axis: Numeric field
- Multiple series
- Smoothing
- Markers
- Zoom/Pan

**Example Use Cases**:
- Daily transactions
- Case trends
- Stock levels over time

---

### Pivot Table

**Best For**: Multi-dimensional analysis

**Configuration**:
- Row fields: Group by
- Column fields: Cross-tabulate
- Value fields: Aggregate
- Aggregation: Sum, Avg, Count, Min, Max

**Example**:
```
Rows: Barangay
Columns: Disease
Values: Count of Cases
Result: Cases by disease per barangay
```

---

### Summary Cards

**Best For**: Key metrics dashboard

**Configuration**:
- Metric fields
- Aggregation functions
- Icons
- Colors
- Comparison values
- Sparklines

**Example**:
```
Card 1: Total Inventory Value
Card 2: Low Stock Items Count
Card 3: Pending Orders
Card 4: Today's Transactions
```

---

## 💾 Export Formats

### PDF Export

**Features**:
- Professional formatting
- Header with logo
- Footer with page numbers
- Date/time stamp
- Filter summary
- Charts included

**Best For**:
- Printing
- Official documentation
- Archiving

**Settings**:
- Page size (A4, Letter, Legal)
- Orientation (Portrait, Landscape)
- Margins
- Header/Footer content

---

### Excel Export

**Features**:
- Formatted workbook
- Multiple sheets
- Formulas preserved
- Charts included
- Auto-filter enabled
- Freeze panes

**Best For**:
- Further analysis
- Pivot tables
- Custom calculations

**Includes**:
- Data sheet
- Summary sheet
- Chart sheet (if applicable)
- Filter documentation sheet

---

### CSV Export

**Features**:
- Plain text
- Comma-delimited
- UTF-8 encoding
- Headers included

**Best For**:
- Database import
- External systems
- Lightweight transfer

**Note**: Charts and formatting not included

---

## ⏰ Scheduling Reports

### Schedule Configuration

#### Frequency Options
- **Daily**: Every day at specified time
- **Weekly**: Specific day(s) of week
- **Monthly**: Specific day of month
- **Quarterly**: First day of quarter
- **Annually**: Specific date each year

#### Time Selection
- Hour: 00-23
- Minute: 00, 15, 30, 45
- Timezone: Server timezone

#### Recipients
- Multiple email addresses
- Distribution lists
- Role-based (e.g., all Super Admins)

#### Output Format
- Choose from PDF, Excel, CSV
- Multiple formats per schedule

### Example Schedules

**Daily Stock Report**
```
Frequency: Daily
Time: 08:00 AM
Recipients: inventory@dalaguete.gov.ph
Format: PDF
Subject: Daily Inventory Stock Report - {{date}}
```

**Weekly Disease Surveillance**
```
Frequency: Weekly
Day: Monday
Time: 09:00 AM
Recipients: medical-team@dalaguete.gov.ph
Format: Excel
Subject: Weekly Disease Surveillance Summary
```

**Monthly Procurement Summary**
```
Frequency: Monthly
Day: 1st of month
Time: 10:00 AM
Recipients: admin@dalaguete.gov.ph, gso@dalaguete.gov.ph
Format: PDF, Excel
Subject: Monthly Procurement Report - {{month}} {{year}}
```

---

## 🔧 API Documentation

### Create Report Configuration

```http
POST /api/reports/configurations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Low Stock Alert",
  "description": "Items below reorder level",
  "dataSource": "inventory_items",
  "selectedFields": ["itemCode", "itemName", "availableQuantity", "reorderLevel"],
  "filters": [
    {
      "fieldId": "availableQuantity",
      "operator": "less_than",
      "value": "reorderLevel"
    }
  ],
  "visualization": "table",
  "sorting": [
    {
      "fieldId": "availableQuantity",
      "direction": "asc"
    }
  ]
}
```

### Generate Report

```http
POST /api/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "configurationId": "config-123",
  "filters": [],
  "dateRange": {
    "type": "last_30_days"
  },
  "format": "json"
}
```

### Export Report

```http
POST /api/reports/{reportId}/export
Authorization: Bearer {token}
Content-Type: application/json

{
  "format": "pdf",
  "includeCharts": true,
  "includeRawData": true
}
```

---

## 🛠️ Technical Implementation

### Type Definitions

```typescript
interface ReportConfiguration {
  id: string;
  name: string;
  description?: string;
  dataSource: DataSourceType;
  selectedFields: string[];
  filters: ReportFilter[];
  sorting: ReportSort[];
  grouping?: ReportGrouping;
  visualization: VisualizationType;
  schedule?: ReportSchedule;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportFilter {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface ReportSort {
  fieldId: string;
  direction: 'asc' | 'desc';
  priority: number;
}
```

### Query Generation

```typescript
function generateQuery(config: ReportConfiguration): string {
  const fields = config.selectedFields.join(', ');
  const table = getTableName(config.dataSource);
  const where = buildWhereClause(config.filters);
  const orderBy = buildOrderByClause(config.sorting);
  
  return `
    SELECT ${fields}
    FROM ${table}
    WHERE ${where}
    ORDER BY ${orderBy}
  `;
}
```

---

## 📝 Best Practices

### Report Design

1. **Start Simple**: Begin with basic reports, add complexity gradually
2. **Name Clearly**: Use descriptive names that explain the report's purpose
3. **Document Filters**: Explain what filters do in the description
4. **Test First**: Preview before scheduling
5. **Optimize Performance**: Limit fields and records when possible

### Performance Tips

- Index frequently filtered fields
- Limit date ranges for large datasets
- Use aggregation for summary reports
- Schedule large reports during off-peak hours
- Cache frequently run reports

### Security Guidelines

- Only share reports with authorized users
- Don't include sensitive data in scheduled emails
- Review permissions regularly
- Use secure export methods
- Audit report access

---

## 🐛 Troubleshooting

### Issue: Report Takes Too Long

**Causes**:
- Large dataset
- Complex filters
- Multiple joins

**Solutions**:
- Add date range filters
- Reduce selected fields
- Add database indexes
- Run during off-peak hours

---

### Issue: No Data in Results

**Causes**:
- Filters too restrictive
- Data source empty
- Permission issues

**Solutions**:
- Check filter logic
- Remove filters one by one
- Verify data exists
- Check user permissions

---

### Issue: Export Fails

**Causes**:
- File size too large
- Timeout
- Disk space

**Solutions**:
- Reduce record count
- Split into multiple reports
- Contact system admin

---

### Issue: Scheduled Report Not Sent

**Causes**:
- Email service down
- Invalid recipients
- Report generation failed

**Solutions**:
- Check email configuration
- Verify recipient addresses
- Review error logs
- Test report manually

---

## 📞 Support

### For Report Issues
- Email: reports@dalaguete.gov.ph
- Phone: (032) XXX-XXXX ext. 205

### For Technical Support
- Email: support@dalaguete.gov.ph
- Documentation: See USER_MANAGEMENT_GUIDE.md

---

**Version**: 2.0  
**Last Updated**: January 13, 2025  
**Status**: ✅ Active Development