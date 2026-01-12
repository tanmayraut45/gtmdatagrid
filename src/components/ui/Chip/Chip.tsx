import React from "react";
import clsx from "clsx";
import styles from "./Chip.module.css";

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  rightIcon,
  badge,
  active = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.chip, active && styles.active, className)}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};
