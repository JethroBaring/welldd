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
  const [reports, setReports] = useState<IntegratedReport[]>(mockIntegratedReports);
  const [filteredReports, setFilteredReports] = useState<IntegratedReport[]>(mockIntegratedReports);
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

  const handleGenerateReport = (report: IntegratedReport) => {
    // Mock report generation
    setReports(prev => prev.map(r =>
      r.id === report.id ? { ...r, status: "generating" as const } : r
    ));

    setTimeout(() => {
      setReports(prev => prev.map(r =>
        r.id === report.id ? { ...r, status: "ready" as const, lastGenerated: new Date() } : r
      ));
      toast.success(`${report.name} generated successfully`);
    }, 2000);
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Integrated Reports</h1>
          <p className="text-sm text-muted-foreground">
            Combined reports from DIGITS ERP inventory and WellSync patient data
          </p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Generate All Reports
        </Button>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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

            <div className="space-y-2 lg:col-span-2">
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
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports ({filteredReports.length})</CardTitle>
          <CardDescription>
            Select a report to view details, generate, or export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Last Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No reports found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const StatusIcon = getStatusIcon(report.status);
                    return (
                      <TableRow key={report.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 mt-0.5 text-purple-500" />
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {getReportTypeLabel(report.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            {report.dataSource}
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.recordCount ? report.recordCount.toLocaleString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {report.lastGenerated ? format(report.lastGenerated, "MMM dd, yyyy") : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${getStatusColor(report.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="capitalize">{report.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateReport(report)}
                              disabled={report.status === "generating"}
                            >
                              {report.status === "generating" ? "Generating..." : "Generate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintReport(report.id)}
                              disabled={report.status !== "ready"}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportReport(report.id, "csv")}
                              disabled={report.status !== "ready"}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              CSV
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportReport(report.id, "pdf")}
                              disabled={report.status !== "ready"}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Integration</CardTitle>
          <CardDescription>DOH/iClinicSys/eLMIS compliant export formats and stakeholder integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">PDF Export</h4>
                <p className="text-sm text-muted-foreground">
                  Printable reports with charts, graphs, and proper formatting
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">CSV Export</h4>
                <p className="text-sm text-muted-foreground">
                  DOH/iClinicSys/eLMIS compliant CSV with proper encoding and headers
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Stakeholder Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Direct integration with Mayor's Office, Accounting, and Treasury portals
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}