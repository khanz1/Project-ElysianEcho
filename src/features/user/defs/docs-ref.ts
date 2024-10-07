import { collection } from "@firebase/firestore";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { UserDoc } from "@/lib/firebase/firebase.type";

export const userCollectionRefBase = collection(db, "users");
export const userCollectionRef =
  userCollectionRefBase.withConverter(assignTypes<UserDoc>());
