import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { RecaptchaVerifier } from "@firebase/auth";

interface LoadingState {
  isLoading: boolean;
}

export type FormType = "phone" | "code";
export type AuthMode = "login" | "register";
export type SignInMode = "email" | "phone";
export enum StorageKeys {
  phoneVerificationId = "phoneVerificationId",
  loginFormType = "loginFormType",
}

interface PhoneState extends LoadingState {
  formType: FormType;
  isRecaptchaResolved: boolean;
  recaptchaVerifier: RecaptchaVerifier | null;
}

type AuthState = {
  credential: LoadingState;
  google: LoadingState;
  phone: PhoneState;
  signInPage: {
    signInMode: SignInMode;
    authMode: AuthMode;
  };
  public: {
    isLoading: boolean;
    users: UserDoc[];
  };
};

export const useAuthStore = create<AuthState>()(
  immer(set => ({
    // state
    signInPage: {
      signInMode: "email",
      authMode: "login",
    },
    google: {
      isLoading: false,
    },
    credential: {
      isLoading: false,
    },
    phone: {
      isLoading: false,
      formType: "phone",
      isRecaptchaResolved: false,
      recaptchaVerifier: null,
    },
    public: {
      isLoading: false,
      users: [],
    },
  })),
);

// actions
export const setPhoneFormType = (formType: FormType) => {
  useAuthStore.setState(state => {
    state.phone.formType = formType;
  });
};

export const setSignInMode = (signInMode: SignInMode) => {
  useAuthStore.setState(state => {
    state.signInPage.signInMode = signInMode;
  });
};

export const setAuthMode = (authMode: AuthMode) => {
  useAuthStore.setState(state => {
    state.signInPage.authMode = authMode;
  });
};

export const setIsRecaptchaResolved = (isRecaptchaResolved: boolean) => {
  useAuthStore.setState(state => {
    state.phone.isRecaptchaResolved = isRecaptchaResolved;
  });
};

export const setRecaptchaVerifier = (recaptchaVerifier: RecaptchaVerifier) => {
  useAuthStore.setState(state => {
    state.phone.recaptchaVerifier = recaptchaVerifier;
  });
};
