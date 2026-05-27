import { ConvexReactClient } from "convex/react"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { Stack } from "expo-router"
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

const secureStorage = {
  getItem: getItemAsync,
  setItem: setItemAsync,
  removeItem: deleteItemAsync,
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </ConvexAuthProvider>
  )
}
