import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';

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
        <View style={styles.badgeRow}>
          <Text style={styles.brandLumora}>LUMORA</Text>
          <View style={styles.plusBox}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <Text style={styles.brandCypher}>CYPHER SWIFT</Text>
        </View>

        <Text style={styles.tagline}>Partner Network App v2.0</Text>
        <Text style={styles.subtext}>Business Development & High-Trust Incentive Network</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#5B8EE2" />
        <Text style={styles.footerText}>Secure Enterprise Environment Initializing...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 },
  logoContainer: { alignItems: 'center', marginTop: 180 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandLumora: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
  plusBox: { backgroundColor: '#5B8EE2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  plusText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  brandCypher: { fontSize: 24, fontWeight: '900', color: '#38BDF8', letterSpacing: 2 },
  tagline: { fontSize: 13, fontWeight: 'bold', color: '#5B8EE2', marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 },
  subtext: { fontSize: 11, color: '#94A3B8', marginTop: 4, textAlign: 'center', maxWidth: 280 },
  footer: { alignItems: 'center', gap: 10 },
  footerText: { fontSize: 11, color: '#64748B' }
});
