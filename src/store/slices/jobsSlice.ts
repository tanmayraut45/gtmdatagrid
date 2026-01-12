import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobStatus } from '@/types';

interface JobsState {
  jobs: Record<string, Job>;
  activeJobId: string | null;
  isRunning: boolean;
}

const initialState: JobsState = {
  jobs: {
    'job-1': {
      id: 'job-1',
      type: 'enrichment',
      status: 'running',
      progress: 10,
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    },
  },
  activeJobId: 'job-1',
  isRunning: true,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    createJob: (state, action: PayloadAction<Job>) => {
      state.jobs[action.payload.id] = action.payload;
      state.activeJobId = action.payload.id;
      state.isRunning = true;
    },
    updateJobProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const { id, progress } = action.payload;
      if (state.jobs[id]) {
        state.jobs[id].progress = progress;
        if (progress >= 100) {
          state.jobs[id].status = 'completed';
          state.jobs[id].completedAt = new Date().toISOString();
          if (state.activeJobId === id) {
            state.isRunning = false;
          }
        }
      }
    },
    updateJobStatus: (state, action: PayloadAction<{ id: string; status: JobStatus }>) => {
      const { id, status } = action.payload;
      if (state.jobs[id]) {
        state.jobs[id].status = status;
        if (status === 'completed' || status === 'failed' || status === 'cancelled') {
          state.jobs[id].completedAt = new Date().toISOString();
          if (state.activeJobId === id) {
            state.isRunning = false;
          }
        }
      }
    },
    cancelJob: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.jobs[id]) {
        state.jobs[id].status = 'cancelled';
        state.jobs[id].completedAt = new Date().toISOString();
        if (state.activeJobId === id) {
          state.isRunning = false;
          state.activeJobId = null;
        }
      }
    },
    setActiveJob: (state, action: PayloadAction<string | null>) => {
      state.activeJobId = action.payload;
    },
    removeJob: (state, action: PayloadAction<string>) => {
      delete state.jobs[action.payload];
      if (state.activeJobId === action.payload) {
        state.activeJobId = null;
        state.isRunning = false;
      }
    },
    clearCompletedJobs: (state) => {
      Object.keys(state.jobs).forEach((id) => {
        if (state.jobs[id].status === 'completed' || state.jobs[id].status === 'failed') {
          delete state.jobs[id];
        }
      });
    },
  },
});

export const {
  createJob,
  updateJobProgress,
  updateJobStatus,
  cancelJob,
  setActiveJob,
  removeJob,
  clearCompletedJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
