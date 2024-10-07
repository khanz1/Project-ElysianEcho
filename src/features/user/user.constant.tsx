import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "@firebase/auth";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import React from "react";
import { LinkedAccount } from "@/features/user/user.type";

export const linkedAccounts: LinkedAccount[] = [
  {
    providerId: GithubAuthProvider.PROVIDER_ID,
    providerName: "github",
    isLoading: false,
    icon: <IconBrandGithub />,
  },
  {
    providerName: "google",
    isLoading: false,
    providerId: GoogleAuthProvider.PROVIDER_ID,
    icon: <IconBrandGoogle />,
  },
  {
    providerName: "facebook",
    isLoading: false,
    providerId: FacebookAuthProvider.PROVIDER_ID,
    icon: <IconBrandFacebook />,
  },
];
