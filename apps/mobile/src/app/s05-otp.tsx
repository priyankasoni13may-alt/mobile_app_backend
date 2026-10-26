import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const params = useLocalSearchParams();
  const identifier = (params.identifier as string) || '';

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await apiClient.verifyOtp({ identifier, otp });
      const data = res.data as any;
      if (data?.accessToken && data?.user) {
        setAuth(
          data.accessToken,
          data.refreshToken || '',
          data.user,
          data.user.profile
        );
      }
      router.replace('/s06-profile-setup');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await apiClient.requestOtp({ identifier, channel: 'sms' });
      setTimer(60);
      setErrorMsg('');
      alert('A new 6-digit verification code has been dispatched.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={36} color="#5B8EE2" />
        </View>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit verification code to your inbox at{' '}
          <Text style={styles.destText}>{identifier || 'your email address'}</Text>
        </Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* 6-Digit Code Input */}
      <View style={styles.otpBox}>
        <TextInput
          value={otp}
          onChangeText={(val) => {
            if (/^\d*$/.test(val) && val.length <= 6) {
              setOtp(val);
            }
          }}
          placeholder="••••••"
          placeholderTextColor="#64748B"
          keyboardType="numeric"
          maxLength={6}
          style={styles.otpInput}
        />
        <Text style={styles.otpHint}>Enter the 6-digit verification code</Text>
      </View>

      {/* Resend Timer */}
      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend code in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
            <RefreshCw size={14} color="#5B8EE2" />
            <Text style={styles.resendBtnText}>Resend Verification Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleVerify}
        disabled={loading}
        style={styles.verifyBtn}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(91, 142, 226, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  destText: { color: '#38BDF8', fontWeight: 'bold' },
  errorBanner: { padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 12, color: '#EF4444', textAlign: 'center' },
  otpBox: { alignItems: 'center', marginVertical: 10 },
  otpInput: { width: 220, height: 56, backgroundColor: '#0B1026', borderWidth: 1.5, borderColor: '#5B8EE2', borderRadius: 12, fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', letterSpacing: 10, paddingVertical: 0 },
  otpHint: { fontSize: 11, color: '#64748B', marginTop: 8 },
  resendRow: { alignItems: 'center', marginVertical: 16 },
  timerText: { fontSize: 12, color: '#64748B' },
  resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resendBtnText: { fontSize: 12, fontWeight: 'bold', color: '#5B8EE2' },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10, marginTop: 10 },
  verifyBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }
});
