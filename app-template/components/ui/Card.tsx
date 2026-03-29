/**
 * Card — Reusable Card Component
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { getColors, appConfig } from '../../config/tenant';

// =============================================================================
// TYPES
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  noBorder?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Card({
  children,
  onPress,
  style,
  padding = 16,
  margin = 0,
  noBorder = false,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark' ? 'dark' : 'light');
  
  const cardStyle = appConfig.ui.cardStyle;
  
  const getCardStyles = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding,
      margin,
    };
    
    switch (cardStyle) {
      case 'elevated':
        return {
          ...base,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...base,
          borderWidth: noBorder ? 0 : 1,
          borderColor: colors.border,
        };
      case 'filled':
      default:
        return base;
    }
  };
  
  const Wrapper = onPress ? TouchableOpacity : View;
  
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[getCardStyles(), style]}
    >
      {children}
    </Wrapper>
  );
}

export default Card;
