import React from 'react';
import { StyleProp, TextStyle, OpaqueColorValue } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export type IconSymbolName =
  | 'home'
  | 'settings'
  | 'search'
  | 'person'
  | 'star'
  | 'location'
  | 'calendar'
  | 'time'
  | 'checkmark-circle'
  | 'hammer'
  | 'flash'
  | 'water'
  | 'construct'
  | 'chevron-forward'
  | 'chevron-down'
  | 'close'
  | 'alert-circle';

interface IconSymbolProps {
  name: IconSymbolName | string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  if (name === 'hammer' || name === 'construct') {
      return <FontAwesome5 name="hammer" size={size} color={color as string} style={style} />;
  }
  
  if (name === 'water') {
    return <FontAwesome5 name="tint" size={size} color={color as string} style={style} />;
  }

  return <Ionicons name={name as any} size={size} color={color} style={style} />;
}
