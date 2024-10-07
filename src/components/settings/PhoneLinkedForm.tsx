import { z } from "zod";
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
import React, { useEffect, useState } from "react";
import {
  ConfirmationResult,
  linkWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  unlink,
} from "@firebase/auth";
import { firebaseAuth } from "@/lib/firebase/firebase";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler.helpers";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { IconPhone } from "@tabler/icons-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LinkedAccount } from "@/pages/settings/linked-accounts";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { Loading } from "@/components/Loading";
import { wait } from "@/utils/time.helpers";
import { getIsAccountLinked } from "@/features/user/user.helper";

const PhoneLoginSchema = z.object({
  phone: z.string().min(1, {
    message: "Phone number is required",
  }),
});

type TPhoneLoginSchema = z.infer<typeof PhoneLoginSchema>;
type FormType = "phone" | "code";
const captchaContainerId = "recaptcha-container";

export const PhoneLinkedForm = () => {
  const auth = useFirebaseAuth();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const inputOtpRef = React.useRef<HTMLInputElement>(null);
  const [formType, setFormType] = useState<FormType>("phone");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpConfirmation, setOtpConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [isRecaptchaResolved, setIsRecaptchaResolved] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const form = useForm<TPhoneLoginSchema>({
    resolver: zodResolver(PhoneLoginSchema),
    defaultValues: {
      phone: "+1 650-555-3434",
    },
  });

  const handlePhoneLogin = async (data: TPhoneLoginSchema) => {
    if (!recaptchaVerifier) {
      return toast.error("Recaptcha is not ready, please try again");
    }

    if (!auth.user) {
      return toast.error("You need to login first");
    }

    setIsLoading(true);

    try {
      const confirmationResult = await linkWithPhoneNumber(
        auth.user,
        data.phone,
        recaptchaVerifier,
      );
      setOtpConfirmation(confirmationResult);
      setFormType("code");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpConfirmation) {
      return toast.error("Confirmation result is not ready, please try again");
    }

    try {
      await otpConfirmation.confirm(otp);
      await auth.user?.reload();
      setIsDialogOpen(false);
      // await router.replace("/");
      toast.success("Phone number linked successfully");
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (formType === "code") {
      inputOtpRef.current?.focus();
    }
  }, [formType]);

  useEffect(() => {
    if (otp.length === 6) {
      void handleOtpVerification();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    (async () => {
      if (!isDialogOpen) {
        return;
      }

      const recaptchaContainer = document.getElementById(captchaContainerId);

      // it means the container already renders the captcha
      if (recaptchaContainer?.children?.length) {
        return;
      }

      try {
        // wait to make the element ready
        await wait(500);
        const captcha = new RecaptchaVerifier(
          firebaseAuth,
          captchaContainerId,
          {
            size: "normal",
            theme: "dark",
            callback: () => {
              setIsRecaptchaResolved(true);
            },
            "error-callback": () => {
              console.log("error-callback");
              setIsRecaptchaResolved(false);
              toast.error("Recaptcha Error, please try again");
            },
            "expired-callback": () => {
              console.log("expired-callback");
              setIsRecaptchaResolved(false);
              toast.info("Recaptcha Expired, please verify it again");
            },
          },
        );

        captcha
          .render()
          .then(() => setRecaptchaVerifier(captcha))
          .catch(handleError);

        return () => {
          captcha.clear();
        };
      } catch (err) {
        handleError(err);
      }
    })();
  }, [isDialogOpen]);

  const handleOnClick = async () => {
    if (!auth.user) {
      return toast.error("You need to login first");
    }
    const isLinked = getIsAccountLinked(
      PhoneAuthProvider.PROVIDER_ID,
      auth.user,
    );
    if (isLinked) {
      setIsAlertOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleCredentialUnlink = async () => {
    if (!auth.user) {
      return toast.error("You need to login first");
    }
    try {
      await unlink(auth.user, PhoneAuthProvider.PROVIDER_ID);
      await auth.user.reload();
      setIsAlertOpen(false);
      toast.success("Phone number unlinked successfully");
    } catch (err) {
      handleError(err);
    }
  };

  if (auth.status !== AuthStateType.LOADED) {
    return <Loading />;
  }

  return (
    <div>
      <LinkedAccount
        provider={{
          providerName: "phone",
          isLoading,
          providerId: PhoneAuthProvider.PROVIDER_ID,
          icon: <IconPhone />,
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
            <DialogTitle>Fill the phone number login</DialogTitle>
          </DialogHeader>
          {formType === "code" && (
            <div className="flex justify-center py-10">
              <div className="space-y-4">
                <h3 className="text-sm w-3/4 text-center m-auto">
                  Enter the 6-digit code sent to your mobile phone to verify
                  your identity.
                </h3>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={value => setOtp(value)}
                    ref={inputOtpRef}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>
          )}
          {formType === "phone" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePhoneLogin)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input id="phone" type="phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  id={captchaContainerId}
                  className="w-full recaptcha-container"
                />
                <Button
                  id="sign-in-button"
                  type="submit"
                  className="w-full"
                  disabled={!isRecaptchaResolved || isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
