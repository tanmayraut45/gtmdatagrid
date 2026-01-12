import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnDef } from '@/types';

interface GridMetaState {
  columns: ColumnDef[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
  visibleColumns: string[];
  totalColumns: number;
}

const defaultColumns: ColumnDef[] = [
  {
    id: 'select',
    header: '',
    accessorKey: 'select',
    type: 'checkbox',
    width: 48,
    visible: true,
    sortable: false,
    filterable: false,
  },
  {
    id: 'rowNumber',
    header: '#',
    accessorKey: 'rowNumber',
    type: 'rowNumber',
    width: 48,
    visible: true,
    sortable: false,
    filterable: false,
  },
  {
    id: 'importedData',
    header: 'Imported Data',
    accessorKey: 'importedData',
    type: 'text',
    width: 150,
    visible: true,
    sortable: true,
    filterable: true,
    icon: 'file-text',
  },
  {
    id: 'lastUpdatedAt',
    header: 'Last Updated At',
    accessorKey: 'lastUpdatedAt',
    type: 'timestamp',
    width: 180,
    visible: true,
    sortable: true,
    filterable: true,
  },
  {
    id: 'companyName',
    header: 'Company Name',
    accessorKey: 'companyName',
    type: 'textWithAvatar',
    width: 180,
    visible: true,
    sortable: true,
    filterable: true,
    icon: 'building',
  },
  {
    id: 'companyWebsite',
    header: 'Company Website',
    accessorKey: 'companyWebsite',
    type: 'link',
    width: 200,
    visible: true,
    sortable: true,
    filterable: true,
    icon: 'link',
  },
  {
    id: 'linkedinJobUrl',
    header: 'LinkedIn Job URL',
    accessorKey: 'linkedinJobUrl',
    type: 'link',
    width: 200,
    visible: true,
    sortable: true,
    filterable: true,
    icon: 'linkedin',
  },
  {
    id: 'emailWaterfall',
    header: 'Email Waterfall',
    accessorKey: 'emailWaterfall',
    type: 'status',
    width: 160,
    visible: true,
    sortable: true,
    filterable: true,
  },
  // Hidden columns (not visible by default but available)
  {
    id: 'phoneNumber',
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
    type: 'text',
    width: 140,
    visible: false,
    sortable: true,
    filterable: true,
  },
  {
    id: 'industry',
    header: 'Industry',
    accessorKey: 'industry',
    type: 'text',
    width: 140,
    visible: false,
    sortable: true,
    filterable: true,
  },
  {
    id: 'employeeCount',
    header: 'Employee Count',
    accessorKey: 'employeeCount',
    type: 'text',
    width: 120,
    visible: false,
    sortable: true,
    filterable: true,
  },
  {
    id: 'revenue',
    header: 'Revenue',
    accessorKey: 'revenue',
    type: 'text',
    width: 120,
    visible: false,
    sortable: true,
    filterable: true,
  },
];

const initialState: GridMetaState = {
  columns: defaultColumns,
  columnOrder: defaultColumns.map((col) => col.id),
  columnWidths: defaultColumns.reduce((acc, col) => {
    acc[col.id] = col.width || 150;
    return acc;
  }, {} as Record<string, number>),
  visibleColumns: defaultColumns.filter((col) => col.visible).map((col) => col.id),
  totalColumns: 20, // Total available columns
};

const gridMetaSlice = createSlice({
  name: 'gridMeta',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<ColumnDef[]>) => {
      state.columns = action.payload;
    },
    setColumnOrder: (state, action: PayloadAction<string[]>) => {
      state.columnOrder = action.payload;
    },
    setColumnWidth: (state, action: PayloadAction<{ columnId: string; width: number }>) => {
      const { columnId, width } = action.payload;
      state.columnWidths[columnId] = width;
      // Also update the column definition
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.width = width;
      }
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      if (state.visibleColumns.includes(columnId)) {
        state.visibleColumns = state.visibleColumns.filter((id) => id !== columnId);
      } else {
        state.visibleColumns.push(columnId);
      }
      // Update the column's visible property
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.visible = !column.visible;
      }
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      state.columns = state.columns.map((col) => ({
        ...col,
        visible: action.payload.includes(col.id),
      }));
    },
    reorderColumns: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const newOrder = [...state.columnOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      state.columnOrder = newOrder;
    },
  },
});

export const {
  setColumns,
  setColumnOrder,
  setColumnWidth,
  toggleColumnVisibility,
  setVisibleColumns,
  reorderColumns,
} = gridMetaSlice.actions;

export default gridMetaSlice.reducer;
