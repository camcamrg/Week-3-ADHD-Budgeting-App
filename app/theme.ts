"use client";

import { createTheme } from "@mui/material/styles";

/**
 * Momentum's design system theme — the single source of truth for how the app
 * looks (Box 17: "the theme is one file that holds your design tokens").
 *
 * Vibe: warm, cozy, "dopamine UX" — calm teal/sage anchors with warm
 * terracotta/ochre accents for little hits of warmth and reward.
 * Font: Lexend, designed to improve reading fluency (great for ADHD).
 * Supports a light/dark toggle via CSS variables (no flash on load).
 * All colours aim for WCAG 2.2 AA contrast.
 *
 * Change a value here and it updates everywhere. Never type a colour straight
 * into a component — always pull it from this theme.
 */

// --- Register a custom "tertiary" palette colour so components accept it ---
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

const theme = createTheme({
  // Enable CSS variables + a data-attribute selector so the toggle can switch
  // schemes instantly without a flash of the wrong theme.
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
  },

  colorSchemes: {
    // ---------------- LIGHT MODE ----------------
    light: {
      palette: {
        primary: {
          // Deep teal — grounded and calm.
          main: "#1F5B56",
          light: "#3C7E78",
          dark: "#143D39",
          contrastText: "#FFFFFF",
        },
        secondary: {
          // Muted slate blue-gray.
          main: "#5B6B7A",
          light: "#7E8D9A",
          dark: "#3E4B57",
          contrastText: "#FFFFFF",
        },
        tertiary: {
          // Warm terracotta / mustard accent — the cozy "dopamine" pop.
          main: "#C2703F",
          light: "#D89A6B",
          dark: "#9A5329",
          contrastText: "#FFFFFF",
        },
        success: { main: "#2F855A" },
        warning: { main: "#B7791F" },
        error: { main: "#C0453B" },
        background: {
          // Soft cream, warm and easy on the eyes.
          default: "#FBF7F0",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#2A2420", // warm near-black
          secondary: "#5F564E",
        },
        divider: "#E8E0D4",
      },
    },

    // ---------------- DARK MODE ----------------
    dark: {
      palette: {
        primary: {
          // Muted sage / soft blue — soothing against charcoal.
          main: "#8FB8A8",
          light: "#B0D0C3",
          dark: "#6B9385",
          contrastText: "#13201C",
        },
        secondary: {
          // Cool gray / silver.
          main: "#ABB4BA",
          light: "#C7CDD1",
          dark: "#808A90",
          contrastText: "#14191C",
        },
        tertiary: {
          // Soft ochre / muted gold — warm accent in the dark.
          main: "#D6A94E",
          light: "#E4C27E",
          dark: "#A87F2F",
          contrastText: "#20180A",
        },
        success: { main: "#68B98A" },
        warning: { main: "#D6A94E" },
        error: { main: "#E07A70" },
        background: {
          // Deep charcoal slate — cozy, not pure black.
          default: "#1C2023",
          paper: "#262B2F",
        },
        text: {
          primary: "#ECEAE4", // warm off-white
          secondary: "#AEB4B2",
        },
        divider: "#333A3E",
      },
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: ['"Lexend"', "system-ui", "Arial", "sans-serif"].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { fontSize: "1.05rem", lineHeight: 1.6 },
  },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999, // pill-shaped, friendly
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          minHeight: 48, // large, easy tap target
          fontSize: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }),
      },
    },
    // Visible keyboard focus outlines everywhere (WCAG 2.2).
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        "*:focus-visible": {
          outline: `3px solid ${theme.palette.primary.light}`,
          outlineOffset: "2px",
        },
      }),
    },
  },
});

export default theme;
