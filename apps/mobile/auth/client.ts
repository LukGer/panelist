import "react-native-webcrypto";

import { expoClient } from "@better-auth/expo/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL as string;
const authURL = `${baseURL}/api/auth`;

export const authClient = createAuthClient({
  baseURL: authURL,
  plugins: [
    expoClient({
      storage: SecureStore,
    }),
    adminClient(),
  ],
});
