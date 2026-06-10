import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [step, setStep] = useState<"email" | { email: string }>("email");

  // SafeAreaView (from react-native-safe-area-context) does not support `className` and,
  // unlike the legacy RN SafeAreaView, has no default `flex: 1`. Keep background + fill on
  // the className-styled View and use SafeAreaView only for insets via an inline `flex: 1`.
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          className="flex-1 justify-center px-6"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {step === "email" ? (
            <EmailStep onSuccess={(email) => setStep({ email })} />
          ) : (
            <CodeStep email={step.email} onBack={() => setStep("email")} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function EmailStep({ onSuccess }: { onSuccess: (email: string) => void }) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn("resend-otp", { email });
      onSuccess(email);
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="gap-2">
      <Text className="text-2xl font-bold text-foreground">Sign in</Text>
      <Text className="text-sm text-muted-foreground">
        Enter your email to receive a verification code.
      </Text>
      <TextInput
        className="mt-4 rounded-lg border border-border px-4 py-3 text-base text-foreground"
        placeholder="name@example.com"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        inputMode="email"
        editable={!submitting}
        onSubmitEditing={onSubmit}
      />
      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
      <Pressable
        className="mt-2 flex-row items-center justify-center rounded-lg bg-primary px-4 py-3"
        disabled={submitting || email.length === 0}
        style={{ opacity: submitting || email.length === 0 ? 0.5 : 1 }}
        onPress={onSubmit}
      >
        {submitting ? <ActivityIndicator size="small" color="#fff" className="mr-2" /> : null}
        <Text className="text-base font-medium text-primary-foreground">Send code</Text>
      </Pressable>
    </View>
  );
}

function CodeStep({ email, onBack }: { email: string; onBack: () => void }) {
  const { signIn } = useAuthActions();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // On success the auth state flips and the root layout's protected guards
      // swap to the authenticated stack automatically.
      await signIn("resend-otp", { email, code });
    } catch {
      setError("Invalid code. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <View className="gap-2">
      <Text className="text-2xl font-bold text-foreground">Verify code</Text>
      <Text className="text-sm text-muted-foreground">Enter the 8-digit code sent to {email}.</Text>
      <TextInput
        // Center the code via the native `textAlign` prop rather than a `text-center`
        // className, so it is set directly on the TextInput instead of going through the
        // resolved style object.
        textAlign="center"
        className="mt-4 rounded-lg border border-border px-4 py-3 text-2xl tracking-[8px] text-foreground"
        placeholder="00000000"
        placeholderTextColor="#9ca3af"
        value={code}
        onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 8))}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={8}
        editable={!submitting}
        onSubmitEditing={onSubmit}
      />
      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
      <View className="mt-2 flex-row gap-2">
        <Pressable
          className="flex-1 items-center justify-center rounded-lg border border-border px-4 py-3"
          disabled={submitting}
          onPress={onBack}
        >
          <Text className="text-base font-medium text-foreground">Back</Text>
        </Pressable>
        <Pressable
          className="flex-1 flex-row items-center justify-center rounded-lg bg-primary px-4 py-3"
          disabled={submitting || code.length !== 8}
          style={{ opacity: submitting || code.length !== 8 ? 0.5 : 1 }}
          onPress={onSubmit}
        >
          {submitting ? <ActivityIndicator size="small" color="#fff" className="mr-2" /> : null}
          <Text className="text-base font-medium text-primary-foreground">Verify</Text>
        </Pressable>
      </View>
    </View>
  );
}
