import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { useLaunches } from '../../hooks/useLaunches';
import { LaunchListItem } from '../../components/LaunchListItem';
import { SearchBar } from '../../components/SearchBar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { ThemedView } from '../../components/ThemedView';
import type { Launch } from '../../types/spacex';

export default function LaunchesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useLaunches(searchQuery);

  // Flatten all pages into a single array
  const launches = useMemo(() => {
    return data?.pages.flatMap(page => page.docs) || [];
  }, [data]);

  const handleLaunchPress = useCallback((launch: Launch) => {
    router.push({
      pathname: '/launch/[id]',
      params: { id: launch.id }
    });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderLaunchItem = useCallback(({ item }: { item: Launch }) => (
    <LaunchListItem launch={item} onPress={handleLaunchPress} />
  ), [handleLaunchPress]);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return <LoadingState message="Loading more launches..." size="small" />;
    }
    return null;
  }, [isFetchingNextPage]);

  const keyExtractor = useCallback((item: Launch) => item.id, []);

  if (isLoading && !launches.length) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'SpaceX Launches' }} />
        <LoadingState message="Loading SpaceX launches..." />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'SpaceX Launches' }} />
        <ErrorState 
          message={error?.message || 'Failed to load launches'}
          onRetry={handleRefresh}
        />
      </ThemedView>
    );
  }

  if (!launches.length && searchQuery) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'SpaceX Launches' }} />
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery}
        />
        <EmptyState
          title="No matches"
          message={`No launches found for "${searchQuery}"`}
          icon="search-off"
        />
      </ThemedView>
    );
  }

  if (!launches.length) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'SpaceX Launches' }} />
        <EmptyState
          title="No launches"
          message="No SpaceX launches available"
          icon="rocket-launch"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'SpaceX Launches' }} />
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={launches}
        renderItem={renderLaunchItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#0066CC"
          />
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        getItemLayout={(data, index) => ({
          length: 120, // Approximate item height
          offset: 120 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingVertical: 8,
  },
});
