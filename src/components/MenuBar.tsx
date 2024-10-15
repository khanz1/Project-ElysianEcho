import {
  IconLogout2,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconSettings,
  IconSettingsFilled,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import React, { AllHTMLAttributes, useState } from "react";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { signOut } from "@firebase/auth";
import { firebaseAuth } from "@/lib/firebase/firebase";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { SidebarType } from "@/features/chat/actions/message.action";

interface InteractiveIconProps extends AllHTMLAttributes<HTMLDivElement> {
  Icon: React.ReactElement;
  IconFilled: React.ReactElement;
}

const InteractiveIcon = ({
  Icon,
  IconFilled,
  ...props
}: InteractiveIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer hover:bg-muted-darker text-accent-foreground rounded p-2"
    >
      {isHovered ? IconFilled : Icon}
    </div>
  );
};

export default function MenuBar() {
  const router = useRouter();
  const auth = useFirebaseAuth();

  const handleLogout = async () => {
    if (auth.status !== AuthStateType.LOADED) {
      return;
    }

    await signOut(firebaseAuth);
    await router.replace("/sign-in");
  };

  const openSidebarTab = (tab: SidebarType) => {
    const url = new URL(window.location.href);
    url.pathname = "/";
    url.searchParams.set("sidebarTab", tab);

    return router.push(url.toString());
  };

  return (
    <section className="bg-muted h-full w-full">
      <nav className="h-full flex justify-center py-5 px-2">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            <button onClick={() => openSidebarTab("chat")}>
              <InteractiveIcon
                Icon={<IconMessageCircle size={20} />}
                IconFilled={
                  <IconMessageCircleFilled
                    className="animate-pulse"
                    size={20}
                  />
                }
              />
            </button>
            <button onClick={() => openSidebarTab("contact")}>
              <InteractiveIcon
                Icon={<IconUser size={20} />}
                IconFilled={
                  <IconUserFilled className="animate-pulse" size={20} />
                }
              />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/settings/profile">
              <InteractiveIcon
                Icon={<IconSettings size={20} />}
                IconFilled={
                  <IconSettingsFilled className="animate-spin" size={20} />
                }
              />
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <InteractiveIcon
                  Icon={<IconLogout2 size={20} />}
                  IconFilled={
                    <IconLogout2
                      className="animate-pulse text-rose-500"
                      size={20}
                    />
                  }
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Log Out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logged out of your account. You can always log
                    back in to continue accessing your data and features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Stay Logged In</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </nav>
    </section>
  );
}
