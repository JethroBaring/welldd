"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Package,
  Users,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  Database,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";

interface Report {
  id: string;
  name: string;
  type: "inventory" | "patient" | "integrated";
  description: string;
  lastGenerated?: Date;
  status: "ready" | "generating" | "error";
  dataSource: string;
  stakeholderIntegration?: string;
}

const mockReports: Report[] = [
  {
    id: "inv-001",
    name: "Monthly Inventory Summary",
    type: "inventory",
    description: "Comprehensive inventory levels, received items, and stock movements",
    lastGenerated: new Date("2024-10-25"),
    status: "ready",
    dataSource: "DIGITS ERP",
    stakeholderIntegration: "Accounting Department",
  },
  {
    id: "inv-002",
    name: "Expired Items Report",
    type: "inventory",
    description: "Items approaching or past expiration with disposal recommendations",
    lastGenerated: new Date("2024-10-28"),
    status: "ready",
    dataSource: "DIGITS ERP",
    stakeholderIntegration: "Mayor's Office",
  },
  {
    id: "inv-003",
    name: "Supplier Performance Analysis",
    type: "inventory",
    description: "Supplier delivery times, quality metrics, and contract compliance",
    lastGenerated: new Date("2024-10-20"),
    status: "ready",
    dataSource: "DIGITS ERP",
    stakeholderIntegration: "Procurement Office",
  },
  {
    id: "pat-001",
    name: "Patient Demographics Summary",
    type: "patient",
    description: "Age distribution, gender breakdown, and barangay analysis",
    lastGenerated: new Date("2024-10-27"),
    status: "ready",
    dataSource: "WellSync",
    stakeholderIntegration: "DOH Compliance",
  },
  {
    id: "pat-002",
    name: "Prescription Fulfillment Report",
    type: "patient",
    description: "Prescription dispensing patterns and medication availability",
    lastGenerated: new Date("2024-10-26"),
    status: "ready",
    dataSource: "WellSync",
    stakeholderIntegration: "PhilHealth",
  },
  {
    id: "int-001",
    name: "Medicine Dispensing vs Consumption",
    type: "integrated",
    description: "Correlation between patient diagnoses and inventory consumption",
    lastGenerated: new Date("2024-10-24"),
    status: "ready",
    dataSource: "DIGITS ERP + WellSync",
    stakeholderIntegration: "Treasury Department",
  },
  {
    id: "int-002",
    name: "Prescription Fulfillment Rates",
    type: "integrated",
    description: "Analysis of prescription completion and stock availability impact",
    lastGenerated: new Date("2024-10-23"),
    status: "generating",
    dataSource: "DIGITS ERP + WellSync",
    stakeholderIntegration: "DOH/iClinicSys",
  },
];

export default function ReportsPage() {
  const { getPermissions } = useAuthStore();
  const permissions = getPermissions();

  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [dataSourceFilter, setDataSourceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  useEffect(() => {
    filterReports();
  }, [reportTypeFilter, dataSourceFilter, searchQuery, dateFrom, dateTo, reports]);

  const filterReports = () => {
    let filtered = reports;

    // Filter by report type
    if (reportTypeFilter !== "all") {
      filtered = filtered.filter(report => report.type === reportTypeFilter);
    }

    // Filter by data source
    if (dataSourceFilter !== "all") {
      filtered = filtered.filter(report => report.dataSource.includes(dataSourceFilter));
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

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "inventory": return Package;
      case "patient": return Users;
      case "integrated": return TrendingUp;
      default: return FileText;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "inventory": return "text-blue-500";
      case "patient": return "text-green-500";
      case "integrated": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return CheckCircle;
      case "generating": return Clock;
      case "error": return AlertCircle;
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

  const handleExportReport = (reportId: string, format: "csv" | "pdf") => {
    // Mock export functionality
    console.log(`Exporting report ${reportId} as ${format}`);
  };

  const handlePrintReport = (reportId: string) => {
    // Mock print functionality
    console.log(`Printing report ${reportId}`);
  };

  const clearFilters = () => {
    setReportTypeFilter("all");
    setDataSourceFilter("all");
    setSearchQuery("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export integrated reports from DIGITS ERP and WellSync
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports/custom">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Custom Builder
            </Button>
          </Link>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Report
          </Button>
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
            Filter reports by type, data source, date range, and search criteria
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
                  <SelectItem value="inventory">Inventory Reports</SelectItem>
                  <SelectItem value="patient">Patient Reports</SelectItem>
                  <SelectItem value="integrated">Integrated Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Source</label>
              <Select value={dataSourceFilter} onValueChange={setDataSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="DIGITS ERP">DIGITS ERP</SelectItem>
                  <SelectItem value="WellSync">WellSync</SelectItem>
                  <SelectItem value="DIGITS ERP + WellSync">Integrated</SelectItem>
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
          </div>

          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
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
                  <TableHead>Last Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stakeholder Integration</TableHead>
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
                    const TypeIcon = getReportTypeIcon(report.type);
                    const StatusIcon = getStatusIcon(report.status);
                    return (
                      <TableRow key={report.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <TypeIcon className={`h-5 w-5 mt-0.5 ${getReportTypeColor(report.type)}`} />
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            {report.dataSource}
                          </div>
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
                        <TableCell>
                          {report.stakeholderIntegration && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {report.stakeholderIntegration}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
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
                            <Link href={`/${report.type === "inventory" ? "reports/inventory" : report.type === "patient" ? "reports/medical" : "reports/integrated"}`}>
                              <Button variant="noHover" size="sm">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
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
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Available export formats and compliance standards</CardDescription>
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
                  DOH/iClinicSys/eLMIS compliant CSV files with proper encoding
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

