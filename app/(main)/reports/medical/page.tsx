"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MedicalReportsPage() {
  const [reportType, setReportType] = useState<string>("demographics");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleGenerateReport = () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select date range");
      return;
    }
    toast.success("Report generated successfully");
  };

  const handleExportCSV = () => {
    toast.success("Exporting to CSV...");
  };

  const handlePrint = () => {
    toast.success("Opening print dialog...");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Medical Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate reports on patient demographics and medical records
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Configure report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
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
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleGenerateReport} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {reportType === "demographics" && "Patient Demographics Report"}
                  {reportType === "consultations" && "Consultations Report"}
                  {reportType === "diagnoses" && "Common Diagnoses Report"}
                  {reportType === "prescriptions" && "Prescriptions Report"}
                  {reportType === "age_distribution" && "Age Distribution Report"}
                  {reportType === "barangay_distribution" && "Barangay Distribution Report"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-8 text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
              <div>
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Report Generated</p>
                <p className="text-sm">
                  Select date range and click "Generate Report" to view data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {reportType === "demographics" && (
              <p>
                This report provides an overview of patient demographics including age, gender,
                and location distribution across all registered patients.
              </p>
            )}
            {reportType === "consultations" && (
              <p>
                This report shows all patient consultations during the selected period, including
                attending physicians and chief complaints.
              </p>
            )}
            {reportType === "diagnoses" && (
              <p>
                This report identifies the most common diagnoses during the selected period,
                helping to track disease patterns and public health trends.
              </p>
            )}
            {reportType === "prescriptions" && (
              <p>
                This report lists all prescriptions issued during the selected period, including
                medication names and quantities for inventory planning.
              </p>
            )}
            {reportType === "age_distribution" && (
              <p>
                This report shows the age distribution of patients seeking medical care,
                useful for program planning and resource allocation.
              </p>
            )}
            {reportType === "barangay_distribution" && (
              <p>
                This report displays patient distribution across barangays, helping identify
                areas with high healthcare demand.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

