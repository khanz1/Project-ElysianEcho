import { Separator } from "@/components/ui/separator";
import { IconLink, IconLinkOff, IconMail } from "@tabler/icons-react";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  unlink,
  User,
} from "@firebase/auth";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler.helpers";
import { googleProvider } from "@/lib/firebase/oauth/google";
import { facebookAuthProvider } from "@/lib/firebase/oauth/facebook";
import { githubProvider } from "@/lib/firebase/oauth/github";
import { Loading } from "@/components/Loading";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { PhoneLinkedForm } from "@/components/settings/PhoneLinkedForm";
import { formatPhoneNumber } from "@/utils/phone.formatter";
import {
  CredentialSchema,
  CredentialState,
} from "@/features/auth/auth.validation";
import { useUserStore } from "@/features/user/user.store";
import { setLinkedAccountsLoading } from "@/features/user/user.action";
import { getIsAccountLinked } from "@/features/user/user.helper";
import { ProviderIDs } from "@/features/user/user.type";

interface LinkedAccount<T extends string = string> {
  providerId: T;
  providerName: string;
  isLoading: boolean;
  icon: React.ReactElement;
}

interface LinkedAccountProps {
  provider: LinkedAccount;
  user: User;
  onLinkProvider: (providerId: string) => void;
}

export const LinkedAccount = ({
  provider,
  user,
  onLinkProvider,
}: LinkedAccountProps) => {
  const isLinked = getIsAccountLinked(provider.providerId, user);
  const providerData = user.providerData.find(p => {
    return p.providerId === provider.providerId;
  });

  return (
    <div key={provider.providerId} className="mt-4">
      <div
        onClick={() => onLinkProvider(provider.providerId)}
        className={cn(
          "flex items-center justify-between hover:bg-neutral-900 hover:cursor-pointer p-2 hover:rounded-md",
          provider.isLoading ? "blur-sm bg-white/30 animate-pulse" : "",
        )}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-neutral-800 text-primary">
            {provider.icon}
          </div>
          <div className="ml-3">
            <h4 className="text-md font-medium capitalize">
              {provider.providerName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isLinked ? (
                <span className="text-primary">
                  {providerData?.phoneNumber
                    ? formatPhoneNumber(providerData?.phoneNumber).international
                    : (providerData?.email ?? "unknown")}
                </span>
              ) : (
                `Link your account using ${provider.providerName}`
              )}
            </p>
          </div>
        </div>
        <div>
          {isLinked ? (
            <button className="ml-auto text-primary">
              <IconLink />
            </button>
          ) : (
            <button className="ml-auto text-neutral-500">
              <IconLinkOff />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmailLinkedAccount = () => {
  const auth = useFirebaseAuth();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const form = useForm<CredentialState>({
    resolver: zodResolver(CredentialSchema),
    defaultValues: {
      email: "anggaez@gmail.com",
      password: "xavier",
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleCredentialLink = async (data: CredentialState) => {
    if (!auth.user) {
      return toast.error("You need to login first");
    }

    setIsLoading(true);

    const emailProvider = EmailAuthProvider.credential(
      data.email,
      data.password,
    );

    try {
      await linkWithCredential(auth.user, emailProvider);

      setIsDialogOpen(false);
      // router.reload();
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialUnlink = async () => {
    if (!auth.user) {
      return toast.error("You need to login first");
    }

    setIsLoading(true);

    try {
      await unlink(auth.user, EmailAuthProvider.PROVIDER_ID);
      setIsAlertOpen(false);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnClick = async () => {
    if (!auth.user) {
      return toast.error("You need to login first");
    }
    const isLinked = getIsAccountLinked(
      EmailAuthProvider.PROVIDER_ID,
      auth.user,
    );
    if (isLinked) {
      setIsAlertOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  if (auth.status !== AuthStateType.LOADED) {
    return <Loading />;
  }

  return (
    <>
      <LinkedAccount
        provider={{
          providerName: "email",
          isLoading,
          providerId: EmailAuthProvider.PROVIDER_ID,
          icon: <IconMail />,
        }}
        user={auth.user}
        onLinkProvider={handleOnClick}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay it</AlertDialogCancel>
            <AlertDialogAction onClick={handleCredentialUnlink}>
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Fill the email and password to link with credential login
            </DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCredentialLink)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Connect
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function SettingsPage() {
  const auth = useFirebaseAuth();

  const linkedAccounts = useUserStore(state => state.linkedAccounts);

  const handleOnLinkProvider = async (providerId: ProviderIDs) => {
    if (!auth.user) {
      toast.error("You need to login first");
      return;
    }

    const isLinked = getIsAccountLinked(providerId, auth.user);

    try {
      setLinkedAccountsLoading(providerId, true);

      if (isLinked) {
        await unlink(auth.user, providerId);
        toast.success("Account unlinked successfully");

        await auth.user.reload();
        return;
      }

      if (providerId === GoogleAuthProvider.PROVIDER_ID) {
        await linkWithPopup(auth.user, googleProvider);
      }
      if (providerId === FacebookAuthProvider.PROVIDER_ID) {
        await linkWithPopup(auth.user, facebookAuthProvider);
      }
      if (providerId === GithubAuthProvider.PROVIDER_ID) {
        await linkWithPopup(auth.user, githubProvider);
      }

      toast.success("Account linked successfully");
      await auth.user.reload();
    } catch (err) {
      handleError(err);
    } finally {
      setLinkedAccountsLoading(providerId, false);
    }
  };

  if (auth.status === AuthStateType.NOT_LOADED) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Linked Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Link your account to other providers to login with them.
        </p>
      </div>
      <Separator />
      <div>
        {auth.status !== AuthStateType.LOADED ? (
          <Loading />
        ) : (
          <>
            <EmailLinkedAccount />
            <PhoneLinkedForm />
            {linkedAccounts.map(provider => {
              return (
                <LinkedAccount
                  key={provider.providerId}
                  provider={provider}
                  user={auth.user}
                  onLinkProvider={handleOnLinkProvider}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
