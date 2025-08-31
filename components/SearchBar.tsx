import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onDebouncedChange?: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
  autoFocus?: boolean;
}

export function SearchBar({ 
  value, 
  onChangeText, 
  onDebouncedChange,
  placeholder = 'Search missions...', 
  debounceMs = 300,
  autoFocus = false 
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search implementation
  useEffect(() => {
    if (!onDebouncedChange) return;
    
    const timer = setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleClear = useCallback(() => {
    onChangeText('');
    // Also trigger debounced change immediately to clear the search results
    if (onDebouncedChange) {
      onDebouncedChange('');
    }
  }, [onChangeText, onDebouncedChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <View style={[
      styles.wrapper, 
      { paddingTop: Math.max(insets.top + 8, 16) }
    ]}>
      <View style={[
        styles.container, 
        isDark && styles.containerDark,
        isFocused && styles.containerFocused,
        isFocused && isDark && styles.containerFocusedDark
      ]}>
        <MaterialIcons 
          name="search" 
          size={20} 
          color={isFocused ? '#007AFF' : (isDark ? '#8E8E93' : '#8E8E93')} 
        />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          returnKeyType="search"
          clearButtonMode="never"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={true}
        />
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear} 
            style={[styles.clearButton, isDark && styles.clearButtonDark]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons 
              name="close" 
              size={18} 
              color={isDark ? '#8E8E93' : '#8E8E93'} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  containerFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerFocusedDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#007AFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
    color: '#000',
    minHeight: 20,
  },
  inputDark: {
    color: '#FFF',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonDark: {
    backgroundColor: 'rgba(142, 142, 147, 0.24)',
  },
});
