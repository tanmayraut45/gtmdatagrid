"use client";

import React, { memo } from "react";
import { Row, ColumnDef } from "@/types";
import { GridCell } from "../GridCell";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import styles from "./GridRow.module.css";

interface GridRowProps {
  row: Row;
  rowIndex: number;
  columns: ColumnDef[];
  isSelected: boolean;
  onSelect: (rowId: string) => void;
  onEnrich: (rowId: string) => void;
  style?: React.CSSProperties;
}

export const GridRow: React.FC<GridRowProps> = memo(
  ({ row, rowIndex, columns, isSelected, onSelect, onEnrich, style }) => {
    return (
      <div
        className={`${styles.row} ${isSelected ? styles.selected : ""} ${
          rowIndex % 2 === 1 ? styles.alternate : ""
        }`}
        style={style}
      >
        {columns.map((column) => {
          if (column.type === "checkbox") {
            return (
              <div key={column.id} className={styles.checkboxCell}>
                <Checkbox.Root
                  className={styles.checkbox}
                  checked={isSelected}
                  onCheckedChange={() => onSelect(row.id)}
                >
                  <Checkbox.Indicator className={styles.checkboxIndicator}>
                    <Check size={12} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
            );
          }

          if (column.type === "rowNumber") {
            return (
              <div key={column.id} className={styles.rowNumberCell}>
                {rowIndex + 1}
              </div>
            );
          }

          return <GridCell key={column.id} column={column} row={row} />;
        })}

        {/* Hover AI Trigger */}
        <div className={styles.enrichAction}>
          <button
            className={styles.enrichButton}
            onClick={(e) => {
              e.stopPropagation();
              onEnrich(row.id);
            }}
          >
            <Sparkles size={12} />
            <span>AI Enrich</span>
          </button>
        </div>
      </div>
    );
  }
);

GridRow.displayName = "GridRow";
