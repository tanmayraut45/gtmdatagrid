import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Row, EmailWaterfallStatus } from '@/types';

interface RowsState {
  byId: Record<string, Row>;
  allIds: string[];
  selectedIds: string[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  loadedCount: number;
}

// Generate sample data
const generateSampleRows = (): Row[] => {
  const companies = [
    { name: 'Google', logo: 'google', website: 'https://www.example.com' },
    { name: 'Amazon', logo: 'amazon', website: 'https://www.sample.com' },
    { name: 'LinkedIn', logo: 'linkedin', website: 'https://www.testsite.com' },
    { name: 'Microsoft', logo: 'microsoft', website: 'https://www.demo.com' },
    { name: 'TED', logo: 'ted', website: 'https://www.siteexample.com' },
    { name: 'Unilever', logo: 'unilever', website: 'https://www.webpage.com' },
    { name: 'Apple', logo: 'apple', website: 'https://www.mywebsite.com' },
  ];

  const names = [
    'Mike Braham', 'Alex Johnson', 'Sarah Thompson', 'David Lee', 'Emily Carter',
    'James Smith', 'Laura White', 'Chris Brown', 'Jessica Green', 'Daniel Harris',
    'Megan Clark', 'Brian Lewis', 'Samantha Hall',
  ];

  const statuses: EmailWaterfallStatus[] = [
    'email_found', 'email_found', 'email_found', 'run_condition_not_met',
    'email_found', 'email_found', 'run_condition_not_met', 'run_condition_not_met',
    'email_found', 'email_found', 'run_condition_not_met', 'email_found', 'email_found',
  ];

  const rows: Row[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const company = companies[i % companies.length];
    const name = i < names.length ? names[i] : `${names[i % names.length]} ${Math.floor(i / names.length)}`;
    const status = i < statuses.length ? statuses[i] : statuses[i % statuses.length];
    
    rows.push({
      id: `row-${i + 1}`,
      importedData: name,
      lastUpdatedAt: '12 Jan, 2026',
      companyName: company.name,
      companyLogo: company.logo,
      companyWebsite: company.website,
      linkedinJobUrl: `https://www.linkedin.com/jobs/${i + 1}`,
      emailWaterfall: status,
    });
  }
  
  return rows;
};

const sampleRows = generateSampleRows();
const byId = sampleRows.reduce((acc, row) => {
  acc[row.id] = row;
  return acc;
}, {} as Record<string, Row>);

const initialState: RowsState = {
  byId,
  allIds: sampleRows.map((row) => row.id),
  selectedIds: [],
  loading: false,
  error: null,
  totalCount: 1000,
  loadedCount: 1000,
};

const rowsSlice = createSlice({
  name: 'rows',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Row[]>) => {
      state.byId = action.payload.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {} as Record<string, Row>);
      state.allIds = action.payload.map((row) => row.id);
      state.loadedCount = action.payload.length;
    },
    addRows: (state, action: PayloadAction<Row[]>) => {
      action.payload.forEach((row) => {
        state.byId[row.id] = row;
        if (!state.allIds.includes(row.id)) {
          state.allIds.push(row.id);
        }
      });
      state.loadedCount = state.allIds.length;
    },
    updateRow: (state, action: PayloadAction<{ id: string; updates: Partial<Row> }>) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    deleteRows: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((id) => {
        delete state.byId[id];
        state.allIds = state.allIds.filter((rowId) => rowId !== id);
        state.selectedIds = state.selectedIds.filter((rowId) => rowId !== id);
      });
      state.loadedCount = state.allIds.length;
    },
    selectRow: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    deselectRow: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
    },
    toggleRowSelection: (state, action: PayloadAction<string>) => {
      if (state.selectedIds.includes(action.payload)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    selectAll: (state) => {
      state.selectedIds = [...state.allIds];
    },
    deselectAll: (state) => {
      state.selectedIds = [];
    },
    selectRange: (state, action: PayloadAction<{ startId: string; endId: string }>) => {
      const { startId, endId } = action.payload;
      const startIndex = state.allIds.indexOf(startId);
      const endIndex = state.allIds.indexOf(endId);
      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const rangeIds = state.allIds.slice(start, end + 1);
        rangeIds.forEach((id) => {
          if (!state.selectedIds.includes(id)) {
            state.selectedIds.push(id);
          }
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
  },
});

export const {
  setRows,
  addRows,
  updateRow,
  deleteRows,
  selectRow,
  deselectRow,
  toggleRowSelection,
  selectAll,
  deselectAll,
  selectRange,
  setLoading,
  setError,
  setTotalCount,
} = rowsSlice.actions;

export default rowsSlice.reducer;
