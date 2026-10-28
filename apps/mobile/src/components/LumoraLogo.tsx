import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

interface LumoraLogoProps {
  size?: number;
  showText?: boolean;
}

export const LumoraLogo: React.FC<LumoraLogoProps> = ({ size = 64, showText = true }) => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {/* Multi-spectrum radiant gradient */}
          <LinearGradient id="starGradH" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="30%" stopColor="#818CF8" />
            <Stop offset="50%" stopColor="#F59E0B" />
            <Stop offset="70%" stopColor="#EC4899" />
            <Stop offset="100%" stopColor="#38BDF8" />
          </LinearGradient>
          <LinearGradient id="starGradV" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EC4899" />
            <Stop offset="50%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#4F75FF" />
          </LinearGradient>
          <LinearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#FDE047" />
          </LinearGradient>
        </Defs>

        {/* Outer subtle concentric rings from screenshot */}
        <Circle cx="50" cy="50" r="46" stroke="#F1F5F9" strokeWidth="1" fill="none" />
        <Circle cx="50" cy="50" r="38" stroke="#F8FAFC" strokeWidth="1" fill="none" />

        {/* Diagonal Ray 1 (Top-Left to Bottom-Right) */}
        <Path d="M22 22 L50 48 L78 78 L50 52 Z" fill="#818CF8" opacity="0.8" />
        {/* Diagonal Ray 2 (Top-Right to Bottom-Left) */}
        <Path d="M78 22 L52 50 L22 78 L48 50 Z" fill="#EC4899" opacity="0.8" />

        {/* Horizontal Sharp Ray */}
        <Path d="M5 50 Q40 47 50 44 Q60 47 95 50 Q60 53 50 56 Q40 53 5 50 Z" fill="url(#starGradH)" />

        {/* Vertical Sharp Ray */}
        <Path d="M50 5 Q47 40 44 50 Q47 60 50 95 Q53 60 56 50 Q53 40 50 5 Z" fill="url(#starGradV)" />

        {/* Central Brilliant Core Glow */}
        <Circle cx="50" cy="50" r="6" fill="url(#coreGlow)" />
        <Circle cx="50" cy="50" r="3" fill="#FFFFFF" />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.lumoraText}>LUMORA</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 8,
  },
  lumoraText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: 4,
  },
});

export default LumoraLogo;
