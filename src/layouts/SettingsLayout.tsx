import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/settings/SidebarNav";

const sidebarNavItems = [
  {
    title: "Profile",
    tabName: "profile",
    href: "/settings/profile",
  },
  {
    // change theme
    title: "Appearance",
    tabName: "appearance",
    href: "/settings/appearance",
  },
  {
    title: "Linked Accounts",
    tabName: "linked-accounts",
    href: "/settings/linked-accounts",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-4 p-5 lg:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight text-accent-foreground">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
