"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { AlertCircle } from "lucide-react";
import styles from "./PaymentBanner.module.css";

export const PaymentBanner: React.FC = () => {
  const billing = useAppSelector((state) => state.auth.billing);

  if (billing.status === "active") {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.message}>
          {billing.message ||
            `Payment failed. ${billing.credits.toLocaleString()} credits will permanently expire in ${
              billing.expiresIn
            } days`}
        </span>
        <AlertCircle size={16} className={styles.icon} />
      </div>
      <button className={styles.payButton}>Pay Now</button>
    </div>
  );
};
