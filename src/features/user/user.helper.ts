import { User } from "@firebase/auth";
import { ProviderIDs } from "@/features/user/user.type";

export const getIsAccountLinked = (providerId: ProviderIDs, user: User) => {
  return Boolean(user.providerData.find(p => p.providerId === providerId));
};
