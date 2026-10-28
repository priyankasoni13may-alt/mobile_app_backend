import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface PoweredByFooterProps {
  style?: ViewStyle;
}

export const PoweredByFooter: React.FC<PoweredByFooterProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        powered by{' '}
        <Text style={styles.brand}>cypher swift infotech pvt. ltd.</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  brand: {
    color: '#4F75FF',
    fontWeight: '700',
  },
});

export default PoweredByFooter;
