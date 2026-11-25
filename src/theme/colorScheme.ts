export type ThemeName = "dark" | "light" | "high-contrast";

export const themeColors = {
  dark: {
    systemBg: "#000000",
    surfaceCanvas: "#ffffff",
    surfaceGrouped: "#f4f4f6",
    surfaceCard: "#ffffff",
    labelPrimary: "#000000",
    labelSecondary: "#6e6e73",
    labelTertiary: "#8e8e93",
    separatorHairline: "#e5e5ea",
    separatorOpaque: "#d1d1d6",
    fillTranslucent: "rgba(0, 0, 0, 0.04)",
    actionDestructive: "#d70015",
    actionDestructivePressed: "#b00020",
  },
  light: {
    systemBg: "#ffffff",
    surfaceCanvas: "#f4f4f6",
    surfaceGrouped: "#e5e5ea",
    surfaceCard: "#ffffff",
    labelPrimary: "#000000",
    labelSecondary: "#6e6e73",
    labelTertiary: "#8e8e93",
    separatorHairline: "#e5e5ea",
    separatorOpaque: "#d1d1d6",
    fillTranslucent: "rgba(0, 0, 0, 0.04)",
    actionDestructive: "#d70015",
    actionDestructivePressed: "#b00020",
  },
  "high-contrast": {
    systemBg: "#000000",
    surfaceCanvas: "#ffffff",
    surfaceGrouped: "#ffffff",
    surfaceCard: "#ffffff",
    labelPrimary: "#ffffff",
    labelSecondary: "#ffffff",
    labelTertiary: "#ffffff",
    separatorHairline: "#ffffff",
    separatorOpaque: "#ffffff",
    fillTranslucent: "rgba(255, 255, 255, 0.04)",
    actionDestructive: "#ffffff",
    actionDestructivePressed: "#e0e0e0",
  },
} as const;

export const defaultTheme: ThemeName = "dark";
