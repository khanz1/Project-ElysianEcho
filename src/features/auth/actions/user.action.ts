import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { assignTypes, db } from "@/lib/firebase/firebase";
import { UserDoc } from "@/lib/firebase/firebase.type";
import { serializeDocs } from "@/utils/serialize";

const userCollectionRef = collection(db, "users");
const usersRef = userCollectionRef.withConverter(assignTypes<UserDoc>());

export const getUserByUID = createAsyncThunk(
  "auth/getUserByUID",
  async (uid: string) => {
    const q = query(usersRef, where("uid", "==", uid));
    const docs = await getDocs(q.withConverter(assignTypes<UserDoc>()));

    if (docs.empty) {
      return null;
    }

    return serializeDocs(docs.docs[0].data()) as UserDoc;
  },
);

export const getUserListByUIDs = createAsyncThunk(
  "auth/getUserListByUIDs",
  async (uidList: string[]) => {
    const q = query(
      usersRef.withConverter(assignTypes<UserDoc>()),
      where("uid", "in", uidList),
    );
    const docs = await getDocs(q);

    if (docs.empty) {
      return [];
    }

    return serializeDocs(docs.docs.map(doc => doc.data())) as UserDoc[];
  },
);
