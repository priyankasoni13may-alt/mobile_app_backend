import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff, X } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';

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
      setErrorMsg(err.message || 'Incorrect credentials. Check details or try again.');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your leads, meetings, and incentives</Text>
        </View>

        {/* Error Message Alert */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Input Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <View style={styles.inputBox}>
              <Mail size={16} color="#94A3B8" />
              <TextInput
                ref={identifierRef}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter your phone or email"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                style={styles.input}
                underlineColorAndroid="transparent"
                cursorColor="#5B8EE2"
                selectionColor="#5B8EE2"
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
              <Lock size={16} color="#94A3B8" />
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                style={styles.input}
                underlineColorAndroid="transparent"
                cursorColor="#5B8EE2"
                selectionColor="#5B8EE2"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have a partner account? </Text>
            <TouchableOpacity onPress={() => router.push('/s04-register')}>
              <Text style={styles.registerLink}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  scrollContent: { flexGrow: 1 },
  content: { padding: 24, paddingTop: 40, paddingBottom: 60 },
  headerBox: { marginBottom: 24, marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  errorBanner: { padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 12, color: '#EF4444', fontWeight: '500' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  forgotLink: { fontSize: 11, color: '#38BDF8', fontWeight: '600' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1026',
    borderWidth: 1,
    borderColor: '#1E294B',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 52
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 0
  },
  submitBtn: {
    backgroundColor: '#5B8EE2',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  submitBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  clearBtn: { padding: 8 },
  eyeBtn: { padding: 8 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 12, color: '#94A3B8' },
  registerLink: { fontSize: 12, color: '#5B8EE2', fontWeight: 'bold' }
});
