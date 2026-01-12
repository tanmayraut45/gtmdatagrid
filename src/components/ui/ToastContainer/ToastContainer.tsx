"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { removeToast } from "@/store/slices/uiSlice";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import styles from "./ToastContainer.module.css";

const toastIcons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

export const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  useEffect(() => {
    toasts.forEach((toast) => {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>{toastIcons[toast.type]}</span>
          <div className={styles.content}>
            <p className={styles.title}>{toast.title}</p>
            {toast.message && <p className={styles.message}>{toast.message}</p>}
          </div>
          <button
            className={styles.close}
            onClick={() => dispatch(removeToast(toast.id))}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
