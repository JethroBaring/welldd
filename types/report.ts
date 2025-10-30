// Report Builder Types and Interfaces

export type ReportCategory =
  | "inventory"
  | "medical"
  | "surveillance"
  | "procurement"
  | "financial"
  | "operational"
  | "custom";

export type ReportDataSource =
  | "inventory_items"
  | "inventory_transactions"
  | "batches"
  | "stock_adjustments"
  | "patients"
  | "medical_records"
  | "appointments"
  | "disease_cases"
  | "outbreak_alerts"
  | "purchase_requests"
  | "purchase_orders"
  | "warehouse_receiving"
  | "suppliers"
  | "users"
  | "lgu"
  | "facilities";

export type FieldType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "enum"
  | "currency"
  | "percentage";

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "between"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null";

export type AggregationFunction =
  | "sum"
  | "avg"
  | "min"
  | "max"
  | "count"
  | "count_distinct"
  | "first"
  | "last";

export type SortDirection = "asc" | "desc";

export type VisualizationType =
  | "table"
  | "chart_bar"
  | "chart_line"
  | "chart_pie"
  | "chart_area"
  | "chart_scatter"
  | "pivot_table"
  | "summary_cards"
  | "timeline";

export type ExportFormat =
  | "pdf"
  | "excel"
  | "csv"
  | "json";

export type ScheduleFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annually";

export type ReportStatus =
  | "draft"
  | "active"
  | "archived";

export interface DataSourceField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  dataSource: ReportDataSource;
  description?: string;
  enumValues?: string[];
  isFilterable: boolean;
  isSortable: boolean;
  isGroupable: boolean;
  isAggregatable: boolean;
  defaultVisible: boolean;
  format?: string; // For date/number formatting
}

export interface ReportFilter {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For "between" operator
  logicalOperator?: "AND" | "OR";
}

export interface ReportSort {
  fieldId: string;
  direction: SortDirection;
  priority: number;
}

export interface ReportGrouping {
  fieldId: string;
  aggregations?: {
    fieldId: string;
    function: AggregationFunction;
    label?: string;
  }[];
}

export interface ReportColumn {
  fieldId: string;
  label?: string;
  width?: number;
  alignment?: "left" | "center" | "right";
  format?: string;
  visible: boolean;
  aggregation?: AggregationFunction;
}

export interface ChartConfiguration {
  type: VisualizationType;
  xAxisField?: string;
  yAxisField?: string;
  seriesField?: string;
  colorScheme?: string;
  showLegend: boolean;
  showDataLabels: boolean;
  title?: string;
  subtitle?: string;
}

export interface DateRange {
  type: "custom" | "today" | "yesterday" | "last_7_days" | "last_30_days" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "this_year" | "last_year" | "all_time";
  startDate?: Date;
  endDate?: Date;
}

export interface ReportSchedule {
  enabled: boolean;
  frequency: ScheduleFrequency;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time?: string; // HH:mm format
  recipients: string[]; // Email addresses
  format: ExportFormat;
  subject?: string;
  message?: string;
}

export interface ReportConfiguration {
  id: string;
  name: string;
  description?: string;
  category: ReportCategory;
  dataSource: ReportDataSource;

  // Field Selection
  selectedFields: string[]; // Field IDs
  columns: ReportColumn[];

  // Filters
  filters: ReportFilter[];
  dateRange?: DateRange;

  // Sorting & Grouping
  sorting: ReportSort[];
  grouping?: ReportGrouping;

  // Visualization
  visualization: VisualizationType;
  chartConfig?: ChartConfiguration;

  // Pagination
  pageSize?: number;

  // Advanced Options
  showTotals: boolean;
  showSubtotals: boolean;
  includeCharts: boolean;
  includeRawData: boolean;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: ReportStatus;

  // Sharing & Permissions
  isPublic: boolean;
  sharedWith: string[]; // User IDs

  // Scheduling
  schedule?: ReportSchedule;

  // Tags for organization
  tags: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  dataSource: ReportDataSource;
  thumbnail?: string;
  configuration: Partial<ReportConfiguration>;
  isSystemTemplate: boolean;
  usageCount: number;
  createdBy?: string;
  createdAt: Date;
}

export interface ReportResult {
  id: string;
  reportId: string;
  reportName: string;
  generatedAt: Date;
  generatedBy: string;

  // Data
  data: any[];
  totalRecords: number;

  // Summary Statistics
  summary?: {
    [key: string]: {
      sum?: number;
      avg?: number;
      min?: number;
      max?: number;
      count?: number;
    };
  };

  // Metadata
  filters: ReportFilter[];
  dateRange?: DateRange;
  executionTime: number; // milliseconds
}

export interface SavedReport {
  id: string;
  configuration: ReportConfiguration;
  lastRunAt?: Date;
  lastRunBy?: string;
  runCount: number;
  isFavorite: boolean;
  folder?: string;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  startTime: Date;
  endTime?: Date;
  status: "running" | "completed" | "failed";
  progress?: number;
  error?: string;
  resultId?: string;
}

export interface ReportFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  reports: string[]; // Report IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined field configurations for different data sources
export interface DataSourceConfig {
  dataSource: ReportDataSource;
  label: string;
  description: string;
  icon: string;
  fields: DataSourceField[];
  defaultColumns: string[];
  defaultFilters?: ReportFilter[];
  requiredPermission?: string;
}

// Report builder state
export interface ReportBuilderState {
  step: "source" | "fields" | "filters" | "visualization" | "preview" | "save";
  configuration: Partial<ReportConfiguration>;
  validationErrors: string[];
  previewData?: any[];
  isGenerating: boolean;
}

// Export request
export interface ReportExportRequest {
  reportId: string;
  format: ExportFormat;
  filters?: ReportFilter[];
  dateRange?: DateRange;
  includeCharts: boolean;
  includeRawData: boolean;
  fileName?: string;
}

// Report analytics
export interface ReportAnalytics {
  reportId: string;
  views: number;
  exports: number;
  lastViewed?: Date;
  lastExported?: Date;
  averageExecutionTime: number;
  popularFilters: { filter: string; count: number }[];
}
