"use client";

import React, { useMemo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import {
  toggleTabRowSelection,
  selectAllTabRows,
  deselectAllTabRows,
} from "@/store/slices/tabDataSlice";
import { Row } from "@/types";
import { GridRow } from "../GridRow";
import { GridHeader } from "../GridHeader";
import styles from "./DataGrid.module.css";

export const DataGrid: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get active tab ID
  const activeTabId = useAppSelector((state) => state.workspaces.activeTabId);

  // Get tab-specific data
  const tabData = useAppSelector((state) =>
    activeTabId ? state.tabData.data[activeTabId] : null
  );

  const visibleColumnIds = useAppSelector(
    (state) => state.gridMeta.visibleColumns
  );
  const columnsConfig = useAppSelector((state) => state.gridMeta.columns);

  // Refs for scroll sync
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Transform normalized data to array
  const data = useMemo(() => {
    if (!tabData) return [];
    return tabData.allIds.map((id) => tabData.byId[id]);
  }, [tabData]);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return columnsConfig.filter((col) => visibleColumnIds.includes(col.id));
  }, [columnsConfig, visibleColumnIds]);

  // Selection state
  const selectedIds = tabData?.selectedIds || [];
  const allIds = tabData?.allIds || [];
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = selectedIds.length === allIds.length && allIds.length > 0;
  const someSelected = selectedIds.length > 0 && !allSelected;

  // Define table columns
  const columns = useMemo<ColumnDef<Row>[]>(() => {
    return visibleColumns.map((col) => ({
      id: col.id,
      accessorKey: col.accessorKey,
      header: col.header,
      size: col.width || 150,
      minSize: col.minWidth || 80,
      maxSize: col.maxWidth || 400,
    }));
  }, [visibleColumns]);

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  // Virtual row configuration
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => 48, // Row height
    overscan: 10, // Render extra rows for smoother scrolling
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Sync horizontal scroll between header and body
  const handleBodyScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  // Handlers
  const handleSelectAll = useCallback(() => {
    if (!activeTabId) return;
    if (allSelected) {
      dispatch(deselectAllTabRows(activeTabId));
    } else {
      dispatch(selectAllTabRows(activeTabId));
    }
  }, [dispatch, allSelected, activeTabId]);

  const handleRowSelect = useCallback(
    (rowId: string) => {
      if (!activeTabId) return;
      dispatch(toggleTabRowSelection({ tabId: activeTabId, rowId }));
    },
    [dispatch, activeTabId]
  );

  // Calculate total width of all columns
  const totalWidth = useMemo(() => {
    return visibleColumns.reduce((acc, col) => acc + (col.width || 150), 0);
  }, [visibleColumns]);

  if (!tabData) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.emptyState}>Select a tab to view data</div>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {/* Header - scrolls horizontally in sync with body */}
      <div className={styles.headerWrapper} ref={headerRef}>
        <div style={{ minWidth: totalWidth }}>
          <GridHeader
            columns={visibleColumns}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      {/* Virtualized body with horizontal scroll */}
      <div
        ref={bodyRef}
        className={styles.gridBody}
        onScroll={handleBodyScroll}
      >
        <div
          className={styles.virtualContainer}
          style={{ height: `${totalSize}px`, minWidth: totalWidth }}
        >
          {virtualRows.map((virtualRow) => {
            const row = data[virtualRow.index];
            const isSelected = selectedSet.has(row.id);

            return (
              <GridRow
                key={row.id}
                row={row}
                rowIndex={virtualRow.index}
                columns={visibleColumns}
                isSelected={isSelected}
                onSelect={handleRowSelect}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
