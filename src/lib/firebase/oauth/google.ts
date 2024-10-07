import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.addScope("openid");
provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

export const googleProvider = provider;
