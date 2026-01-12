"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { openModal, addToast, setSortConfig } from "@/store/slices/uiSlice";
import { deselectAllTabRows, deleteTabRows } from "@/store/slices/tabDataSlice";
import { useJobSimulation } from "@/hooks/useJobSimulation";
import { useAiEnrichment } from "@/hooks/useAiEnrichment";
import {
  Upload,
  Grid3X3,
  Columns3,
  ArrowUpDown,
  Filter,
  ChevronDown,
  Sparkles,
  MoreHorizontal,
  Trash2,
  Download,
  Copy,
  Check,
  Bot,
} from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import styles from "./Toolbar.module.css";

export const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get active tab data
  const activeTabId = useAppSelector((state) => state.workspaces.activeTabId);
  const tabData = useAppSelector((state) =>
    activeTabId ? state.tabData.data[activeTabId] : null
  );

  const totalRows = tabData?.allIds.length || 0;
  const selectedIds = tabData?.selectedIds || [];

  const visibleColumns = useAppSelector(
    (state) => state.gridMeta.visibleColumns.length
  );
  const totalColumns = useAppSelector((state) => state.gridMeta.totalColumns);
  const activeFilters = useAppSelector((state) => state.ui.activeFiltersCount);
  const sortConfig = useAppSelector((state) => state.ui.sortConfig);
  const { startEnrichmentJob, isRunning } = useJobSimulation();

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showEnrichmentMenu, setShowEnrichmentMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { enrichRows, isAiLoading } = useAiEnrichment();

  const handleSort = (field: string, direction: "asc" | "desc") => {
    dispatch(setSortConfig({ field, direction }));
    dispatch(
      addToast({
        type: "success",
        title: "Sorted",
        message: `Sorted by ${field} (${
          direction === "asc" ? "ascending" : "descending"
        })`,
      })
    );
    setShowSortMenu(false);
  };

  const handleExport = () => {
    dispatch(
      addToast({
        type: "success",
        title: "Export started",
        message: `Exporting ${
          selectedIds.length > 0 ? selectedIds.length : totalRows
        } rows to CSV...`,
      })
    );
    setShowActionMenu(false);
  };

  const handleDuplicate = () => {
    dispatch(
      addToast({
        type: "success",
        title: "Duplicated",
        message: `${selectedIds.length} rows duplicated.`,
      })
    );
    setShowActionMenu(false);
  };

  const handleDelete = () => {
    if (selectedIds.length > 0 && activeTabId) {
      dispatch(deleteTabRows({ tabId: activeTabId, rowIds: selectedIds }));
      dispatch(deselectAllTabRows(activeTabId));
      dispatch(
        addToast({
          type: "success",
          title: "Deleted",
          message: `${selectedIds.length} rows deleted.`,
        })
      );
    } else {
      dispatch(
        addToast({
          type: "warning",
          title: "No selection",
          message: "Please select rows to delete.",
        })
      );
    }
    setShowActionMenu(false);
  };

  const handleEnrichment = (type: string) => {
    startEnrichmentJob(totalRows);
    setShowEnrichmentMenu(false);
  };

  const handleAIEnrichment = async () => {
    await enrichRows(selectedIds);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <button
          className={styles.loadDataBtn}
          onClick={() => dispatch(openModal("loadData"))}
        >
          <Upload size={14} />
          <span>Load Data</span>
          <span className={styles.badge}>1</span>
          <ChevronDown size={14} />
        </button>

        <div className={styles.divider} />

        <Chip
          label={`${totalRows.toLocaleString()} Rows`}
          icon={<Grid3X3 size={14} />}
        />

        <Chip
          label={`${visibleColumns}/${totalColumns} Columns`}
          icon={<Columns3 size={14} />}
          onClick={() => dispatch(openModal("columnPicker"))}
        />

        {/* Sort dropdown */}
        <div className={styles.dropdownContainer}>
          <Chip
            label={sortConfig ? `Sort: ${sortConfig.field}` : "Sort by"}
            icon={<ArrowUpDown size={14} />}
            onClick={() => setShowSortMenu(!showSortMenu)}
            active={sortConfig !== null}
          />
          {showSortMenu && (
            <div className={styles.dropdown}>
              <button onClick={() => handleSort("companyName", "asc")}>
                Company Name (A-Z)
              </button>
              <button onClick={() => handleSort("companyName", "desc")}>
                Company Name (Z-A)
              </button>
              <button onClick={() => handleSort("lastUpdatedAt", "desc")}>
                Last Updated (Newest)
              </button>
              <button onClick={() => handleSort("lastUpdatedAt", "asc")}>
                Last Updated (Oldest)
              </button>
              <button onClick={() => handleSort("importedData", "asc")}>
                Name (A-Z)
              </button>
            </div>
          )}
        </div>

        <Chip
          label="Filter"
          icon={<Filter size={14} />}
          badge={activeFilters}
          onClick={() => dispatch(openModal("filter"))}
          active={activeFilters > 0}
        />
      </div>

      <div className={styles.right}>
        {/* Action dropdown */}
        <div className={styles.dropdownContainer}>
          <button
            className={styles.actionBtn}
            onClick={() => setShowActionMenu(!showActionMenu)}
          >
            <span>Action</span>
            {selectedIds.length > 0 && (
              <span className={styles.selectedBadge}>{selectedIds.length}</span>
            )}
            <ChevronDown size={14} />
          </button>
          {showActionMenu && (
            <div className={styles.dropdown}>
              <button onClick={handleExport}>
                <Download size={14} /> Export to CSV
              </button>
              <button
                onClick={handleDuplicate}
                disabled={selectedIds.length === 0}
              >
                <Copy size={14} /> Duplicate Rows
              </button>
              <button
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
                className={styles.dangerBtn}
              >
                <Trash2 size={14} /> Delete Selected
              </button>
              <button
                onClick={() => {
                  if (activeTabId) dispatch(deselectAllTabRows(activeTabId));
                  setShowActionMenu(false);
                }}
              >
                <Check size={14} /> Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Enrichment dropdown */}
        <div className={styles.dropdownContainer}>
          <button
            className={styles.enrichmentBtn}
            onClick={() => setShowEnrichmentMenu(!showEnrichmentMenu)}
            disabled={isRunning}
          >
            <Sparkles size={14} />
            <span>{isRunning ? "Running..." : "Enrichment"}</span>
            <ChevronDown size={14} />
          </button>
          {showEnrichmentMenu && (
            <div className={styles.dropdown}>
              <button onClick={() => handleEnrichment("email")}>
                🔍 Find Emails
              </button>
              <button onClick={() => handleEnrichment("phone")}>
                📞 Find Phone Numbers
              </button>
              <button onClick={() => handleEnrichment("linkedin")}>
                🔗 Enrich LinkedIn Data
              </button>
              <button onClick={() => handleEnrichment("company")}>
                🏢 Company Information
              </button>
            </div>
          )}
        </div>

        <button
          className={styles.moreBtn}
          onClick={() =>
            dispatch(
              addToast({
                type: "info",
                title: "More options",
                message: "Additional settings coming soon!",
              })
            )
          }
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};
