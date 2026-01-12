"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import {
  closeModal,
  addFilter,
  removeFilter,
  updateFilter,
} from "@/store/slices/uiSlice";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./FilterPanel.module.css";

const operators = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not equals" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Does not contain" },
  { value: "isEmpty", label: "Is empty" },
  { value: "isNotEmpty", label: "Is not empty" },
];

export const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.filter);
  const filters = useAppSelector((state) => state.ui.filters);
  const columns = useAppSelector((state) => state.gridMeta.columns);

  const filterableColumns = columns.filter((col) => col.filterable);

  const handleClose = () => {
    dispatch(closeModal("filter"));
  };

  const handleAddFilter = () => {
    dispatch(
      addFilter({
        id: `filter-${Date.now()}`,
        field: filterableColumns[0]?.id || "",
        operator: "contains",
        value: "",
      })
    );
  };

  const handleRemoveFilter = (id: string) => {
    dispatch(removeFilter(id));
  };

  const handleUpdateFilter = (id: string, updates: Record<string, string>) => {
    dispatch(updateFilter({ id, updates }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Filters</Dialog.Title>
            <span className={styles.counter}>{filters.length} active</span>
            <Dialog.Close asChild>
              <button className={styles.closeBtn}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            {filters.length === 0 ? (
              <p className={styles.empty}>No filters applied</p>
            ) : (
              <div className={styles.filterList}>
                {filters.map((filter, index) => (
                  <div key={filter.id} className={styles.filterRow}>
                    <span className={styles.filterLabel}>
                      {index === 0 ? "Where" : "And"}
                    </span>
                    <select
                      className={styles.select}
                      value={filter.field}
                      onChange={(e) =>
                        handleUpdateFilter(filter.id, { field: e.target.value })
                      }
                    >
                      {filterableColumns.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.header}
                        </option>
                      ))}
                    </select>
                    <select
                      className={styles.select}
                      value={filter.operator}
                      onChange={(e) =>
                        handleUpdateFilter(filter.id, {
                          operator: e.target.value,
                        })
                      }
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Value"
                      value={filter.value as string}
                      onChange={(e) =>
                        handleUpdateFilter(filter.id, { value: e.target.value })
                      }
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFilter(filter.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className={styles.addBtn} onClick={handleAddFilter}>
              <Plus size={16} />
              <span>Add filter</span>
            </button>
          </div>

          <div className={styles.footer}>
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Apply Filters
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
