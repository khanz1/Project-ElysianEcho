import { collection, query, where } from "@firebase/firestore";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { UserDoc } from "@/lib/firebase/firebase.type";

export const userCollectionRefBase = collection(db, "users");
export const userCollectionRef =
  userCollectionRefBase.withConverter(assignTypes<UserDoc>());

export const getQueryGetUserByUID = (uid: string) => {
  return query(
    userCollectionRef,
    where("uid", "!=", uid),
    // where("accountVisibility", "==", "public"),
  );
};

export const getQueryUserByUID = (uid: string) => {
  return query(userCollectionRef, where("uid", "==", uid)).withConverter(
    assignTypes<UserDoc>(),
  );
};
