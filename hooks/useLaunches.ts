import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { spacexApi } from '../api/spacex';
import type { LaunchesQuery } from '../types/spacex';
import { logger } from '../utils/logger';

const LAUNCHES_PER_PAGE = 20;

export function useLaunches(searchQuery?: string) {
  return useInfiniteQuery({
    queryKey: ['launches', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const query: LaunchesQuery = {
        query: {},
        options: {
          page: pageParam,
          limit: LAUNCHES_PER_PAGE,
          sort: {
            date_utc: 'desc',
          },
        },
      };

      logger.debug(`Fetching launches page ${pageParam}`);
      const response = await spacexApi.getLaunches(query);
      
      // Filter by search query if provided (client-side search)
      if (searchQuery && searchQuery.trim() !== '') {
        const filteredDocs = response.docs.filter((launch) =>
          launch.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
          ...response,
          docs: filteredDocs,
        };
      }
      
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useLaunch(launchId: string) {
  return useQuery({
    queryKey: ['launch', launchId],
    queryFn: async () => {
      logger.debug(`Fetching launch details for ${launchId}`);
      return spacexApi.getLaunch(launchId);
    },
    enabled: !!launchId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAllLaunches() {
  return useQuery({
    queryKey: ['allLaunches'],
    queryFn: async () => {
      logger.debug('Fetching all launches for search');
      return spacexApi.getAllLaunches();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}
