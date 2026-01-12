"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { closeModal } from "@/store/slices/uiSlice";
import { toggleColumnVisibility } from "@/store/slices/gridMetaSlice";
import { X, Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./ColumnPickerModal.module.css";

export const ColumnPickerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.columnPicker);
  const columns = useAppSelector((state) => state.gridMeta.columns);
  const visibleColumns = useAppSelector(
    (state) => state.gridMeta.visibleColumns
  );

  const handleClose = () => {
    dispatch(closeModal("columnPicker"));
  };

  const handleToggle = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  // Filter out checkbox and rowNumber columns
  const editableColumns = columns.filter(
    (col) => col.type !== "checkbox" && col.type !== "rowNumber"
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Manage Columns</Dialog.Title>
            <span className={styles.counter}>
              {visibleColumns.length - 2}/{columns.length - 2} visible
            </span>
            <Dialog.Close asChild>
              <button className={styles.closeBtn}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            <div className={styles.columnList}>
              {editableColumns.map((column) => (
                <div key={column.id} className={styles.columnItem}>
                  <GripVertical size={16} className={styles.grip} />
                  <Checkbox.Root
                    className={styles.checkbox}
                    checked={visibleColumns.includes(column.id)}
                    onCheckedChange={() => handleToggle(column.id)}
                  >
                    <Checkbox.Indicator className={styles.checkboxIndicator}>
                      <Check size={12} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className={styles.columnName}>{column.header}</span>
                  <span className={styles.columnType}>{column.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
