import { useEffect, useState } from "react";
import { firebaseAuth } from "@/lib/firebase/firebase";
import { User } from "@firebase/auth";

export enum AuthStateType {
  NOT_LOADED = "not-loaded",
  LOADING = "loading",
  LOADED = "loaded",
  FAILED = "failed",
}

interface LoadingState {
  status: AuthStateType.LOADING;
  user: null;
}

interface NotLoadedState {
  status: AuthStateType.NOT_LOADED;
  user: null;
}

interface LoadedState {
  status: AuthStateType.LOADED;
  user: User;
}

interface FailedState {
  status: AuthStateType.FAILED;
  user: null;
}

export type UseFirebaseAuth =
  | LoadingState
  | NotLoadedState
  | LoadedState
  | FailedState;

export const useFirebaseAuth = (): UseFirebaseAuth => {
  const [authState, setAuthState] = useState<AuthStateType>(
    AuthStateType.LOADING,
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        setAuthState(AuthStateType.LOADED);
        setUser(user);
      } else {
        setAuthState(AuthStateType.NOT_LOADED);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState === AuthStateType.LOADING) {
    return { status: AuthStateType.LOADING, user: null };
  }

  if (authState === AuthStateType.NOT_LOADED) {
    return { status: AuthStateType.NOT_LOADED, user: null };
  }

  if (authState === AuthStateType.LOADED && user) {
    return { status: AuthStateType.LOADED, user };
  }

  // Fallback in case of an unexpected state, you could also throw an error here
  return { status: AuthStateType.FAILED, user: null };
};
