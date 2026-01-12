"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { Home, ChevronRight, Star } from "lucide-react";
import { ProgressOverlay } from "../ProgressOverlay";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const breadcrumbs = useAppSelector((state) => state.workspaces.breadcrumbs);

  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumbs}>
        <a href="/" className={styles.homeLink}>
          <Home size={16} />
        </a>
        <Star size={14} className={styles.star} />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={14} className={styles.separator} />
            )}
            {crumb.href ? (
              <a href={crumb.href} className={styles.link}>
                {crumb.label}
              </a>
            ) : (
              <span className={styles.current}>{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Progress indicator - inline in header */}
      <div className={styles.center}>
        <ProgressOverlay />
      </div>

      <div className={styles.actions}>
        <span className={styles.credits}>
          <span className={styles.creditsIcon}>💳</span>
          500/500
        </span>
        <button className={styles.freeButton}>Free</button>
      </div>
    </header>
  );
};
