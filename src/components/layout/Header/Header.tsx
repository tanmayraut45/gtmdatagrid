"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { setTheme } from "@/store/slices/settingsSlice";
import { Home, ChevronRight, Star, Moon, Sun, CreditCard } from "lucide-react";
import { ProgressOverlay } from "../ProgressOverlay";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const breadcrumbs = useAppSelector((state) => state.workspaces.breadcrumbs);
  const theme = useAppSelector(
    (state) => state.settings?.settings?.theme || "light"
  );

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
        <button
          className={styles.themeToggle}
          onClick={() =>
            dispatch(setTheme(theme === "dark" ? "light" : "dark"))
          }
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <span className={styles.credits}>
          <CreditCard size={14} className={styles.creditsIcon} />
          <span>500/500</span>
        </span>
        <button className={styles.freeButton}>Free</button>
      </div>
    </header>
  );
};
