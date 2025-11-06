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
import { CalendarIcon, Download, FileText, Printer, TrendingUp, Search, Filter, Database, AlertTriangle } from "lucide-react";
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

interface IntegratedReport {
  id: string;
  name: string;
  type: "dispensing-patterns" | "consumption-analysis" | "fulfillment-rates";
  description: string;
  lastGenerated?: Date;
  status: "ready" | "generating" | "error";
  recordCount?: number;
  dataSource: string;
}

interface IntegratedReportData {
  id: string;
  medicationName: string;
  diagnosis: string;
  prescribedQuantity: number;
  dispensedQuantity: number;
  fulfillmentRate: number;
  department: string;
  month: string;
  year: number;
  consumptionTrend: string;
  averageWaitTime: number;
}

const mockIntegratedReportData: IntegratedReportData[] = [
  {
    id: "int-data-001",
    medicationName: "Paracetamol 500mg",
    diagnosis: "Upper Respiratory Tract Infection",
    prescribedQuantity: 1500,
    dispensedQuantity: 1450,
    fulfillmentRate: 96.7,
    department: "Internal Medicine",
    month: "October",
    year: 2024,
    consumptionTrend: "Increasing",
    averageWaitTime: 15,
  },
  {
    id: "int-data-002",
    medicationName: "Amoxicillin 500mg",
    diagnosis: "Bacterial Infections",
    prescribedQuantity: 800,
    dispensedQuantity: 780,
    fulfillmentRate: 97.5,
    department: "Emergency",
    month: "October",
    year: 2024,
    consumptionTrend: "Stable",
    averageWaitTime: 20,
  },
  {
    id: "int-data-003",
    medicationName: "Losartan 50mg",
    diagnosis: "Hypertension",
    prescribedQuantity: 1200,
    dispensedQuantity: 1180,
    fulfillmentRate: 98.3,
    department: "Internal Medicine",
    month: "October",
    year: 2024,
    consumptionTrend: "Increasing",
    averageWaitTime: 10,
  },
  {
    id: "int-data-004",
    medicationName: "Salbutamol Inhaler",
    diagnosis: "Asthma",
    prescribedQuantity: 300,
    dispensedQuantity: 285,
    fulfillmentRate: 95.0,
    department: "Pediatrics",
    month: "October",
    year: 2024,
    consumptionTrend: "Stable",
    averageWaitTime: 25,
  },
  {
    id: "int-data-005",
    medicationName: "Metformin 500mg",
    diagnosis: "Type 2 Diabetes",
    prescribedQuantity: 900,
    dispensedQuantity: 870,
    fulfillmentRate: 96.7,
    department: "Internal Medicine",
    month: "October",
    year: 2024,
    consumptionTrend: "Increasing",
    averageWaitTime: 18,
  },
];

const mockIntegratedReports: IntegratedReport[] = [
  {
    id: "int-001",
    name: "Medicine Dispensing Patterns",
    type: "dispensing-patterns",
    description: "Analysis of medicine dispensing patterns correlated with patient diagnoses",
    lastGenerated: new Date("2024-10-28"),
    status: "ready",
    recordCount: 1247,
    dataSource: "DIGITS ERP + WellSync",
  },
  {
    id: "int-002",
    name: "Diagnosis vs Consumption Analysis",
    type: "consumption-analysis",
    description: "Comparison between prescribed medications and actual inventory consumption",
    lastGenerated: new Date("2024-10-27"),
    status: "ready",
    recordCount: 892,
    dataSource: "DIGITS ERP + WellSync",
  },
  {
    id: "int-003",
    name: "Prescription Fulfillment Rates",
    type: "fulfillment-rates",
    description: "Prescription fulfillment rates by department with wait time analysis",
    lastGenerated: new Date("2024-10-26"),
    status: "ready",
    recordCount: 1640,
    dataSource: "DIGITS ERP + WellSync",
  },
  {
    id: "int-004",
    name: "Inventory vs Patient Demand",
    type: "consumption-analysis",
    description: "Correlation between inventory levels and patient medication requirements",
    lastGenerated: new Date("2024-10-25"),
    status: "ready",
    recordCount: 2156,
    dataSource: "DIGITS ERP + WellSync",
  },
  {
    id: "int-005",
    name: "Department-wise Medicine Usage",
    type: "dispensing-patterns",
    description: "Medicine dispensing patterns across different hospital departments",
    lastGenerated: new Date("2024-10-24"),
    status: "generating",
    dataSource: "DIGITS ERP + WellSync",
  },
];

export default function IntegratedReportsPage() {
  const [reports] = useState<IntegratedReport[]>(mockIntegratedReports);
  const [filteredReports, setFilteredReports] = useState<IntegratedReport[]>(mockIntegratedReports);
  const [reportData, setReportData] = useState<IntegratedReportData[]>([]);
  const [showReportData, setShowReportData] = useState<boolean>(false);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [department, setDepartment] = useState<string>("all");
  const [barangay, setBarangay] = useState<string>("all");

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
    setDepartment("all");
    setBarangay("all");
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "dispensing-patterns": return "Dispensing Patterns";
      case "consumption-analysis": return "Consumption Analysis";
      case "fulfillment-rates": return "Fulfillment Rates";
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
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Integrated Reports</h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive integrated reports combining DIGITS ERP inventory data with WellSync patient demographics. Features multi-dimensional filtering by date range, items/medicines, patient demographics, and department/cost centers with advanced search capabilities.
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
            Filter integrated reports by type, date range, department, barangay, and search criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dispensing-patterns">Dispensing Patterns</SelectItem>
                  <SelectItem value="consumption-analysis">Consumption Analysis</SelectItem>
                  <SelectItem value="fulfillment-rates">Fulfillment Rates</SelectItem>
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
              <label className="text-sm font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="obstetrics">Obstetrics</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Barangay</label>
              <Select value={barangay} onValueChange={setBarangay}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Barangays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Barangays</SelectItem>
                  <SelectItem value="poblacion">Poblacion</SelectItem>
                  <SelectItem value="san-antonio">San Antonio</SelectItem>
                  <SelectItem value="san-vicente">San Vicente</SelectItem>
                  <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                </SelectContent>
              </Select>
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
                  setReportData(mockIntegratedReportData);
                  toast.success(`Generated ${getReportTypeLabel(reportTypeFilter)} report successfully`);
                } else {
                  toast.error("Please select a report type first");
                }
              }}
              disabled={reportTypeFilter === "all"}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
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
              <TrendingUp className="h-5 w-5" />
              {reportTypeFilter !== "all" ? getReportTypeLabel(reportTypeFilter) : "Integrated"} Report Data
            </CardTitle>
            <CardDescription>
              Detailed integrated data from DIGITS ERP and WellSync systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication Name</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Prescribed Qty</TableHead>
                    <TableHead>Dispensed Qty</TableHead>
                    <TableHead>Fulfillment Rate</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Consumption Trend</TableHead>
                    <TableHead>Avg Wait Time (min)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No data available for the selected report type
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((data) => (
                      <TableRow key={data.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{data.medicationName}</TableCell>
                        <TableCell>{data.diagnosis}</TableCell>
                        <TableCell>{data.prescribedQuantity.toLocaleString()}</TableCell>
                        <TableCell>{data.dispensedQuantity.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${data.fulfillmentRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{data.fulfillmentRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{data.department}</TableCell>
                        <TableCell>{data.month} {data.year}</TableCell>
                        <TableCell>
                          <Badge
                            variant={data.consumptionTrend === "Increasing" ? "default" :
                                    data.consumptionTrend === "Stable" ? "secondary" :
                                    "outline"}
                          >
                            {data.consumptionTrend}
                          </Badge>
                        </TableCell>
                        <TableCell>{data.averageWaitTime}</TableCell>
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
                Clear Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Generate a Report to View Data</h3>
                <p className="text-muted-foreground mt-2">
                  Select a report type from the filters above and click "Generate Report" to view integrated data from DIGITS ERP and WellSync.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}