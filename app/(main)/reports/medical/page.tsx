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

interface PatientReportData {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  barangay: string;
  consultationDate: Date;
  diagnosis: string;
  prescription: string;
  attendingPhysician: string;
  department: string;
  status: string;
}

const mockPatientReportData: PatientReportData[] = [
  {
    id: "patient-001",
    patientId: "P-2024-1001",
    name: "Maria Santos",
    age: 35,
    gender: "Female",
    barangay: "Poblacion",
    consultationDate: new Date("2024-10-28"),
    diagnosis: "Upper Respiratory Tract Infection",
    prescription: "Paracetamol 500mg, Amoxicillin 500mg",
    attendingPhysician: "Dr. Reyes",
    department: "Internal Medicine",
    status: "Completed",
  },
  {
    id: "patient-002",
    patientId: "P-2024-1002",
    name: "Juan Dela Cruz",
    age: 42,
    gender: "Male",
    barangay: "San Antonio",
    consultationDate: new Date("2024-10-27"),
    diagnosis: "Hypertension Stage 1",
    prescription: "Losartan 50mg, Amlodipine 5mg",
    attendingPhysician: "Dr. Garcia",
    department: "Internal Medicine",
    status: "Follow-up Required",
  },
  {
    id: "patient-003",
    patientId: "P-2024-1003",
    name: "Ana Rodriguez",
    age: 28,
    gender: "Female",
    barangay: "San Vicente",
    consultationDate: new Date("2024-10-26"),
    diagnosis: "Acute Gastroenteritis",
    prescription: "ORS, Loperamide 2mg",
    attendingPhysician: "Dr. Santos",
    department: "Emergency",
    status: "Completed",
  },
  {
    id: "patient-004",
    patientId: "P-2024-1004",
    name: "Carlos Mendoza",
    age: 55,
    gender: "Male",
    barangay: "Santa Cruz",
    consultationDate: new Date("2024-10-25"),
    diagnosis: "Type 2 Diabetes Mellitus",
    prescription: "Metformin 500mg, Glimepiride 2mg",
    attendingPhysician: "Dr. Lopez",
    department: "Internal Medicine",
    status: "Ongoing Treatment",
  },
  {
    id: "patient-005",
    patientId: "P-2024-1005",
    name: "Sophia Chen",
    age: 8,
    gender: "Female",
    barangay: "Poblacion",
    consultationDate: new Date("2024-10-24"),
    diagnosis: "Pediatric Asthma",
    prescription: "Salbutamol 2mg/5ml, Montelukast 4mg",
    attendingPhysician: "Dr. Martinez",
    department: "Pediatrics",
    status: "Regular Check-up",
  },
];

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
  const [reports] = useState<MedicalReport[]>(mockMedicalReports);
  const [filteredReports, setFilteredReports] = useState<MedicalReport[]>(mockMedicalReports);
  const [reportData, setReportData] = useState<PatientReportData[]>([]);
  const [showReportData, setShowReportData] = useState<boolean>(false);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [patientName, setPatientName] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [barangayFilter, setBarangayFilter] = useState<string>("all");

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
    <div className="mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Medical Reports</h1>
          <p className="text-sm text-muted-foreground">
            WellSync patient demographics reports with age distribution, gender breakdown, location (barangay) analysis, and comprehensive multi-dimensional filtering. Integrates with departmental portals and stakeholder systems.
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
            Filter medical reports by type, date range, and search criteria
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
              <label className="text-sm font-medium">Age Range</label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="0-12">0-12 years</SelectItem>
                  <SelectItem value="13-18">13-18 years</SelectItem>
                  <SelectItem value="19-35">19-35 years</SelectItem>
                  <SelectItem value="36-50">36-50 years</SelectItem>
                  <SelectItem value="51+">51+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Barangay</label>
              <Select value={barangayFilter} onValueChange={setBarangayFilter}>
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

          {/* Advanced Search Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Advanced Search Options</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {showAdvancedSearch ? "Hide" : "Show"} Advanced Search
              </Button>
            </div>

            {showAdvancedSearch && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input
                    placeholder="Enter patient name..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient ID Number</label>
                  <Input
                    placeholder="Enter patient ID..."
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => {
                if (reportTypeFilter !== "all") {
                  setShowReportData(true);
                  setReportData(mockPatientReportData);
                  toast.success(`Generated ${getReportTypeLabel(reportTypeFilter)} report successfully`);
                } else {
                  toast.error("Please select a report type first");
                }
              }}
              disabled={reportTypeFilter === "all"}
            >
              <Users className="mr-2 h-4 w-4" />
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
              <Users className="h-5 w-5" />
              {reportTypeFilter !== "all" ? getReportTypeLabel(reportTypeFilter) : "Patient"} Report Data
            </CardTitle>
            <CardDescription>
              Detailed patient data from WellSync system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Barangay</TableHead>
                    <TableHead>Consultation Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Attending Physician</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No data available for the selected report type
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.barangay}</TableCell>
                        <TableCell>{format(patient.consultationDate, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{patient.diagnosis}</TableCell>
                        <TableCell>{patient.prescription}</TableCell>
                        <TableCell>{patient.attendingPhysician}</TableCell>
                        <TableCell>{patient.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant={patient.status === "Completed" ? "default" :
                                    patient.status === "Follow-up Required" ? "secondary" :
                                    patient.status === "Ongoing Treatment" ? "outline" : "secondary"}
                          >
                            {patient.status}
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
                Clear Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Generate a Report to View Data</h3>
                <p className="text-muted-foreground mt-2">
                  Select a report type from the filters above and click "Generate Report" to view patient data from WellSync.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

