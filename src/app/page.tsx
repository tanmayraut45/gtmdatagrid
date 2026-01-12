"use client";

import {
  Header,
  PaymentBanner,
  Toolbar,
  BottomTabs,
} from "@/components/layout";
import { DataGrid } from "@/components/grid";
import { ToastContainer } from "@/components/ui";
import {
  LoadDataModal,
  ColumnPickerModal,
  FilterPanel,
} from "@/components/modals";
import { EnrichmentSuccessModal } from "@/components/modals/EnrichmentSuccessModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.app}>
      {/* Top header with breadcrumbs and progress */}
      <Header />

      {/* Payment failed banner */}
      <PaymentBanner />

      {/* Toolbar with actions */}
      <Toolbar />

      {/* Main data grid - takes remaining space */}
      <main className={styles.gridArea}>
        <DataGrid />
      </main>

      {/* Bottom tabs - fixed at bottom */}
      <BottomTabs />

      {/* Modals */}
      <LoadDataModal />
      <ColumnPickerModal />
      <FilterPanel />
      <EnrichmentSuccessModal />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
