"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useRedux";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector(
    (state) => state.settings?.settings?.theme || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
};
