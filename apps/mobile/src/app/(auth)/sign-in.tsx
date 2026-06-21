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

import { AppLogo } from "~/components/app-logo";

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
          <View className="mx-auto w-full max-w-sm">
            <View className="mb-8 items-center">
              <AppLogo size={44} />
            </View>
            {step === "email" ? (
              <EmailStep onSuccess={(email) => setStep({ email })} />
            ) : (
              <CodeStep email={step.email} onBack={() => setStep("email")} />
            )}
          </View>
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

  const disabled = submitting || email.length === 0;

  return (
    <View className="gap-1.5">
      <Text className="text-center font-heading text-xl text-foreground">
        What's your email address?
      </Text>
      <Text className="text-center font-sans text-sm text-muted-foreground">
        We'll send you a verification code to sign in.
      </Text>
      <TextInput
        className="mt-5 h-11 border border-input bg-background px-3 font-sans text-base text-foreground focus:border-foreground"
        placeholder="name@example.com"
        placeholderTextColorClassName="accent-muted-foreground"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        inputMode="email"
        editable={!submitting}
        onSubmitEditing={onSubmit}
      />
      {error ? <Text className="font-sans text-xs text-destructive">{error}</Text> : null}
      <Pressable
        className="mt-2 h-11 flex-row items-center justify-center gap-2 bg-primary px-4 active:bg-primary/80"
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
        onPress={onSubmit}
      >
        {submitting ? (
          <ActivityIndicator size="small" colorClassName="accent-primary-foreground" />
        ) : null}
        <Text className="font-sans text-sm font-medium text-primary-foreground">
          Continue with email
        </Text>
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

  const disabled = submitting || code.length !== 8;

  return (
    <View className="gap-1.5">
      <Text className="text-center font-heading text-xl text-foreground">
        Enter your verification code
      </Text>
      <Text className="text-center font-sans text-sm text-muted-foreground">
        We sent an 8-digit code to {email}.
      </Text>
      <TextInput
        // Center the code via the native `textAlign` prop rather than a `text-center`
        // className, so it is set directly on the TextInput instead of going through the
        // resolved style object.
        textAlign="center"
        className="mt-5 h-12 border border-input bg-background px-3 font-sans text-2xl tracking-[8px] text-foreground focus:border-foreground"
        value={code}
        onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 8))}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={8}
        editable={!submitting}
        onSubmitEditing={onSubmit}
      />
      {error ? <Text className="font-sans text-xs text-destructive">{error}</Text> : null}
      <Pressable
        className="mt-2 h-11 flex-row items-center justify-center gap-2 bg-primary px-4 active:bg-primary/80"
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
        onPress={onSubmit}
      >
        {submitting ? (
          <ActivityIndicator size="small" colorClassName="accent-primary-foreground" />
        ) : null}
        <Text className="font-sans text-sm font-medium text-primary-foreground">Verify</Text>
      </Pressable>
      <Pressable className="mt-2 items-center" disabled={submitting} onPress={onBack} hitSlop={8}>
        <Text className="font-sans text-sm font-medium text-muted-foreground">
          Use a different email
        </Text>
      </Pressable>
    </View>
  );
}
