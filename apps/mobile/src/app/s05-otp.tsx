import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, RefreshCw } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { PoweredByFooter } from '../components/PoweredByFooter';
import { LumoraButton } from '../components/LumoraButton';

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
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentCard}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={36} color="#4F75FF" />
          </View>
          <Text style={styles.title}>Verify Your Account</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit verification code sent to{' '}
            <Text style={styles.destText}>{identifier || 'your email or mobile'}</Text>
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
            placeholderTextColor="#CBD5E1"
            keyboardType="numeric"
            maxLength={6}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
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
              <RefreshCw size={14} color="#4F75FF" />
              <Text style={styles.resendBtnText}>Resend Verification Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action CTA */}
        <LumoraButton
          title="Verify & Proceed"
          onPress={handleVerify}
          loading={loading}
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>

      <PoweredByFooter style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center'
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(79, 117, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B0F26',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  destText: {
    color: '#4F75FF',
    fontWeight: '700'
  },
  errorBanner: {
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    marginBottom: 16
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center'
  },
  otpBox: {
    alignItems: 'center',
    marginVertical: 10
  },
  otpInput: {
    width: 220,
    height: 56,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#4F75FF',
    borderRadius: 12,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0B0F26',
    textAlign: 'center',
    letterSpacing: 10,
    paddingVertical: 0
  },
  otpHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8
  },
  resendRow: {
    alignItems: 'center',
    marginVertical: 14
  },
  timerText: {
    fontSize: 12,
    color: '#94A3B8'
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  resendBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F75FF'
  }
});
