import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workspace, Workbook, GridTab, BreadcrumbItem } from '@/types';

interface WorkspacesState {
  currentWorkspace: Workspace | null;
  currentWorkbook: Workbook | null;
  tabs: GridTab[];
  activeTabId: string | null;
  breadcrumbs: BreadcrumbItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkspacesState = {
  currentWorkspace: {
    id: 'ws-1',
    name: 'Bitscale UX / UI testing flow',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-12T14:08:00Z',
  },
  currentWorkbook: {
    id: 'wb-1',
    workspaceId: 'ws-1',
    name: 'Workbook',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-12T14:08:00Z',
  },
  tabs: [
    { id: 'tab-1', workbookId: 'wb-1', name: 'Grid', isActive: false, rowCount: 2000 },
    { id: 'tab-2', workbookId: 'wb-1', name: 'Bitscale grid only', isActive: true, rowCount: 2000 },
    { id: 'tab-3', workbookId: 'wb-1', name: 'User Engagement...', isActive: false, rowCount: 500 },
    { id: 'tab-4', workbookId: 'wb-1', name: 'Customer Insights...', isActive: false, rowCount: 350 },
    { id: 'tab-5', workbookId: 'wb-1', name: 'Audience Interact...', isActive: false, rowCount: 800 },
    { id: 'tab-6', workbookId: 'wb-1', name: 'Lead Generation...', isActive: false, rowCount: 1200 },
  ],
  activeTabId: 'tab-2',
  breadcrumbs: [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Workbook - Bitscale UX / UI testing flow' },
    { label: 'Bitscale grid only' },
  ],
  isLoading: false,
  error: null,
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },
    setCurrentWorkbook: (state, action: PayloadAction<Workbook>) => {
      state.currentWorkbook = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
      state.tabs = state.tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === action.payload,
      }));
    },
    addTab: (state, action: PayloadAction<GridTab>) => {
      state.tabs.push(action.payload);
    },
    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload);
    },
    updateTab: (state, action: PayloadAction<{ id: string; updates: Partial<GridTab> }>) => {
      const index = state.tabs.findIndex((tab) => tab.id === action.payload.id);
      if (index !== -1) {
        state.tabs[index] = { ...state.tabs[index], ...action.payload.updates };
      }
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentWorkspace,
  setCurrentWorkbook,
  setActiveTab,
  addTab,
  removeTab,
  updateTab,
  setBreadcrumbs,
  setLoading,
  setError,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;
