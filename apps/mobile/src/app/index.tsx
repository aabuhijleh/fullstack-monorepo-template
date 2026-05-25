import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { api, clearTokens, loadTokens, saveTokens } from '@/lib/api';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens().then(async (hasTokens) => {
      if (hasTokens) {
        try {
          const res = await api.protected.me.$get();
          if (res.ok) {
            const data = await res.json();
            setUserEmail(data.email);
            setLoggedIn(true);
          } else {
            await clearTokens();
          }
        } catch {
          await clearTokens();
        }
      }
      setLoading(false);
    });
  }, []);

  const login = async () => {
    setError(null);
    try {
      const res = await api.auth.login.$post({
        json: { email, password },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error('error' in data ? data.error : `HTTP ${res.status}`);
      }
      const data = await res.json();
      await saveTokens(data.accessToken, data.refreshToken);
      setLoggedIn(true);
      fetchMe();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.protected.me.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUserEmail(data.email);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const logout = async () => {
    await clearTokens();
    setLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <ThemedText type="smallBold">Authentication</ThemedText>
          {loading ? (
            <ThemedText type="small">Loading...</ThemedText>
          ) : !loggedIn ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Pressable style={styles.button} onPress={login}>
                <ThemedText type="small" themeColor="text">
                  Log in
                </ThemedText>
              </Pressable>
            </>
          ) : loggedIn ? (
            <>
              {userEmail && <ThemedText>Logged in as {userEmail}</ThemedText>}
              <Pressable style={[styles.button, styles.buttonSecondary]} onPress={logout}>
                <ThemedText type="small" themeColor="text">
                  Log out
                </ThemedText>
              </Pressable>
            </>
          ) : null}
          {error && <ThemedText style={styles.error}>Error: {error}</ThemedText>}
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#3c87f7',
  },
  buttonSecondary: {
    backgroundColor: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#fff',
  },
  error: {
    color: '#ef4444',
  },
});
