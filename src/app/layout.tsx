import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ProjectDescription, ProjectName} from "@/constants/project.constant";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: ProjectName,
  description: ProjectDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
