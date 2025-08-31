import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function EmptyState({ 
  title = 'No Results',
  message = 'Nothing to show here yet',
  icon = 'search-off'
}: EmptyStateProps) {
  return (
    <ThemedView style={styles.container}>
      <MaterialIcons name={icon} size={64} color="#CCCCCC" />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
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
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
  },
});
