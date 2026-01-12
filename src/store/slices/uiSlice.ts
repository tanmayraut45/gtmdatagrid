import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState, Toast, FilterRule, SortConfig } from '@/types';

interface UIState {
  modals: ModalState;
  toasts: Toast[];
  filters: FilterRule[];
  activeFiltersCount: number;
  sort: SortConfig | null;
  sortConfig: SortConfig | null;
  searchQuery: string;
  sidebarOpen: boolean;
  rowDetailId: string | null;
  isGridLoading: boolean;
}

const initialState: UIState = {
  modals: {
    loadData: false,
    columnPicker: false,
    filter: false,
    rowDetail: false,
    export: false,
    enrichment: false,
  },
  toasts: [],
  filters: [
    {
      id: 'filter-1',
      field: 'companyName',
      operator: 'contains',
      value: '',
    },
  ],
  activeFiltersCount: 1,
  sort: null,
  sortConfig: null,
  searchQuery: '',
  sidebarOpen: false,
  rowDetailId: null,
  isGridLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof ModalState] = false;
      });
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}`;
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    addFilter: (state, action: PayloadAction<FilterRule>) => {
      state.filters.push(action.payload);
      state.activeFiltersCount = state.filters.length;
    },
    updateFilter: (state, action: PayloadAction<{ id: string; updates: Partial<FilterRule> }>) => {
      const index = state.filters.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.filters[index] = { ...state.filters[index], ...action.payload.updates };
      }
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.filter((f) => f.id !== action.payload);
      state.activeFiltersCount = state.filters.length;
    },
    clearFilters: (state) => {
      state.filters = [];
      state.activeFiltersCount = 0;
    },
    setSort: (state, action: PayloadAction<SortConfig | null>) => {
      state.sort = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setRowDetailId: (state, action: PayloadAction<string | null>) => {
      state.rowDetailId = action.payload;
      state.modals.rowDetail = action.payload !== null;
    },
    setGridLoading: (state, action: PayloadAction<boolean>) => {
      state.isGridLoading = action.payload;
    },
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  toggleModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  addFilter,
  updateFilter,
  removeFilter,
  clearFilters,
  setSort,
  setSortConfig,
  setSearchQuery,
  toggleSidebar,
  setSidebarOpen,
  setRowDetailId,
  setGridLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
