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

export default function InventoryReportsPage() {
  const [reportType, setReportType] = useState<string>("received");
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
        <h1 className="text-2xl font-semibold">Inventory Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate reports on inventory activity and stock levels
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
                  <SelectItem value="received">Items Received</SelectItem>
                  <SelectItem value="dispensed">Items Dispensed</SelectItem>
                  <SelectItem value="expired">Expired Items</SelectItem>
                  <SelectItem value="low_stock">Low Stock Items</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="stock_movement">Stock Movement</SelectItem>
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
                  {reportType === "received" && "Items Received Report"}
                  {reportType === "dispensed" && "Items Dispensed Report"}
                  {reportType === "expired" && "Expired Items Report"}
                  {reportType === "low_stock" && "Low Stock Items Report"}
                  {reportType === "expiring_soon" && "Expiring Soon Report"}
                  {reportType === "stock_movement" && "Stock Movement Report"}
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
            {reportType === "received" && (
              <p>
                This report shows all medicines and supplies received during the selected period,
                including warehouse receiving details, batch numbers, and supplier information.
              </p>
            )}
            {reportType === "dispensed" && (
              <p>
                This report shows all medicines dispensed to patients and departments during the
                selected period, following FIFO/FEFO principles.
              </p>
            )}
            {reportType === "expired" && (
              <p>
                This report lists all expired medicines and supplies, including disposal dates and
                estimated value loss.
              </p>
            )}
            {reportType === "low_stock" && (
              <p>
                This report identifies items that have reached or fallen below their reorder levels,
                helping prevent stockouts.
              </p>
            )}
            {reportType === "expiring_soon" && (
              <p>
                This report shows items approaching expiration within the configured threshold
                (default 180 days), prioritized by FEFO principle.
              </p>
            )}
            {reportType === "stock_movement" && (
              <p>
                This report provides a complete audit trail of all inventory transactions including
                receipts, dispensing, transfers, and adjustments.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

