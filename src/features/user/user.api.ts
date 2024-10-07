import { getDocs, query, where } from "@firebase/firestore";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { userCollectionRef } from "@/features/user/defs/docs-ref";
import { FirebaseError } from "@firebase/app";
import { assignTypes } from "@/lib/firebase/firebase";

export const getUserByUIDQuery = (uid: string) => {
  return query(userCollectionRef, where("uid", "==", uid)).withConverter(
    assignTypes<UserDoc>(),
  );
};

export const getUserDocRefByUID = async (uid: string) => {
  const query = getUserByUIDQuery(uid);
  const snapshot = await getDocs(query);

  if (snapshot.empty) {
    throw new FirebaseError("not-found", "User not found");
  }

  return snapshot.docs[0].ref;
};
