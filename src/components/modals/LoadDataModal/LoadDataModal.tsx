"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { closeModal } from "@/store/slices/uiSlice";
import { addToast } from "@/store/slices/uiSlice";
import { X, Upload, Database, FileSpreadsheet, Link } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./LoadDataModal.module.css";

const dataSources = [
  {
    id: "csv",
    name: "Upload CSV",
    icon: <FileSpreadsheet size={24} />,
    description: "Import data from a CSV file",
  },
  {
    id: "api",
    name: "Connect API",
    icon: <Link size={24} />,
    description: "Connect to an external API",
  },
  {
    id: "database",
    name: "Database",
    icon: <Database size={24} />,
    description: "Import from database",
  },
];

export const LoadDataModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.loadData);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    dispatch(closeModal("loadData"));
    setSelectedSource(null);
  };

  const handleImport = async () => {
    if (!selectedSource) return;

    setIsLoading(true);
    // Simulate import
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    dispatch(
      addToast({
        type: "success",
        title: "Data imported successfully",
        message: "Your data has been loaded into the grid.",
      })
    );
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Load Data</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeBtn}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            <p className={styles.subtitle}>Choose a data source to import</p>

            <div className={styles.sources}>
              {dataSources.map((source) => (
                <button
                  key={source.id}
                  className={`${styles.sourceCard} ${
                    selectedSource === source.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <span className={styles.sourceIcon}>{source.icon}</span>
                  <span className={styles.sourceName}>{source.name}</span>
                  <span className={styles.sourceDesc}>
                    {source.description}
                  </span>
                </button>
              ))}
            </div>

            {selectedSource === "csv" && (
              <div className={styles.uploadArea}>
                <Upload size={32} className={styles.uploadIcon} />
                <p>Drag and drop your CSV file here</p>
                <p className={styles.uploadHint}>or click to browse</p>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!selectedSource}
              loading={isLoading}
            >
              Import Data
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
