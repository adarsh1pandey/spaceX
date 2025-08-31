import { useQuery } from '@tanstack/react-query';
import { spacexApi } from '../api/spacex';
import { logger } from '../utils/logger';

export function useLaunchpad(launchpadId: string) {
  return useQuery({
    queryKey: ['launchpad', launchpadId],
    queryFn: async () => {
      logger.debug(`Fetching launchpad details for ${launchpadId}`);
      return spacexApi.getLaunchpad(launchpadId);
    },
    enabled: !!launchpadId,
    staleTime: 30 * 60 * 1000, // 30 minutes (launchpad data changes rarely)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAllLaunchpads() {
  return useQuery({
    queryKey: ['allLaunchpads'],
    queryFn: async () => {
      logger.debug('Fetching all launchpads');
      return spacexApi.getAllLaunchpads();
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
}
