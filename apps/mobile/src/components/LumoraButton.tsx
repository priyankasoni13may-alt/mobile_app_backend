import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
  LayoutChangeEvent
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { ArrowRight } from 'lucide-react-native';

interface LumoraButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: boolean | React.ReactNode;
  variant?: 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LumoraButton: React.FC<LumoraButtonProps> = ({
  title,
  onPress,
  loading = false,
  loadingText,
  disabled = false,
  style,
  icon = true,
  variant = 'gradient',
  size = 'md',
}) => {
  const height = size === 'sm' ? 40 : size === 'lg' ? 52 : 48;
  const borderRadius = height / 2;
  const [btnWidth, setBtnWidth] = useState<number>(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const measuredWidth = Math.round(e.nativeEvent.layout.width);
    if (measuredWidth > 0 && measuredWidth !== btnWidth) {
      setBtnWidth(measuredWidth);
    }
  };

  const renderIcon = (color: string) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    return <ArrowRight size={size === 'sm' ? 14 : 16} color={color} />;
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.outlineContainer, { height, borderRadius }, style]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#4F75FF" />
            <Text style={[styles.outlineText, { marginLeft: 8 }]}>{loadingText || title}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.outlineText}>{title}</Text>
            {renderIcon('#4F75FF')}
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      onLayout={handleLayout}
      disabled={disabled || loading}
      style={[styles.container, { height, borderRadius }, style]}
    >
      <Svg
        width={btnWidth || '100%'}
        height={height}
        viewBox={btnWidth ? `0 0 ${btnWidth} ${height}` : undefined}
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <LinearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4F75FF" />
            <Stop offset="100%" stopColor="#EC4899" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={btnWidth || '100%'}
          height={height}
          rx={borderRadius}
          ry={borderRadius}
          fill="url(#btnGrad)"
        />
      </Svg>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={[styles.text, { marginLeft: 8 }]}>{loadingText || 'Signing In...'}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.text}>{title}</Text>
          {renderIcon('#FFFFFF')}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F75FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    overflow: 'hidden',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineContainer: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#4F75FF',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
  },
  outlineText: {
    color: '#4F75FF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LumoraButton;
