// ============================================
// TypeScript Types for the Data Grid Application
// ============================================

// ===== ROW DATA =====
export interface Row {
  id: string;
  importedData: string;
  lastUpdatedAt: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite: string;
  linkedinJobUrl: string;
  emailWaterfall: EmailWaterfallStatus;
  enrichmentData?: {
    generatedEmail?: string;
  };
  // Additional fields can be added as needed
  [key: string]: unknown;
}

export type EmailWaterfallStatus = 
  | 'email_found'
  | 'run_condition_not_met'
  | 'pending'
  | 'processing'
  | 'failed';

// ===== COLUMN DEFINITIONS =====
export interface ColumnDef {
  id: string;
  header: string;
  accessorKey: string;
  type: ColumnType;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  icon?: string;
}

export type ColumnType = 
  | 'checkbox'
  | 'rowNumber'
  | 'text'
  | 'textWithAvatar'
  | 'link'
  | 'timestamp'
  | 'status'
  | 'actions';

// ===== USER & AUTH =====
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface BillingState {
  status: 'active' | 'failed' | 'pending' | 'expired';
  credits: number;
  maxCredits: number;
  expiresIn?: number; // days until expiration
  message?: string;
}

// ===== WORKSPACE =====
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workbook {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GridTab {
  id: string;
  workbookId: string;
  name: string;
  isActive: boolean;
  rowCount: number;
}

// ===== JOBS =====
export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  progress: number; // 0-100
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export type JobType = 
  | 'enrichment'
  | 'import'
  | 'export'
  | 'deduplication';

export type JobStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ===== FILTERS =====
export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | string[];
}

export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in'
  | 'notIn';

// ===== SORT =====
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// ===== UI STATE =====
export interface ModalState {
  loadData: boolean;
  columnPicker: boolean;
  filter: boolean;
  rowDetail: boolean;
  export: boolean;
  enrichment: boolean;
  enrichmentSuccess: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms
}

// ===== SETTINGS =====
export interface UserSettings {
  autoRun: boolean;
  autoDedup: boolean;
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showRowNumbers: boolean;
}

// ===== API RESPONSES =====
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ===== SELECTION =====
export type SelectionMode = 'none' | 'single' | 'multiple';

// ===== BREADCRUMB =====
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}
