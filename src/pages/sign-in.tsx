import { AuthProvider } from "@firebase/auth";
import { googleProvider } from "@/lib/firebase/oauth/google";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { githubProvider } from "@/lib/firebase/oauth/github";
import { facebookAuthProvider } from "@/lib/firebase/oauth/facebook";
import { CredentialForm } from "@/features/auth/components/CredentialForm";
import { PhoneForm } from "@/features/auth/components/PhoneForm";
import { signInOAuth } from "@/features/auth/auth.action";
import { useRouter } from "next/router";
import {
  setAuthMode,
  setSignInMode,
  SignInMode,
  StorageKeys,
  useAuthStore,
} from "@/features/auth/auth.store";

export default function SignIn() {
  const router = useRouter();
  const state = useAuthStore(state => state.signInPage);

  useEffect(() => {
    const itemKey = StorageKeys.loginFormType;
    const signInMode = localStorage.getItem(itemKey) as SignInMode;

    if (signInMode) {
      setSignInMode(signInMode);
    }
  }, []);

  const handleOAuthLogin = async (provider: AuthProvider) => {
    await signInOAuth(provider);
    await router.replace("/");
  };

  return (
    <section>
      <div className="container mx-auto px-2 sm:px-0 pt-32">
        <Card className="w-full sm:w-8/12 md:w-7/12 lg:w-5/12 mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {state.authMode === "login" ? "Sign In" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {state.authMode === "login"
                ? "Welcome back! Sign in to your account"
                : "Enter your email below to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.authMode === "login" ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin(githubProvider)}
                  >
                    <IconBrandGithub className="mr-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin(googleProvider)}
                  >
                    <IconBrandGoogle className="mr-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin(facebookAuthProvider)}
                  >
                    <IconBrandFacebook className="mr-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Tabs
                  value={state.signInMode}
                  onValueChange={value => setSignInMode(value as SignInMode)}
                >
                  <TabsList>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email">
                    <CredentialForm authMode={state.authMode} />
                  </TabsContent>
                  <TabsContent value="phone">
                    <PhoneForm />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <CredentialForm authMode={state.authMode} />
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              {state.authMode === "register" ? (
                <>
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => setAuthMode("login")}
                  >
                    Sign in
                  </Button>
                </>
              ) : (
                <>
                  Don&#39;t have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => setAuthMode("register")}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
