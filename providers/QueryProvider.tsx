import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { logger } from '../utils/logger';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        logger.error(`Query failed ${failureCount} times`, error as Error);
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    },
    mutations: {
      retry: (failureCount, error) => {
        logger.error(`Mutation failed ${failureCount} times`, error as Error);
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
