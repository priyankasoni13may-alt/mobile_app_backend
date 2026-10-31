import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff, X, RefreshCw } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { PoweredByFooter } from '../components/PoweredByFooter';
import { LumoraLogo } from '../components/LumoraLogo';
import { LumoraGradientText } from '../components/LumoraGradientText';
import { LumoraButton } from '../components/LumoraButton';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const identifierRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-warm the backend Render API when login screen opens to prevent cold-start delay
  useEffect(() => {
    apiClient.getHealth().catch(() => {});
  }, []);

  const handleLogin = async () => {
    const finalIdentifier = identifier.trim();
    const finalPassword = password;

    if (!finalIdentifier || !finalPassword) {
      setErrorMsg('Please enter both email/phone and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await apiClient.login({ identifier: finalIdentifier, password: finalPassword });
      if (res.data?.user && res.data.accessToken) {
        setAuth(
          res.data.accessToken,
          res.data.refreshToken || '',
          res.data.user as any,
          (res.data.user as any)?.profile
        );
        router.replace('/(tabs)');
      } else {
        setErrorMsg('Invalid login response. Please retry.');
      }
    } catch (err: any) {
      const isTimeout =
        err.message?.toLowerCase().includes('timed out') ||
        err.message?.toLowerCase().includes('timeout') ||
        err.code === 'REQUEST_TIMEOUT';
      if (isTimeout) {
        setErrorMsg('Server was establishing connection. It is active now — please tap Sign In again.');
      } else {
        setErrorMsg(err.message || 'Incorrect credentials. Check details or try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearIdentifier = () => {
    setIdentifier('');
    identifierRef.current?.focus();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={styles.headerBox}>
          <LumoraLogo size={44} showText={false} />
          <Text style={styles.brandTitle}>Lumora's Partners</Text>
          <View style={styles.gradientLineBox}>
            <LumoraGradientText
              text="Business Development Global Network"
              fontSize={14}
              fontWeight="800"
              height={22}
              align="middle"
            />
          </View>
          <Text style={styles.subtitle}>Sign in to access your leads, meetings, and incentives</Text>
        </View>

        {/* Error Message Alert with Tap to Retry */}
        {errorMsg ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            style={styles.errorBanner}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RefreshCw size={13} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
            <Text style={styles.retryHintText}>Tap here to retry Sign In</Text>
          </TouchableOpacity>
        ) : null}

        {/* Input Fields */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <View style={styles.inputBox}>
              <Mail size={16} color="#64748B" />
              <TextInput
                ref={identifierRef}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter your phone or email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                style={styles.input}
                underlineColorAndroid="transparent"
                cursorColor="#4F75FF"
                selectionColor="#4F75FF"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TouchableOpacity
                onPress={handleClearIdentifier}
                style={[styles.clearBtn, { opacity: identifier.length > 0 ? 1 : 0 }]}
                disabled={identifier.length === 0}
              >
                <X size={15} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={async () => {
                const idToUse = identifier.trim();
                if (idToUse) {
                  try {
                    await apiClient.requestOtp({ identifier: idToUse, channel: 'sms' });
                  } catch {}
                  router.push({ pathname: '/s05-otp', params: { identifier: idToUse } });
                } else {
                  router.push('/s05-otp');
                }
              }}>
                <Text style={styles.forgotLink}>Login via SMS OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
              <Lock size={16} color="#64748B" />
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                style={styles.input}
                underlineColorAndroid="transparent"
                cursorColor="#4F75FF"
                selectionColor="#4F75FF"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
              </TouchableOpacity>
            </View>
          </View>

          <LumoraButton
            title="Sign In"
            loadingText="Signing In..."
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have a partner account? </Text>
            <TouchableOpacity onPress={() => router.push('/s04-register')}>
              <Text style={styles.registerLink}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PoweredByFooter style={{ marginTop: 'auto', paddingTop: 28, paddingBottom: 8 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 30, paddingBottom: 24, justifyContent: 'space-between' },
  headerBox: { marginBottom: 24, alignItems: 'center', gap: 6 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#0B0F26', letterSpacing: 0.5, textAlign: 'center', marginTop: 8 },
  gradientLineBox: { width: '100%', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4 },
  errorBanner: { padding: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 10, marginBottom: 16, gap: 4 },
  errorText: { fontSize: 12, color: '#DC2626', fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  retryHintText: { fontSize: 11, color: '#4F75FF', fontWeight: '800', textAlign: 'center', marginTop: 2, textDecorationLine: 'underline' },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 18,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  inputGroup: { gap: 6 },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  forgotLink: { fontSize: 11, color: '#4F75FF', fontWeight: '700' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50
  },
  input: {
    flex: 1,
    color: '#0B0F26',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 0
  },
  clearBtn: { padding: 8 },
  eyeBtn: { padding: 8 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  registerText: { fontSize: 13, color: '#64748B' },
  registerLink: { fontSize: 13, color: '#4F75FF', fontWeight: 'bold' }
});
