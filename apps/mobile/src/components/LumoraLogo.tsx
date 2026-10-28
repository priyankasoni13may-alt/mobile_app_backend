import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface LumoraLogoProps {
  size?: number;
  showText?: boolean;
  style?: ViewStyle;
}

const officialLogo = require('../../assets/lumora-logo.png');

export const LumoraLogo: React.FC<LumoraLogoProps> = ({ size = 64, style }) => {
  const width = Math.round(size * (312 / 276));
  const height = size;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={officialLogo}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LumoraLogo;
