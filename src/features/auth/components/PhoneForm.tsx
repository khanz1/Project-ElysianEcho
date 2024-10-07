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
import React, { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier } from "@firebase/auth";
import { firebaseAuth } from "@/lib/firebase/firebase";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler.helpers";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/router";
import { signInWithPhone, verifyPhoneOtp } from "@/features/auth/auth.action";
import {
  FormType,
  setIsRecaptchaResolved,
  setPhoneFormType,
  setRecaptchaVerifier,
  StorageKeys,
  useAuthStore,
} from "@/features/auth/auth.store";

const PhoneLoginSchema = z.object({
  phone: z.string().min(1, {
    message: "Phone number is required",
  }),
});

type TPhoneLoginSchema = z.infer<typeof PhoneLoginSchema>;
const captchaContainerId = "recaptcha-container";

export const PhoneForm = () => {
  const router = useRouter();
  const state = useAuthStore(state => state.phone);
  const inputOtpRef = useRef<HTMLInputElement>(null);
  const form = useForm<TPhoneLoginSchema>({
    resolver: zodResolver(PhoneLoginSchema),
    defaultValues: {
      phone: "+1 650-555-3434",
    },
  });

  const [otp, setOtp] = useState("");

  const handlePhoneLogin = async (data: TPhoneLoginSchema) => {
    if (!state.recaptchaVerifier) {
      return toast.error("Recaptcha is not ready, please try again");
    }

    await signInWithPhone({
      phone: data.phone,
      recaptchaVerifier: state.recaptchaVerifier,
    });
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      return toast.error("Please enter the OTP code");
    }

    try {
      await verifyPhoneOtp(otp);
      toast.success("Successfully signed in");
      // TODO: should create displayName and photoURL
      await router.replace("/");
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (state.formType === "code") {
      inputOtpRef.current?.focus();
    }
  }, [state.formType]);

  useEffect(() => {
    if (otp.length === 6) {
      void handleOtpVerification();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    const formType = localStorage.getItem(StorageKeys.loginFormType);
    if (formType) {
      setPhoneFormType((formType ?? "phone") as FormType);
    }

    const recaptchaContainer = document.getElementById(captchaContainerId);

    // it means the container already renders the captcha
    if (recaptchaContainer?.children?.length) {
      return;
    }

    try {
      const captcha = new RecaptchaVerifier(firebaseAuth, captchaContainerId, {
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
      });

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
  }, []);

  return (
    <div>
      {state.formType === "code" && (
        <div className="flex justify-center py-10">
          <div className="space-y-4">
            <h3 className="text-sm w-3/4 text-center m-auto">
              Enter the 6-digit code sent to your mobile phone to verify your
              identity.
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
      {state.formType === "phone" && (
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
              disabled={!state.isRecaptchaResolved || state.isLoading}
            >
              {state.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
