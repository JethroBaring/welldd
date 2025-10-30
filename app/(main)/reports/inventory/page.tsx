"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Printer, Package, Search, Filter, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryReport {
  id: string;
  name: string;
  type: "received" | "dispensed" | "expired" | "low_stock" | "expiring_soon" | "stock_movement";
  description: string;
  lastGenerated?: Date;
  status: "ready" | "generating" | "error";
  recordCount?: number;
  dataSource: string;
}

interface InventoryReportData {
  id: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  supplier?: string;
  expiryDate?: Date;
  receivedDate?: Date;
  department?: string;
  status: string;
}

const mockInventoryReportData: InventoryReportData[] = [
  {
    id: "inv-data-001",
    itemCode: "PAR001",
    itemName: "Paracetamol 500mg",
    batchNumber: "BATCH001",
    quantity: 1000,
    unit: "Tablets",
    supplier: "MediCare Pharma",
    expiryDate: new Date("2025-12-31"),
    receivedDate: new Date("2024-10-15"),
    department: "Pharmacy",
    status: "Active",
  },
  {
    id: "inv-data-002",
    itemCode: "IBU002",
    itemName: "Ibuprofen 400mg",
    batchNumber: "BATCH002",
    quantity: 500,
    unit: "Tablets",
    supplier: "HealthPlus Corp",
    expiryDate: new Date("2025-08-15"),
    receivedDate: new Date("2024-10-10"),
    department: "Pharmacy",
    status: "Active",
  },
  {
    id: "inv-data-003",
    itemCode: "AME003",
    itemName: "Amoxicillin 250mg",
    batchNumber: "BATCH003",
    quantity: 200,
    unit: "Capsules",
    supplier: "BioMed Supplies",
    expiryDate: new Date("2024-11-30"),
    receivedDate: new Date("2024-09-20"),
    department: "Emergency",
    status: "Expiring",
  },
  {
    id: "inv-data-004",
    itemCode: "OME004",
    itemName: "Omeprazole 20mg",
    batchNumber: "BATCH004",
    quantity: 50,
    unit: "Capsules",
    supplier: "MediCare Pharma",
    expiryDate: new Date("2024-09-15"),
    receivedDate: new Date("2024-07-10"),
    department: "Internal Medicine",
    status: "Expired",
  },
  {
    id: "inv-data-005",
    itemCode: "LOS005",
    itemName: "Losartan 50mg",
    batchNumber: "BATCH005",
    quantity: 300,
    unit: "Tablets",
    supplier: "HealthPlus Corp",
    expiryDate: new Date("2026-02-28"),
    receivedDate: new Date("2024-10-05"),
    department: "Pharmacy",
    status: "Active",
  },
];

const mockInventoryReports: InventoryReport[] = [
  {
    id: "inv-001",
    name: "Items Received (WRR)",
    type: "received",
    description: "Warehouse receiving reports with batch details and supplier information",
    lastGenerated: new Date("2024-10-28"),
    status: "ready",
    recordCount: 245,
    dataSource: "DIGITS ERP",
  },
  {
    id: "inv-002",
    name: "Items Dispensed",
    type: "dispensed",
    description: "Medicine dispensing records following FIFO/FEFO principles",
    lastGenerated: new Date("2024-10-27"),
    status: "ready",
    recordCount: 1890,
    dataSource: "DIGITS ERP",
  },
  {
    id: "inv-003",
    name: "Expired Items Report",
    type: "expired",
    description: "Items past expiration with disposal recommendations and value loss",
    lastGenerated: new Date("2024-10-26"),
    status: "ready",
    recordCount: 23,
    dataSource: "DIGITS ERP",
  },
  {
    id: "inv-004",
    name: "Low Stock Alert",
    type: "low_stock",
    description: "Items below reorder level requiring immediate procurement action",
    lastGenerated: new Date("2024-10-25"),
    status: "ready",
    recordCount: 15,
    dataSource: "DIGITS ERP",
  },
  {
    id: "inv-005",
    name: "Expiring Soon (180 days)",
    type: "expiring_soon",
    description: "Items approaching expiration within 180 days, prioritized by FEFO",
    lastGenerated: new Date("2024-10-24"),
    status: "ready",
    recordCount: 67,
    dataSource: "DIGITS ERP",
  },
  {
    id: "inv-006",
    name: "Stock Movement Audit",
    type: "stock_movement",
    description: "Complete audit trail of all inventory transactions and adjustments",
    lastGenerated: new Date("2024-10-23"),
    status: "generating",
    dataSource: "DIGITS ERP",
  },
];

export default function InventoryReportsPage() {
  const [reports, setReports] = useState<InventoryReport[]>(mockInventoryReports);
  const [filteredReports, setFilteredReports] = useState<InventoryReport[]>(mockInventoryReports);
  const [reportData, setReportData] = useState<InventoryReportData[]>([]);
  const [showReportData, setShowReportData] = useState<boolean>(false);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedReport, setSelectedReport] = useState<InventoryReport | null>(null);

  useEffect(() => {
    filterReports();
  }, [reportTypeFilter, searchQuery, dateFrom, dateTo, reports]);

  const filterReports = () => {
    let filtered = reports;

    // Filter by report type
    if (reportTypeFilter !== "all") {
      filtered = filtered.filter(report => report.type === reportTypeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
      );
    }

    // Filter by date range (last generated)
    if (dateFrom || dateTo) {
      filtered = filtered.filter(report => {
        if (!report.lastGenerated) return false;
        if (dateFrom && report.lastGenerated < dateFrom) return false;
        if (dateTo && report.lastGenerated > dateTo) return false;
        return true;
      });
    }

    setFilteredReports(filtered);
  };

  
  const handleExportReport = (reportId: string, format: "csv" | "pdf") => {
    toast.success(`Exporting ${format.toUpperCase()}...`);
  };

  const handlePrintReport = (reportId: string) => {
    toast.success("Opening print dialog...");
  };

  const clearFilters = () => {
    setReportTypeFilter("all");
    setSearchQuery("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "received": return "Items Received";
      case "dispensed": return "Items Dispensed";
      case "expired": return "Expired Items";
      case "low_stock": return "Low Stock";
      case "expiring_soon": return "Expiring Soon";
      case "stock_movement": return "Stock Movement";
      default: return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return FileText;
      case "generating": return TrendingUp;
      case "error": return AlertTriangle;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "text-green-500";
      case "generating": return "text-yellow-500";
      case "error": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Reports</h1>
          <p className="text-sm text-muted-foreground">
            DIGITS ERP inventory data reports with export capabilities
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Filter inventory reports by type, date range, and search criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="received">Items Received</SelectItem>
                  <SelectItem value="dispensed">Items Dispensed</SelectItem>
                  <SelectItem value="expired">Expired Items</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="stock_movement">Stock Movement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={dateFrom ? format(dateFrom, "yyyy-MM-dd") : ""}
                onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={dateTo ? format(dateTo, "yyyy-MM-dd") : ""}
                onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => {
                if (reportTypeFilter !== "all") {
                  setShowReportData(true);
                  setReportData(mockInventoryReportData);
                  toast.success(`Generated ${getReportTypeLabel(reportTypeFilter)} report successfully`);
                } else {
                  toast.error("Please select a report type first");
                }
              }}
              disabled={reportTypeFilter === "all"}
            >
              <Package className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Data Table */}
      {showReportData ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {reportTypeFilter !== "all" ? getReportTypeLabel(reportTypeFilter) : "Inventory"} Report Data
            </CardTitle>
            <CardDescription>
              Detailed inventory data from DIGITS ERP system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No data available for the selected report type
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.itemCode}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell>{item.quantity.toLocaleString()}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.supplier || "N/A"}</TableCell>
                        <TableCell>
                          {item.expiryDate ? format(item.expiryDate, "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {item.receivedDate ? format(item.receivedDate, "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{item.department || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "Active" ? "default" :
                                    item.status === "Expired" ? "destructive" :
                                    item.status === "Expiring" ? "secondary" : "outline"}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => handleExportReport("current", "csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport("current", "pdf")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePrintReport("current")}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReportData(false)}
              >
                Back to Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <Package className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Generate a Report to View Data</h3>
                <p className="text-muted-foreground mt-2">
                  Select a report type from the filters above and click "Generate Report" to view inventory data from DIGITS ERP.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

