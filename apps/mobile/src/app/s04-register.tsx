import React, { useState, useRef } from 'react';
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
import { User, Mail, Phone, Lock, CheckSquare, Square } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const fullNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    const finalName = fullName.trim();
    const finalEmail = email.trim();
    const finalPhone = phone.trim();
    const finalPassword = password;

    if (!finalName || !finalEmail || !finalPhone || !finalPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!consentGiven) {
      setErrorMsg('You must agree to partner terms and compliance.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await apiClient.register({
        fullName: finalName,
        email: finalEmail,
        phone: finalPhone,
        password: finalPassword,
        role: 'PARTNER'
      });

      const data = res.data as any;
      const token = data?.accessToken || data?.token;
      if (data?.user && token) {
        setAuth(
          token,
          data?.refreshToken || '',
          data.user as any,
          (data.user as any)?.profile
        );
      }

      router.push({
        pathname: '/s05-otp',
        params: { identifier: finalEmail, phone: finalPhone }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerBox}>
        <Text style={styles.title}>Join Partner Network</Text>
        <Text style={styles.subtitle}>Represent Lumora & Cypher Swift. Earn high incentives for qualified deals.</Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <User size={16} color="#94A3B8" />
            <TextInput
              ref={fullNameRef}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#64748B"
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              autoComplete="off"
              importantForAutofill="no"
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>
        </View>

        {/* Business Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Corporate / Business Email</Text>
          <View style={styles.inputBox}>
            <Mail size={16} color="#94A3B8" />
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              importantForAutofill="no"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          </View>
        </View>

        {/* Mobile Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Phone Number</Text>
          <View style={styles.inputBox}>
            <Phone size={16} color="#94A3B8" />
            <TextInput
              ref={phoneRef}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              autoComplete="off"
              importantForAutofill="no"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Create Strong Password</Text>
          <View style={styles.inputBox}>
            <Lock size={16} color="#94A3B8" />
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              importantForAutofill="no"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>
        </View>

        {/* Consent Checkbox */}
        <TouchableOpacity
          onPress={() => setConsentGiven(!consentGiven)}
          style={styles.consentRow}
          activeOpacity={0.8}
        >
          {consentGiven ? (
            <CheckSquare size={18} color="#5B8EE2" />
          ) : (
            <Square size={18} color="#64748B" />
          )}
          <Text style={styles.consentText}>
            I confirm truthful representation and agree to abide by the Partner Code of Conduct and privacy rules.
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleRegister}
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Create Account & Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.push('/s03-login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 24, paddingBottom: 60 },
  headerBox: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 18 },
  errorBanner: { padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 12, color: '#EF4444' },
  form: { gap: 14 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
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
    paddingVertical: 12
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  consentText: { flex: 1, fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  submitBtn: {
    backgroundColor: '#5B8EE2',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  submitBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  loginText: { fontSize: 12, color: '#94A3B8' },
  loginLink: { fontSize: 12, color: '#5B8EE2', fontWeight: 'bold' }
});
