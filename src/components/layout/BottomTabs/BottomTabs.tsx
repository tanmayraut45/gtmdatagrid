"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { setActiveTab } from "@/store/slices/workspacesSlice";
import { toggleAutoRun, toggleAutoDedup } from "@/store/slices/settingsSlice";
import { useJobSimulation } from "@/hooks/useJobSimulation";
import { addToast } from "@/store/slices/uiSlice";
import {
  Plus,
  MoreVertical,
  XCircle,
  Play,
  Copy,
  Headphones,
} from "lucide-react";
import styles from "./BottomTabs.module.css";

export const BottomTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.workspaces.tabs);
  const activeTabId = useAppSelector((state) => state.workspaces.activeTabId);
  const settings = useAppSelector((state) => state.settings.settings);
  const { killJob, isRunning } = useJobSimulation();

  const handleKillRun = () => {
    if (isRunning) {
      killJob();
    } else {
      dispatch(
        addToast({
          type: "info",
          title: "No job running",
          message: "There is no active job to kill.",
        })
      );
    }
  };

  const handleAutoRun = () => {
    dispatch(toggleAutoRun());
    dispatch(
      addToast({
        type: "success",
        title: settings.autoRun ? "Auto Run disabled" : "Auto Run enabled",
        message: settings.autoRun
          ? "Jobs will no longer start automatically."
          : "Jobs will now start automatically when data is loaded.",
      })
    );
  };

  const handleAutoDedup = () => {
    dispatch(toggleAutoDedup());
    dispatch(
      addToast({
        type: "success",
        title: settings.autoDedup
          ? "Auto Dedupe disabled"
          : "Auto Dedupe enabled",
        message: settings.autoDedup
          ? "Automatic deduplication is now off."
          : "Duplicate rows will be automatically removed.",
      })
    );
  };

  const handleSupport = () => {
    dispatch(
      addToast({
        type: "info",
        title: "Support",
        message: "Contact support at support@bitscale.com",
      })
    );
  };

  return (
    <div className={styles.bottomTabs}>
      <div className={styles.tabsContainer}>
        <button className={styles.addTab}>
          <Plus size={14} />
          <span>Grid</span>
        </button>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                tab.id === activeTabId ? styles.active : ""
              }`}
              onClick={() => dispatch(setActiveTab(tab.id))}
            >
              <span className={styles.tabName}>{tab.name}</span>
              <MoreVertical size={12} className={styles.tabMenu} />
            </button>
          ))}
        </div>

        <div className={styles.scrollIndicator}>
          <span>›</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${styles.killRun} ${
            isRunning ? styles.active : ""
          }`}
          onClick={handleKillRun}
        >
          <XCircle size={14} />
          <span>Kill Run</span>
        </button>

        <button
          className={`${styles.controlBtn} ${
            settings.autoRun ? styles.active : ""
          }`}
          onClick={handleAutoRun}
        >
          <Play size={14} />
          <span>Auto Run</span>
        </button>

        <button
          className={`${styles.controlBtn} ${
            settings.autoDedup ? styles.active : ""
          }`}
          onClick={handleAutoDedup}
        >
          <Copy size={14} />
          <span>Auto Dedupe</span>
        </button>

        <button className={styles.controlBtn} onClick={handleSupport}>
          <Headphones size={14} />
          <span>Support</span>
        </button>
      </div>
    </div>
  );
};
