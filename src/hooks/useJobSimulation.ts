'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { createJob, updateJobProgress, cancelJob } from '@/store/slices/jobsSlice';
import { addToast } from '@/store/slices/uiSlice';

export const useJobSimulation = () => {
  const dispatch = useAppDispatch();
  const isRunning = useAppSelector((state) => state.jobs.isRunning);
  const activeJobId = useAppSelector((state) => state.jobs.activeJobId);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start a simulated enrichment job
  const startEnrichmentJob = useCallback((rowCount: number = 1000) => {
    if (isRunning) {
      dispatch(addToast({
        type: 'warning',
        title: 'Job already running',
        message: 'Please wait for the current job to complete or kill it.',
      }));
      return null;
    }

    const jobId = `job-${Date.now()}`;
    
    dispatch(createJob({
      id: jobId,
      type: 'enrichment',
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }));

    dispatch(addToast({
      type: 'info',
      title: 'Enrichment started',
      message: `Processing ${rowCount.toLocaleString()} rows...`,
    }));

    // Simulate progress updates
    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += Math.random() * 8 + 2; // Random progress 2-10%
      
      if (progress >= 100) {
        progress = 100;
        dispatch(updateJobProgress({ id: jobId, progress: 100 }));
        dispatch(addToast({
          type: 'success',
          title: 'Enrichment complete',
          message: `Successfully processed ${rowCount.toLocaleString()} rows.`,
        }));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        dispatch(updateJobProgress({ id: jobId, progress: Math.floor(progress) }));
      }
    }, 500);

    return jobId;
  }, [dispatch, isRunning]);

  // Kill the current running job
  const killJob = useCallback(() => {
    if (activeJobId) {
      dispatch(cancelJob(activeJobId));
      dispatch(addToast({
        type: 'warning',
        title: 'Job cancelled',
        message: 'The enrichment job was stopped.',
      }));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [dispatch, activeJobId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startEnrichmentJob,
    killJob,
    isRunning,
    activeJobId,
  };
};
