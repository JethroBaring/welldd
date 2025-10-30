"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  X,
  Play,
  Save,
  Download,
  Filter,
  BarChart3,
  Table2,
  PieChart,
  LineChart,
  Calendar,
  Database,
  Columns,
  Eye,
  ChevronRight,
  Sparkles,
  Star,
  Trash2,
  Folder,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

type DataSourceType =
  | "inventory_items"
  | "inventory_transactions"
  | "patients"
  | "disease_cases"
  | "purchase_orders";

interface DataField {
  id: string;
  label: string;
  type: "string" | "number" | "date" | "currency";
}

interface ReportFilter {
  id: string;
  fieldId: string;
  operator: string;
  value: string;
  logicalOperator?: "AND" | "OR";
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  dataSource: DataSourceType;
  lastRun?: Date;
  isFavorite: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  dataSource: DataSourceType;
  presetFields: string[];
  usageCount: number;
}

const DATA_SOURCES = [
  {
    id: "inventory_items" as DataSourceType,
    name: "Inventory Items",
    description: "Current inventory stock levels and item details",
    icon: "📦",
    category: "Inventory",
    fields: [
      { id: "itemCode", label: "Item Code", type: "string" as const },
      { id: "itemName", label: "Item Name", type: "string" as const },
      { id: "category", label: "Category", type: "string" as const },
      { id: "totalQuantity", label: "Total Quantity", type: "number" as const },
      { id: "availableQuantity", label: "Available Quantity", type: "number" as const },
      { id: "reorderLevel", label: "Reorder Level", type: "number" as const },
      { id: "unitCost", label: "Unit Cost", type: "currency" as const },
    ],
  },
  {
    id: "inventory_transactions" as DataSourceType,
    name: "Inventory Transactions",
    description: "All inventory movements and transaction history",
    icon: "📊",
    category: "Inventory",
    fields: [
      { id: "transactionNumber", label: "Transaction #", type: "string" as const },
      { id: "date", label: "Date", type: "date" as const },
      { id: "type", label: "Type", type: "string" as const },
      { id: "itemName", label: "Item Name", type: "string" as const },
      { id: "quantity", label: "Quantity", type: "number" as const },
      { id: "performedBy", label: "Performed By", type: "string" as const },
    ],
  },
  {
    id: "patients" as DataSourceType,
    name: "Patients",
    description: "Patient demographics and registration information",
    icon: "👥",
    category: "Medical",
    fields: [
      { id: "patientId", label: "Patient ID", type: "string" as const },
      { id: "firstName", label: "First Name", type: "string" as const },
      { id: "lastName", label: "Last Name", type: "string" as const },
      { id: "age", label: "Age", type: "number" as const },
      { id: "gender", label: "Gender", type: "string" as const },
      { id: "barangay", label: "Barangay", type: "string" as const },
      { id: "registrationDate", label: "Registration Date", type: "date" as const },
    ],
  },
  {
    id: "disease_cases" as DataSourceType,
    name: "Disease Cases",
    description: "Disease surveillance and case tracking data",
    icon: "🦠",
    category: "Surveillance",
    fields: [
      { id: "disease", label: "Disease", type: "string" as const },
      { id: "diagnosisDate", label: "Diagnosis Date", type: "date" as const },
      { id: "barangay", label: "Barangay", type: "string" as const },
      { id: "status", label: "Status", type: "string" as const },
      { id: "severity", label: "Severity", type: "string" as const },
    ],
  },
  {
    id: "purchase_orders" as DataSourceType,
    name: "Purchase Orders",
    description: "Procurement orders and spending analysis",
    icon: "🛒",
    category: "Procurement",
    fields: [
      { id: "poNumber", label: "PO Number", type: "string" as const },
      { id: "date", label: "Date", type: "date" as const },
      { id: "supplier", label: "Supplier", type: "string" as const },
      { id: "status", label: "Status", type: "string" as const },
      { id: "total", label: "Total Amount", type: "currency" as const },
    ],
  },
];

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "tmpl-1",
    name: "Low Stock Items",
    description: "Items below reorder level requiring immediate attention",
    icon: "⚠️",
    category: "Inventory",
    dataSource: "inventory_items",
    presetFields: ["itemCode", "itemName", "availableQuantity", "reorderLevel"],
    usageCount: 245,
  },
  {
    id: "tmpl-2",
    name: "Transaction History",
    description: "Complete inventory transaction log with details",
    icon: "📋",
    category: "Inventory",
    dataSource: "inventory_transactions",
    presetFields: ["transactionNumber", "date", "type", "itemName", "quantity"],
    usageCount: 189,
  },
  {
    id: "tmpl-3",
    name: "Patient Demographics",
    description: "Patient population breakdown by age and location",
    icon: "📊",
    category: "Medical",
    dataSource: "patients",
    presetFields: ["patientId", "firstName", "lastName", "age", "barangay"],
    usageCount: 156,
  },
  {
    id: "tmpl-4",
    name: "Disease Outbreak Summary",
    description: "Disease cases grouped by location and severity",
    icon: "🦠",
    category: "Surveillance",
    dataSource: "disease_cases",
    presetFields: ["disease", "diagnosisDate", "barangay", "severity"],
    usageCount: 203,
  },
  {
    id: "tmpl-5",
    name: "Procurement Spending",
    description: "Purchase order totals and supplier analysis",
    icon: "💰",
    category: "Procurement",
    dataSource: "purchase_orders",
    presetFields: ["poNumber", "date", "supplier", "total", "status"],
    usageCount: 178,
  },
];

export default function CustomReportsPage() {
  const [currentStep, setCurrentStep] = useState<"start" | "source" | "fields" | "filters" | "preview">("start");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceType | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [visualization, setVisualization] = useState<"table" | "chart">("table");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  const currentDataSource = DATA_SOURCES.find((ds) => ds.id === selectedDataSource);
  const availableFields = currentDataSource?.fields || [];

  const handleSelectDataSource = (source: DataSourceType) => {
    setSelectedDataSource(source);
    setSelectedFields([]);
    setFilters([]);
    setCurrentStep("fields");
  };

  const handleUseTemplate = (template: ReportTemplate) => {
    setSelectedDataSource(template.dataSource);
    setSelectedFields(template.presetFields);
    setReportName(template.name);
    setReportDescription(template.description);
    setCurrentStep("filters");
    toast.success(`Template "${template.name}" loaded`);
  };

  const handleToggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    );
  };

  const handleAddFilter = () => {
    const newFilter: ReportFilter = {
      id: `filter-${Date.now()}`,
      fieldId: availableFields[0]?.id || "",
      operator: "equals",
      value: "",
      logicalOperator: filters.length > 0 ? "AND" : undefined,
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  const handleGenerateReport = async () => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    try {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock preview data
      const mockData = Array.from({ length: 10 }, (_, i) => {
        const row: any = { id: i + 1 };
        selectedFields.forEach((fieldId) => {
          const field = availableFields.find((f) => f.id === fieldId);
          if (field) {
            if (field.type === "number") {
              row[fieldId] = Math.floor(Math.random() * 1000) + 1;
            } else if (field.type === "date") {
              const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
              row[fieldId] = date.toLocaleDateString();
            } else if (field.type === "currency") {
              row[fieldId] = `₱${(Math.random() * 10000).toFixed(2)}`;
            } else {
              row[fieldId] = `${field.label} ${i + 1}`;
            }
          }
        });
        return row;
      });

      setPreviewData(mockData);
      setCurrentStep("preview");
      toast.success(`Report generated with ${mockData.length} records`);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    setShowSaveDialog(false);
    toast.success("Report saved successfully!");
  };

  const handleExportReport = (format: string) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handleReset = () => {
    setSelectedDataSource(null);
    setSelectedFields([]);
    setFilters([]);
    setReportName("");
    setReportDescription("");
    setPreviewData([]);
    setCurrentStep("start");
  };

  const renderStepIndicator = () => {
    if (currentStep === "start") return null;

    const steps = [
      { key: "source", label: "Data Source", icon: Database },
      { key: "fields", label: "Fields", icon: Columns },
      { key: "filters", label: "Filters", icon: Filter },
      { key: "preview", label: "Preview", icon: Eye },
    ];

    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-sm mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (currentStep === "start") {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Report Builder</h1>
          <p className="text-muted-foreground text-lg">
            Create custom reports with flexible data selection and powerful filters
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentStep("source")}>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Build from Scratch</CardTitle>
              <CardDescription>Start with a blank report and customize everything</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <Folder className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle className="text-lg">My Saved Reports</CardTitle>
              <CardDescription>{savedReports.length} saved reports available</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle className="text-lg">Scheduled Reports</CardTitle>
              <CardDescription>View and manage automated reports</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Report Templates</CardTitle>
            <CardDescription>Start with a pre-built template and customize to your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {REPORT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                  onClick={() => handleUseTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{template.icon}</span>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      Used {template.usageCount} times
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {renderStepIndicator()}

      {currentStep === "source" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Select Data Source</h2>
            <p className="text-muted-foreground">Choose the primary data source for your report</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DATA_SOURCES.map((source) => (
              <Card
                key={source.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedDataSource === source.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleSelectDataSource(source.id)}
              >
                <CardHeader>
                  <div className="text-4xl mb-3">{source.icon}</div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{source.category}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">{source.fields.length} fields available</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>Back to Start</Button>
          </div>
        </div>
      )}

      {currentStep === "fields" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Select Fields</h2>
              <p className="text-muted-foreground">Choose the fields to include in your report</p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {selectedFields.length} / {availableFields.length} selected
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">{currentDataSource?.icon}</span>
                {currentDataSource?.name}
              </CardTitle>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedFields(availableFields.map((f) => f.id))}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedFields([])}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {availableFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleToggleField(field.id)}
                  >
                    <Checkbox
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleToggleField(field.id)}
                    />
                    <div className="flex-1">
                      <Label className="cursor-pointer font-medium">{field.label}</Label>
                      <Badge variant="secondary" className="text-xs mt-1">{field.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep("source")}>Back</Button>
            <Button onClick={() => setCurrentStep("filters")} disabled={selectedFields.length === 0}>
              Next: Filters
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === "filters" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Add Filters</h2>
              <p className="text-muted-foreground">Filter your data to show specific results (optional)</p>
            </div>
            <Button onClick={handleAddFilter} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>

          {filters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Filters Added</p>
                <p className="text-sm mb-4">Add filters to narrow down your report data, or skip to see all records</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveFilter(filter.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Filter configuration would go here</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep("fields")}>Back</Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Report"}
              <Play className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === "preview" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Report Preview</h2>
              <p className="text-muted-foreground">Your report has been generated with {previewData.length} records</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => handleExportReport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedFields.map((fieldId) => {
                        const field = availableFields.find((f) => f.id === fieldId);
                        return <TableHead key={fieldId}>{field?.label}</TableHead>;
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        {selectedFields.map((fieldId) => (
                          <TableCell key={fieldId}>{row[fieldId]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>Start New Report</Button>
            <Button onClick={() => setCurrentStep("filters")}>Edit Report</Button>
          </div>
        </div>
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Report</DialogTitle>
            <DialogDescription>Save this report configuration for future use</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDescription">Description (Optional)</Label>
              <Textarea
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Enter report description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveReport}>Save Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
