import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Partner with Lumora & Cypher Swift',
      subtitle: 'Generate qualified B2B opportunities in Performance Marketing, AI Automation, and Custom Software.',
      icon: Sparkles,
      color: '#5B8EE2'
    },
    {
      title: 'Transparent Earning Structure',
      subtitle: 'Earn ₹1,000 on diagnostic audit closures, 10% on service engagements, plus a ₹1,00,000 annual bonus.',
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      title: 'Ethical & Compliant Outreach',
      subtitle: 'Truthful representation, DPDP compliance, and backend financial governance. Zero false claims.',
      icon: ShieldCheck,
      color: '#38BDF8'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/s04-register');
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoLumora}>LUMORA</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoCypher}>CYPHER SWIFT</Text>
        </View>
        <Text style={styles.networkBadge}>Verified Partner Network</Text>
      </View>

      {/* Step Content */}
      <View style={styles.cardContainer}>
        <View style={[styles.iconBox, { backgroundColor: `${steps[currentStep].color}20` }]}>
          <StepIcon size={40} color={steps[currentStep].color} />
        </View>

        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
        <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>

        {/* Carousel Indicators */}
        <View style={styles.indicatorRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                currentStep === i ? styles.indicatorActive : styles.indicatorInactive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/s03-login')}
          style={styles.loginBtn}
        >
          <Text style={styles.loginBtnText}>
            Already a registered partner? <Text style={styles.loginHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.legalRow}>
          <Text style={styles.legalText}>By continuing, you agree to the </Text>
          <TouchableOpacity onPress={() => router.push('/s08-agreement')}>
            <Text style={styles.legalLink}>Partner Code of Conduct</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19', padding: 24, justifyContent: 'space-between' },
  header: { marginTop: 40, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoLumora: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  logoPlus: { fontSize: 16, fontWeight: 'bold', color: '#5B8EE2' },
  logoCypher: { fontSize: 20, fontWeight: '900', color: '#38BDF8', letterSpacing: 1 },
  networkBadge: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  cardContainer: { alignItems: 'center', paddingHorizontal: 16 },
  iconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
  stepSubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  indicatorRow: { flexDirection: 'row', gap: 8, marginTop: 30 },
  indicator: { height: 6, borderRadius: 3 },
  indicatorActive: { width: 24, backgroundColor: '#5B8EE2' },
  indicatorInactive: { width: 8, backgroundColor: '#1E294B' },
  footer: { gap: 14, marginBottom: 20 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingVertical: 14, borderRadius: 12, shadowColor: '#5B8EE2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  primaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  loginBtn: { alignItems: 'center', paddingVertical: 6 },
  loginBtnText: { fontSize: 12, color: '#94A3B8' },
  loginHighlight: { color: '#5B8EE2', fontWeight: 'bold' },
  legalRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  legalText: { fontSize: 10, color: '#64748B' },
  legalLink: { fontSize: 10, color: '#38BDF8', fontWeight: '600', textDecorationLine: 'underline' }
});
