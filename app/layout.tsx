import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "@fontsource/lexend/300.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: "Momentum",
  description:
    "A calm, ADHD-friendly way to stay on top of your money and your time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // suppressHydrationWarning: InitColorSchemeScript sets the color-scheme
  // attribute on <html> before React hydrates, so we tell React not to warn
  // about that expected difference.
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Runs before paint to apply the saved light/dark choice with no flash. */}
        <InitColorSchemeScript attribute="data-mui-color-scheme" />
        {/* MUI's style registry for the Next.js App Router. */}
        <AppRouterCacheProvider>
          {/* Makes the theme available to every component. */}
          <ThemeProvider theme={theme}>
            {/* Calm, consistent base styles app-wide. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
