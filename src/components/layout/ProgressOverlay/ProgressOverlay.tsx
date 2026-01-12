"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import styles from "./ProgressOverlay.module.css";

export const ProgressOverlay: React.FC = () => {
  const activeJob = useAppSelector((state) => {
    const jobId = state.jobs.activeJobId;
    return jobId ? state.jobs.jobs[jobId] : null;
  });
  const isRunning = useAppSelector((state) => state.jobs.isRunning);

  if (!isRunning || !activeJob) {
    return null;
  }

  // This now renders inline in the header, not as a fixed overlay
  return (
    <div className={styles.overlay}>
      <span className={styles.label}>Grid running</span>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${activeJob.progress}%` }}
        />
      </div>
      <span className={styles.percentage}>{activeJob.progress}%</span>
    </div>
  );
};
