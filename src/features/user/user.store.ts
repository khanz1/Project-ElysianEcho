import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AuthState } from "@/features/user/user.type";
import { linkedAccounts } from "@/features/user/user.constant";

export const useUserStore = create<AuthState>()(
  immer(set => ({
    contacts: {
      isLoading: false,
      list: [],
    },
    linkedAccounts,
  })),
);
