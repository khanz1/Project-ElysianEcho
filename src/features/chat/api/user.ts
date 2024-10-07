import { getDocs, query, where } from "@firebase/firestore";
import { userCollectionRef } from "@/features/chat/defs/docs-ref";
import { FirebaseError } from "@firebase/app";

export const getUserDocRefByUID = async (uid: string) => {
  const q = query(userCollectionRef, where("uid", "==", uid));
  const docs = await getDocs(q);

  if (docs.empty) {
    throw new FirebaseError("not-found", "User not found");
  }

  return docs.docs[0].ref;
};
