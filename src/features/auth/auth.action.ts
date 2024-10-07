import {
  AuthProvider,
  createUserWithEmailAndPassword,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "@firebase/auth";
import { firebaseAuth } from "@/lib/firebase/firebase";
import { CredentialState } from "@/features/auth/auth.validation";
import { toast } from "sonner";
import { setPhoneFormType, StorageKeys } from "@/features/auth/auth.store";
import {
  createOrUpdateUserByUID,
  createUser,
  fetchUserByUID,
  updateUserByUID,
} from "@/features/user/user.action";

export const signInOAuth = async (provider: AuthProvider) => {
  const userCredential = await signInWithPopup(firebaseAuth, provider);

  try {
    const user = await fetchUserByUID(userCredential.user.uid);

    await updateUserByUID(user);
    toast.error("User already exists");
    return user;
  } catch (err) {
    return createUser(userCredential);
  }
};

export const signUpUser = async ({ email, password }: CredentialState) => {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  await createOrUpdateUserByUID(userCredential);
};

export const signInUser = async ({ email, password }: CredentialState) => {
  return await signInWithEmailAndPassword(firebaseAuth, email, password);
};

interface SignInWithPhone {
  phone: string;
  recaptchaVerifier: RecaptchaVerifier;
}

export const signInWithPhone = async (params: SignInWithPhone) => {
  const confirmationResult = await signInWithPhoneNumber(
    firebaseAuth,
    params.phone,
    params.recaptchaVerifier,
  );

  setPhoneFormType("code");
  localStorage.setItem(
    StorageKeys.phoneVerificationId,
    confirmationResult.verificationId,
  );
  localStorage.setItem(StorageKeys.loginFormType, "code");
};

export const verifyPhoneOtp = async (otp: string) => {
  const verificationId = localStorage.getItem(StorageKeys.phoneVerificationId);
  if (verificationId) {
    const phoneCredential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await signInWithCredential(
      firebaseAuth,
      phoneCredential,
    );

    await createOrUpdateUserByUID(userCredential);

    localStorage.removeItem(StorageKeys.loginFormType);
    localStorage.removeItem(StorageKeys.phoneVerificationId);
  }
};
