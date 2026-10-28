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
  ArrowRight
} from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';
import { LumoraLogo } from '../components/LumoraLogo';
import { LumoraGradientText } from '../components/LumoraGradientText';
import { LumoraButton } from '../components/LumoraButton';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      badge: 'POSITION & EXPAND',
      title: "Lumora's Partners",
      gradientLine: 'Accelerate Growth.',
      subtitle: 'Business Development Global Network. Connect qualified B2B enterprise leads in AI Automation, Custom Tech, and Performance Growth.',
      icon: Sparkles,
      color: '#4F75FF'
    },
    {
      badge: 'COMMERCIAL TRANSPARENCY',
      title: 'Earning Structure',
      gradientLine: '10% Revenue Share.',
      subtitle: 'Earn ₹1,000 on diagnostic audit closures, 10% on ongoing service engagements, plus a ₹1,00,000 annual performance bonus.',
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      badge: 'ETHICS & COMPLIANCE',
      title: 'Enterprise Trust',
      gradientLine: 'Zero False Claims.',
      subtitle: 'Truthful representation, DPDP compliance, and backend financial governance with immutable transaction tracking.',
      icon: ShieldCheck,
      color: '#EC4899'
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
        <LumoraLogo size={48} showText={false} />
        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>{steps[currentStep].badge}</Text>
        </View>
      </View>

      {/* Step Card Content */}
      <View style={styles.cardContainer}>
        <View style={[styles.iconBox, { backgroundColor: `${steps[currentStep].color}12`, borderColor: `${steps[currentStep].color}30` }]}>
          <StepIcon size={34} color={steps[currentStep].color} />
        </View>

        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
        
        <View style={styles.gradientLineBox}>
          <LumoraGradientText
            text={steps[currentStep].gradientLine}
            fontSize={26}
            fontWeight="900"
            height={34}
            align="middle"
          />
        </View>

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
        <LumoraButton
          title={currentStep === steps.length - 1 ? 'Explore Network' : 'Next'}
          onPress={handleNext}
        />

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

        <PoweredByFooter style={{ paddingVertical: 2 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: 36,
    alignItems: 'center',
    gap: 10
  },
  pillBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B0F26',
    textAlign: 'center',
    letterSpacing: -0.3
  },
  gradientLineBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24
  },
  indicator: {
    height: 6,
    borderRadius: 3
  },
  indicatorActive: {
    width: 26,
    backgroundColor: '#4F75FF'
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: '#E2E8F0'
  },
  footer: {
    gap: 10,
    marginBottom: 10
  },
  loginBtn: {
    alignItems: 'center',
    paddingVertical: 6
  },
  loginBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  },
  loginHighlight: {
    color: '#4F75FF',
    fontWeight: '700'
  },
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  legalText: {
    fontSize: 11,
    color: '#94A3B8'
  },
  legalLink: {
    fontSize: 11,
    color: '#4F75FF',
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});
