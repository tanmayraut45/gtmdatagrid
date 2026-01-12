import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSettings } from '@/types';

interface SettingsState {
  settings: UserSettings;
}

const initialState: SettingsState = {
  settings: {
    autoRun: true,
    autoDedup: true,
    theme: 'light',
    compactMode: false,
    showRowNumbers: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    toggleAutoRun: (state) => {
      state.settings.autoRun = !state.settings.autoRun;
    },
    toggleAutoDedup: (state) => {
      state.settings.autoDedup = !state.settings.autoDedup;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.settings.theme = action.payload;
    },
    toggleCompactMode: (state) => {
      state.settings.compactMode = !state.settings.compactMode;
    },
    toggleShowRowNumbers: (state) => {
      state.settings.showRowNumbers = !state.settings.showRowNumbers;
    },
    resetSettings: (state) => {
      state.settings = initialState.settings;
    },
  },
});

export const {
  updateSettings,
  toggleAutoRun,
  toggleAutoDedup,
  setTheme,
  toggleCompactMode,
  toggleShowRowNumbers,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
