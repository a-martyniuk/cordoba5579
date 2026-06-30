"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("darkMode");
    if (saved === "true" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkModeState(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkModeState(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setDarkMode = (mode: boolean) => {
    setDarkModeState(mode);
    if (mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", mode.toString());
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode: mounted ? darkMode : false, setDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
