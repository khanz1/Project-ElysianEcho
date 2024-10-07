import { debugErrorMap } from "firebase/auth";
import { FirebaseError } from "@firebase/app";

type DebugErrorMap = () => Record<string, string>;

export const getFirebaseErrorMessage = (error: FirebaseError) => {
  const defaultMessage =
    "Something happened while we were processing your request, please try again.";

  // we have to cast this as DebugErrorMap because the firebaseErrorMap is not exported
  const firebaseErrorMap = debugErrorMap as DebugErrorMap;
  const firebaseErrorList = firebaseErrorMap();
  const errName = error.code.replace("auth/", "");
  const message = firebaseErrorList[errName];

  return message ?? defaultMessage;
};
