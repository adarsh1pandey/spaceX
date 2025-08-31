import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({ 
  message = 'Something went wrong', 
  onRetry,
  retryText = 'Try Again'
}: ErrorStateProps) {
  return (
    <ThemedView style={styles.container}>
      <MaterialIcons name="error-outline" size={64} color="#FF6B6B" />
      <ThemedText style={styles.title}>Oops!</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <ThemedText style={styles.retryText}>{retryText}</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
