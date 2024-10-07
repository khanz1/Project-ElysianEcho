import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  CredentialSchema,
  CredentialState,
} from "@/features/auth/auth.validation";
import { signInUser, signUpUser } from "@/features/auth/auth.action";
import { AuthMode, useAuthStore } from "@/features/auth/auth.store";

export interface CredentialFormProps {
  authMode: AuthMode;
}

export const CredentialForm = (props: CredentialFormProps) => {
  const state = useAuthStore(state => state.credential);

  const router = useRouter();
  const form = useForm<CredentialState>({
    resolver: zodResolver(CredentialSchema),
    defaultValues: {
      email: "anggaez@gmail.com",
      password: "xavier",
    },
  });

  const handleCredentialLogin = async (data: CredentialState) => {
    if (props.authMode === "register") {
      // TODO: should create displayName and photoURL
      await signUpUser(data);
    } else {
      await signInUser(data);
    }

    await router.replace("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCredentialLogin)}
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
        <Button type="submit" className="w-full" disabled={state.isLoading}>
          {state.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {props.authMode === "register" ? "Sign Up" : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};
