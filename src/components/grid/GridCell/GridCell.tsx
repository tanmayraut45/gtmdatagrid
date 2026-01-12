"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Row, ColumnDef, EmailWaterfallStatus } from "@/types";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { ExternalLink, ChevronRight } from "lucide-react";
import styles from "./GridCell.module.css";

interface GridCellProps {
  column: ColumnDef;
  row: Row;
}

// Company logos - files in public folder
const companyLogos: Record<string, string> = {
  google: "/google-svg.svg",
  amazon: "/amazon-svg.svg",
  ted: "/ted-svg.svg",
  linkedin: "/Linkedin-logo-blue-In-square-40px.png",
  microsoft: "/32px-Microsoft_logo.svg.png",
  apple: "/Apple_logo_grey.svg.png",
};

// Fallback emoji for companies without images
const companyLogoEmojis: Record<string, string> = {
  unilever: "🧴",
};

// Email status mapping
const emailStatusMap: Record<
  EmailWaterfallStatus,
  { status: StatusType; label: string }
> = {
  email_found: { status: "success", label: "Email Found" },
  run_condition_not_met: { status: "warning", label: "Run condition not met" },
  pending: { status: "neutral", label: "Pending" },
  processing: { status: "info", label: "Processing" },
  failed: { status: "error", label: "Failed" },
};

// Company Logo Component
const CompanyLogo: React.FC<{ company: string }> = ({ company }) => {
  const lowerCompany = company?.toLowerCase() || "";

  // Check if we have image for this company
  if (companyLogos[lowerCompany]) {
    return (
      <span className={styles.avatarImg}>
        <Image
          src={companyLogos[lowerCompany]}
          alt={company}
          width={20}
          height={20}
          className={styles.logoSvg}
        />
      </span>
    );
  }

  // Fallback to emoji
  const emoji = companyLogoEmojis[lowerCompany] || "🏢";
  return <span className={styles.avatar}>{emoji}</span>;
};

export const GridCell: React.FC<GridCellProps> = memo(({ column, row }) => {
  const value = row[column.accessorKey as keyof Row];
  const width = column.width || 150;

  // Text with Avatar (Company Name)
  if (column.type === "textWithAvatar") {
    return (
      <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
        <div className={styles.textWithAvatar}>
          <CompanyLogo company={row.companyLogo || ""} />
          <span className={styles.companyName}>{value as string}</span>
        </div>
      </div>
    );
  }

  // Link
  if (column.type === "link") {
    const url = value as string;
    return (
      <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <ExternalLink size={12} className={styles.linkIcon} />
          <span className={styles.linkText}>{url}</span>
        </a>
      </div>
    );
  }

  // Status badge (Email Waterfall)
  if (column.type === "status") {
    const statusValue = value as EmailWaterfallStatus;
    const statusConfig = emailStatusMap[statusValue] || emailStatusMap.pending;
    return (
      <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
        <div className={styles.statusCell}>
          <StatusBadge
            status={statusConfig.status}
            label={statusConfig.label}
          />
          <ChevronRight size={14} className={styles.chevron} />
        </div>
      </div>
    );
  }

  // Timestamp
  if (column.type === "timestamp") {
    return (
      <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
        <span className={styles.timestamp}>{value as string}</span>
      </div>
    );
  }

  // Text (with pill for importedData)
  if (column.id === "importedData") {
    return (
      <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
        <div className={styles.namePill}>
          <span className={styles.nameIcon}>👤</span>
          <span className={styles.nameText}>{value as string}</span>
          <ChevronRight size={14} className={styles.chevron} />
        </div>
      </div>
    );
  }

  // Default text
  return (
    <div className={styles.cell} style={{ width, minWidth: column.minWidth }}>
      <span className={styles.text}>{value as string}</span>
    </div>
  );
});

GridCell.displayName = "GridCell";
