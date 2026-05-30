import * as SecureStore from "expo-secure-store";

// Token storage adapter for ConvexAuthProvider, backed by the device keychain.
// `expo-secure-store` keys may only contain alphanumeric characters, ".", "-",
// and "_", so we pair this with a `storageNamespace` of "convexAuth" on the
// provider (the default namespace is the deployment URL, which contains
// invalid characters like "://").
export const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
