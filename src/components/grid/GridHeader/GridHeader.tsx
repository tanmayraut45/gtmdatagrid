"use client";

import React, { useState, useCallback } from "react";
import { ColumnDef } from "@/types";
import { useAppDispatch } from "@/hooks/useRedux";
import { setColumnWidth } from "@/store/slices/gridMetaSlice";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Minus, ChevronDown } from "lucide-react";
import styles from "./GridHeader.module.css";

interface GridHeaderProps {
  columns: ColumnDef[];
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  allSelected,
  someSelected,
  onSelectAll,
}) => {
  const dispatch = useAppDispatch();
  const [resizing, setResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnId: string, currentWidth: number) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(columnId);
      setStartX(e.clientX);
      setStartWidth(currentWidth);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - e.clientX;
        const newWidth = Math.max(50, currentWidth + diff); // Minimum 50px
        dispatch(setColumnWidth({ columnId, width: newWidth }));
      };

      const handleMouseUp = () => {
        setResizing(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [dispatch]
  );

  return (
    <div className={styles.headerRow}>
      {columns.map((column) => {
        if (column.type === "checkbox") {
          return (
            <div key={column.id} className={styles.checkboxCell}>
              <Checkbox.Root
                className={styles.checkbox}
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={onSelectAll}
              >
                <Checkbox.Indicator className={styles.checkboxIndicator}>
                  {someSelected && !allSelected ? (
                    <Minus size={12} />
                  ) : (
                    <Check size={12} />
                  )}
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
          );
        }

        if (column.type === "rowNumber") {
          return (
            <div key={column.id} className={styles.rowNumberCell}>
              #
            </div>
          );
        }

        return (
          <div
            key={column.id}
            className={styles.headerCell}
            style={{ width: column.width, minWidth: column.minWidth }}
          >
            <span className={styles.headerIcon}>ƒ</span>
            <span className={styles.headerText}>{column.header}</span>
            {column.sortable && (
              <ChevronDown size={12} className={styles.sortIcon} />
            )}
            {/* Resize handle */}
            <div
              className={`${styles.resizeHandle} ${
                resizing === column.id ? styles.resizing : ""
              }`}
              onMouseDown={(e) =>
                handleResizeStart(e, column.id, column.width || 150)
              }
            />
          </div>
        );
      })}
    </div>
  );
};
