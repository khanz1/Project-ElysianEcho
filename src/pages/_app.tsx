import "../styles/globals.css";
import "@/styles/recaptcha-style.css";
import type { AppProps } from "next/app";
import RootLayout from "@/layouts/RootLayout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function App(props: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RootLayout {...props} />
      <Toaster />
    </ThemeProvider>
  );
}
