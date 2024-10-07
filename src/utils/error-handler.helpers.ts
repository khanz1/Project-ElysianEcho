import { FirebaseError } from "@firebase/app";
import { getFirebaseErrorMessage } from "@/utils/error.helpers";
import { toast } from "sonner";

class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class FirebaseApiError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export const handleError = (error: unknown) => {
  console.log(error, "<<< err");
  if (error instanceof FirebaseError) {
    return toast.error(getFirebaseErrorMessage(error));
  }

  if (!!error && typeof error === "object" && "name" in error) {
    if (error.name === FirebaseError.name) {
      const firebaseError = new FirebaseError(
        (error as any).code,
        (error as any).message,
      );
      return toast.error(getFirebaseErrorMessage(firebaseError));
    }
  }

  if (error instanceof Error) {
    return toast.error(error.message);
  }

  return toast.error("An error occurred. Please try again later.");
};
