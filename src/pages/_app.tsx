import "../styles/globals.css";
import "@/styles/recaptcha-style.css";
import type { AppProps } from "next/app";
import RootLayout from "@/layouts/RootLayout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

export default function App(props: AppProps) {
  return (
    <div>
      <Head>
        <title>Elysian Echo</title>
        <link
          rel="icon"
          href="https://entertainme.khanz1.dev/images/FantasyCatLogo.png"
        />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <RootLayout {...props} />
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
