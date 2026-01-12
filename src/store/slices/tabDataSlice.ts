import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Row, EmailWaterfallStatus } from '@/types';

interface TabData {
  byId: Record<string, Row>;
  allIds: string[];
  selectedIds: string[];
}

interface TabDataState {
  data: Record<string, TabData>;
}

// Generate sample data for a specific tab
const generateTabRows = (tabId: string, count: number): Row[] => {
  const tabConfigs: Record<string, {
    companies: { name: string; logo: string; website: string }[];
    names: string[];
  }> = {
    'tab-1': {
      companies: [
        { name: 'Google', logo: 'google', website: 'https://google.com' },
        { name: 'Microsoft', logo: 'microsoft', website: 'https://microsoft.com' },
        { name: 'Apple', logo: 'apple', website: 'https://apple.com' },
      ],
      names: ['John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown', 'Tom Davis'],
    },
    'tab-2': {
      companies: [
        { name: 'Google', logo: 'google', website: 'https://www.example.com' },
        { name: 'Amazon', logo: 'amazon', website: 'https://www.sample.com' },
        { name: 'LinkedIn', logo: 'linkedin', website: 'https://www.testsite.com' },
        { name: 'Microsoft', logo: 'microsoft', website: 'https://www.demo.com' },
        { name: 'TED', logo: 'ted', website: 'https://www.siteexample.com' },
        { name: 'Unilever', logo: 'unilever', website: 'https://www.webpage.com' },
        { name: 'Apple', logo: 'apple', website: 'https://www.mywebsite.com' },
      ],
      names: [
        'Mike Braham', 'Alex Johnson', 'Sarah Thompson', 'David Lee', 'Emily Carter',
        'James Smith', 'Laura White', 'Chris Brown', 'Jessica Green', 'Daniel Harris',
        'Megan Clark', 'Brian Lewis', 'Samantha Hall',
      ],
    },
    'tab-3': {
      companies: [
        { name: 'LinkedIn', logo: 'linkedin', website: 'https://linkedin.com' },
        { name: 'TED', logo: 'ted', website: 'https://ted.com' },
      ],
      names: ['Sarah Connor', 'Kyle Reese', 'John Connor', 'Marcus Wright'],
    },
    'tab-4': {
      companies: [
        { name: 'Amazon', logo: 'amazon', website: 'https://amazon.com' },
        { name: 'Unilever', logo: 'unilever', website: 'https://unilever.com' },
      ],
      names: ['Peter Parker', 'Mary Jane', 'Gwen Stacy', 'Harry Osborn'],
    },
    'tab-5': {
      companies: [
        { name: 'Apple', logo: 'apple', website: 'https://apple.com' },
        { name: 'Google', logo: 'google', website: 'https://google.com' },
        { name: 'Microsoft', logo: 'microsoft', website: 'https://microsoft.com' },
      ],
      names: ['Tony Stark', 'Pepper Potts', 'Happy Hogan', 'James Rhodes', 'Vision'],
    },
    'tab-6': {
      companies: [
        { name: 'LinkedIn', logo: 'linkedin', website: 'https://linkedin.com' },
        { name: 'Amazon', logo: 'amazon', website: 'https://amazon.com' },
        { name: 'TED', logo: 'ted', website: 'https://ted.com' },
      ],
      names: ['Steve Rogers', 'Natasha Romanoff', 'Clint Barton', 'Bruce Banner', 'Thor Odinson'],
    },
  };

  const config = tabConfigs[tabId] || tabConfigs['tab-2'];
  const statuses: EmailWaterfallStatus[] = [
    'email_found', 'email_found', 'email_found', 'run_condition_not_met',
    'email_found', 'email_found', 'run_condition_not_met', 'run_condition_not_met',
    'email_found', 'email_found', 'run_condition_not_met', 'email_found', 'email_found',
  ];

  const rows: Row[] = [];
  
  for (let i = 0; i < count; i++) {
    const company = config.companies[i % config.companies.length];
    const name = i < config.names.length 
      ? config.names[i] 
      : `${config.names[i % config.names.length]} ${Math.floor(i / config.names.length)}`;
    const status = statuses[i % statuses.length];
    
    rows.push({
      id: `${tabId}-row-${i + 1}`,
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

// Generate initial data for all tabs
const generateAllTabData = (): Record<string, TabData> => {
  const tabCounts: Record<string, number> = {
    'tab-1': 150,
    'tab-2': 1000,
    'tab-3': 500,
    'tab-4': 350,
    'tab-5': 800,
    'tab-6': 1200,
  };

  const data: Record<string, TabData> = {};

  Object.entries(tabCounts).forEach(([tabId, count]) => {
    const rows = generateTabRows(tabId, count);
    data[tabId] = {
      byId: rows.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {} as Record<string, Row>),
      allIds: rows.map((row) => row.id),
      selectedIds: [],
    };
  });

  return data;
};

const initialState: TabDataState = {
  data: generateAllTabData(),
};

const tabDataSlice = createSlice({
  name: 'tabData',
  initialState,
  reducers: {
    selectTabRow: (state, action: PayloadAction<{ tabId: string; rowId: string }>) => {
      const { tabId, rowId } = action.payload;
      if (state.data[tabId] && !state.data[tabId].selectedIds.includes(rowId)) {
        state.data[tabId].selectedIds.push(rowId);
      }
    },
    deselectTabRow: (state, action: PayloadAction<{ tabId: string; rowId: string }>) => {
      const { tabId, rowId } = action.payload;
      if (state.data[tabId]) {
        state.data[tabId].selectedIds = state.data[tabId].selectedIds.filter(id => id !== rowId);
      }
    },
    toggleTabRowSelection: (state, action: PayloadAction<{ tabId: string; rowId: string }>) => {
      const { tabId, rowId } = action.payload;
      if (state.data[tabId]) {
        if (state.data[tabId].selectedIds.includes(rowId)) {
          state.data[tabId].selectedIds = state.data[tabId].selectedIds.filter(id => id !== rowId);
        } else {
          state.data[tabId].selectedIds.push(rowId);
        }
      }
    },
    selectAllTabRows: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      if (state.data[tabId]) {
        state.data[tabId].selectedIds = [...state.data[tabId].allIds];
      }
    },
    deselectAllTabRows: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      if (state.data[tabId]) {
        state.data[tabId].selectedIds = [];
      }
    },
    deleteTabRows: (state, action: PayloadAction<{ tabId: string; rowIds: string[] }>) => {
      const { tabId, rowIds } = action.payload;
      if (state.data[tabId]) {
        rowIds.forEach((id) => {
          delete state.data[tabId].byId[id];
          state.data[tabId].allIds = state.data[tabId].allIds.filter((rowId) => rowId !== id);
          state.data[tabId].selectedIds = state.data[tabId].selectedIds.filter((rowId) => rowId !== id);
        });
      }
    },
    updateTabRowEnrichment: (state, action: PayloadAction<{ tabId: string; rowId: string; generatedEmail: string }>) => {
      const { tabId, rowId, generatedEmail } = action.payload;
      if (state.data[tabId] && state.data[tabId].byId[rowId]) {
        state.data[tabId].byId[rowId].enrichmentData = {
          generatedEmail,
        };
      }
    },
  },
});

export const {
  selectTabRow,
  deselectTabRow,
  toggleTabRowSelection,
  selectAllTabRows,
  deselectAllTabRows,
  deleteTabRows,
  updateTabRowEnrichment,
} = tabDataSlice.actions;

export default tabDataSlice.reducer;
