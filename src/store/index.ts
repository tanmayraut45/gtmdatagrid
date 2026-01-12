import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspacesReducer from './slices/workspacesSlice';
import gridMetaReducer from './slices/gridMetaSlice';
import rowsReducer from './slices/rowsSlice';
import jobsReducer from './slices/jobsSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';
import tabDataReducer from './slices/tabDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspaces: workspacesReducer,
    gridMeta: gridMetaReducer,
    rows: rowsReducer,
    jobs: jobsReducer,
    ui: uiReducer,
    settings: settingsReducer,
    tabData: tabDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredPaths: ['rows.selectedIds'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

