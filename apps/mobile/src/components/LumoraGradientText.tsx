import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LumoraGradientTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  height?: number;
  style?: ViewStyle;
  align?: 'start' | 'middle' | 'end';
}

export const LumoraGradientText: React.FC<LumoraGradientTextProps> = ({
  text,
  fontSize = 28,
  fontWeight = '800',
  height = 38,
  style,
  align = 'start',
}) => {
  const xPos = align === 'middle' ? '50%' : align === 'end' ? '100%' : '0';

  return (
    <View style={[{ height, width: '100%' }, style]}>
      <Svg height={height} width="100%">
        <Defs>
          <LinearGradient id="lumoraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4F75FF" />
            <Stop offset="35%" stopColor="#8B5CF6" />
            <Stop offset="70%" stopColor="#E0A97D" />
            <Stop offset="100%" stopColor="#EC4899" />
          </LinearGradient>
        </Defs>
        <SvgText
          fill="url(#lumoraGrad)"
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor={align}
          x={xPos}
          y={fontSize - 2}
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
};

export default LumoraGradientText;
