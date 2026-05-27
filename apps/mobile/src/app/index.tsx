import { useState } from "react"
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native"
import { api } from "@workspace/backend/api"
import { useQuery } from "convex/react"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"

function SignIn() {
  const { signIn } = useAuthActions()
  const [step, setStep] = useState<"email" | { email: string }>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  if (step === "email") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Pressable
          style={styles.button}
          onPress={() => {
            const formData = new FormData()
            formData.append("email", email)
            void signIn("resend-otp", formData).then(() => setStep({ email }))
          }}
        >
          <Text style={styles.buttonText}>Send code</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter code</Text>
      <Text style={styles.subtitle}>Sent to {step.email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          const formData = new FormData()
          formData.append("code", code)
          formData.append("email", step.email)
          void signIn("resend-otp", formData)
        }}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </Pressable>
      <Pressable onPress={() => setStep("email")}>
        <Text style={styles.link}>Back</Text>
      </Pressable>
    </View>
  )
}

export default function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const tasks = useQuery(api.tasks.get, isAuthenticated ? {} : "skip")

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!isAuthenticated) {
    return <SignIn />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id}>{text}</Text>
      ))}
      <Pressable style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#666",
    marginTop: 16,
    fontSize: 14,
  },
})
