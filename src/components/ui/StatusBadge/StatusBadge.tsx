import React from "react";
import clsx from "clsx";
import styles from "./StatusBadge.module.css";
import { Check, AlertCircle, Clock, X, Loader } from "lucide-react";

export type StatusType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending"
  | "neutral";

export interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  className?: string;
}

const statusIcons: Record<StatusType, React.ReactNode> = {
  success: <Check size={12} />,
  warning: <AlertCircle size={12} />,
  error: <X size={12} />,
  info: <AlertCircle size={12} />,
  pending: <Clock size={12} />,
  neutral: <Loader size={12} />,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  className,
}) => {
  return (
    <span className={clsx(styles.statusBadge, styles[status], className)}>
      {showIcon && <span className={styles.icon}>{statusIcons[status]}</span>}
      <span className={styles.label}>{label}</span>
    </span>
  );
};
