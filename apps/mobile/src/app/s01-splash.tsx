import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { PoweredByFooter } from '../components/PoweredByFooter';
import { LumoraLogo } from '../components/LumoraLogo';
import { LumoraGradientText } from '../components/LumoraGradientText';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/s02-welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LumoraLogo size={90} showText={false} />
        
        <Text style={styles.brandTitle}>Lumora's Partners</Text>
        
        <View style={styles.gradientBox}>
          <LumoraGradientText
            text="Business Development Global Network"
            fontSize={15}
            fontWeight="800"
            height={24}
            align="middle"
          />
        </View>

        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>LOCAL | NATIONAL AND GLOBAL REACH</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#4F75FF" />
        <Text style={styles.footerText}>Secure Enterprise Environment Initializing...</Text>
        <PoweredByFooter style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 150,
    paddingHorizontal: 20,
    width: '100%'
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 20
  },
  gradientBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6
  },
  pillBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
    paddingHorizontal: 20
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500'
  }
});
