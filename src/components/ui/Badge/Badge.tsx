import React from "react";
import clsx from "clsx";
import styles from "./Badge.module.css";

export interface BadgeProps {
  count?: number;
  variant?: "default" | "success" | "warning" | "error" | "info" | "gray";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
}) => {
  if (dot) {
    return <span className={clsx(styles.dot, styles[variant], className)} />;
  }

  return (
    <span
      className={clsx(styles.badge, styles[variant], styles[size], className)}
    >
      {children ?? count}
    </span>
  );
};
