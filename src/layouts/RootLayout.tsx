import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import MenuBar from "@/components/MenuBar";
import React from "react";
import SettingsLayout from "@/layouts/SettingsLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={inter.className}>
      <main className="w-screen h-screen">
        <div className="h-full w-full flex">
          <div>
            <MenuBar />
          </div>
          <div className="relative w-full bg-neutral-950">
            <ScrollArea className="h-screen">{children}</ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function RootLayout({ Component, pageProps, router }: AppProps) {
  const auth = useFirebaseAuth();
  if (router.pathname === "/sign-in") {
    if (auth.status === AuthStateType.LOADED) {
      void router.replace("/");
      return;
    }
    return <Component {...pageProps} />;
  }

  // if user try to access home etc. but not authenticated
  // redirect to the sign-in page
  if (auth.status === AuthStateType.NOT_LOADED) {
    void router.replace("/sign-in");
    return;
  }

  if (router.pathname.split("/").includes("settings")) {
    return (
      <LayoutWrapper>
        <SettingsLayout>
          <Component {...pageProps} />
        </SettingsLayout>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <Component {...pageProps} />
    </LayoutWrapper>
  );
}
