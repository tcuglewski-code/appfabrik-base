/**
 * Button — Reusable Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { getColors } from '../../config/tenant';

// =============================================================================
// TYPES
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark' ? 'dark' : 'light');
  
  const isDisabled = disabled || loading;
  
  // ==========================================================================
  // STYLES
  // ==========================================================================
  
  const getBackgroundColor = (): string => {
    if (isDisabled) return colors.border;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return colors.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };
  
  const getTextColor = (): string => {
    if (isDisabled) return colors.textMuted;
    
    switch (variant) {
      case 'primary':
        return colors.textOnPrimary;
      case 'secondary':
        return colors.textOnSecondary;
      case 'danger':
        return '#FFFFFF';
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.text;
      default:
        return colors.textOnPrimary;
    }
  };
  
  const getBorderColor = (): string => {
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };
  
  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };
  
  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return 13;
      case 'lg':
        return 17;
      default:
        return 15;
    }
  };
  
  // ==========================================================================
  // RENDER
  // ==========================================================================
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
        },
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <>{icon}</>
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                marginLeft: icon && iconPosition === 'left' ? 8 : 0,
                marginRight: icon && iconPosition === 'right' ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <>{icon}</>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outline: {
    borderWidth: 1.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
