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
import { CalendarIcon, Download, FileText, Printer, Users, Search, Filter, TrendingUp, AlertTriangle } from "lucide-react";
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

interface MedicalReport {
  id: string;
  name: string;
  type: "demographics" | "consultations" | "diagnoses" | "prescriptions" | "age_distribution" | "barangay_distribution";
  description: string;
  lastGenerated?: Date;
  status: "ready" | "generating" | "error";
  recordCount?: number;
  dataSource: string;
}

const mockMedicalReports: MedicalReport[] = [
  {
    id: "med-001",
    name: "Patient Demographics Summary",
    type: "demographics",
    description: "Complete patient demographics including age, gender, and registration details",
    lastGenerated: new Date("2024-10-28"),
    status: "ready",
    recordCount: 2847,
    dataSource: "WellSync",
  },
  {
    id: "med-002",
    name: "Consultation Records",
    type: "consultations",
    description: "All patient consultations with attending physicians and chief complaints",
    lastGenerated: new Date("2024-10-27"),
    status: "ready",
    recordCount: 1890,
    dataSource: "WellSync",
  },
  {
    id: "med-003",
    name: "Common Diagnoses Analysis",
    type: "diagnoses",
    description: "Most frequent diagnoses to track disease patterns and public health trends",
    lastGenerated: new Date("2024-10-26"),
    status: "ready",
    recordCount: 156,
    dataSource: "WellSync",
  },
  {
    id: "med-004",
    name: "Prescription Analysis",
    type: "prescriptions",
    description: "All prescriptions issued with medication names and quantities for inventory planning",
    lastGenerated: new Date("2024-10-25"),
    status: "ready",
    recordCount: 3245,
    dataSource: "WellSync",
  },
  {
    id: "med-005",
    name: "Age Distribution Report",
    type: "age_distribution",
    description: "Patient age distribution analysis for program planning and resource allocation",
    lastGenerated: new Date("2024-10-24"),
    status: "ready",
    recordCount: 2847,
    dataSource: "WellSync",
  },
  {
    id: "med-006",
    name: "Barangay Distribution",
    type: "barangay_distribution",
    description: "Patient distribution across barangays to identify high healthcare demand areas",
    lastGenerated: new Date("2024-10-23"),
    status: "generating",
    dataSource: "WellSync",
  },
];

export default function MedicalReportsPage() {
  const [reports, setReports] = useState<MedicalReport[]>(mockMedicalReports);
  const [filteredReports, setFilteredReports] = useState<MedicalReport[]>(mockMedicalReports);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

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

  const handleGenerateReport = (report: MedicalReport) => {
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
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "demographics": return "Demographics";
      case "consultations": return "Consultations";
      case "diagnoses": return "Diagnoses";
      case "prescriptions": return "Prescriptions";
      case "age_distribution": return "Age Distribution";
      case "barangay_distribution": return "Barangay Distribution";
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
          <h1 className="text-2xl font-semibold">Medical Reports</h1>
          <p className="text-sm text-muted-foreground">
            WellSync patient data reports with demographic analysis
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
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
            Filter medical reports by type, date range, and search criteria
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
                  <SelectItem value="demographics">Patient Demographics</SelectItem>
                  <SelectItem value="consultations">Consultations</SelectItem>
                  <SelectItem value="diagnoses">Common Diagnoses</SelectItem>
                  <SelectItem value="prescriptions">Prescriptions</SelectItem>
                  <SelectItem value="age_distribution">Age Distribution</SelectItem>
                  <SelectItem value="barangay_distribution">Barangay Distribution</SelectItem>
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
                            <Users className="h-5 w-5 mt-0.5 text-green-500" />
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
                            <FileText className="h-4 w-4 text-muted-foreground" />
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
    </div>
  );
}

