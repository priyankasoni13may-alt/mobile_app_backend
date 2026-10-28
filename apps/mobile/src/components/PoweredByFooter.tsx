import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface PoweredByFooterProps {
  style?: ViewStyle;
}

export const PoweredByFooter: React.FC<PoweredByFooterProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.kicker}>POWERED BY</Text>
      <Text style={styles.brand}>Cypher Swift Infotech Pvt. Ltd.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 3
  },
  kicker: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  brand: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.4,
  },
});

export default PoweredByFooter;
