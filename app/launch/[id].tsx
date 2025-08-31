import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useLaunch } from '../../hooks/useLaunches';
import { useLaunchpad } from '../../hooks/useLaunchpad';
import { useUserLocation } from '../../hooks/useUserLocation';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import WebViewMapView from '../../components/WebViewMapView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { calculateDistance, formatDistance, openMapsWithDirections } from '../../utils/maps';
import { logger } from '../../utils/logger';

const MAP_HEIGHT = 250;

export default function LaunchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  
  const { data: launch, isLoading: launchLoading, error: launchError } = useLaunch(id!);
  const { data: launchpad, isLoading: launchpadLoading, error: launchpadError } = useLaunchpad(launch?.launchpad || '');
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
    requestLocationPermission,
    hasPermission,
  } = useUserLocation();

  const isLoading = launchLoading || launchpadLoading;
  const error = launchError || launchpadError;

  const distanceToLaunchpad = useMemo(() => {
    if (userLocation && launchpad) {
      return calculateDistance(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        {
          latitude: launchpad.latitude,
          longitude: launchpad.longitude,
        }
      );
    }
    return null;
  }, [userLocation, launchpad]);

  const handleGetDirections = async () => {
    if (!launchpad) return;
    
    try {
      await openMapsWithDirections(
        {
          latitude: launchpad.latitude,
          longitude: launchpad.longitude,
        },
        launchpad.full_name
      );
    } catch (error) {
      logger.error('Failed to open maps', error as Error);
    }
  };

  const handleLocationPermission = async () => {
    await requestLocationPermission();
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy \'at\' HH:mm');
    } catch {
      return 'Date TBD';
    }
  };

  const getStatusInfo = () => {
    if (!launch) return { color: '#8E8E93', text: 'Unknown', icon: 'help' as const };
    
    if (launch.upcoming) return { color: '#FF9500', text: 'Upcoming', icon: 'schedule' as const };
    if (launch.success === true) return { color: '#34C759', text: 'Success', icon: 'check-circle' as const };
    if (launch.success === false) return { color: '#FF3B30', text: 'Failed', icon: 'error' as const };
    return { color: '#8E8E93', text: 'Unknown', icon: 'help' as const };
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Launch Details' }} />
        <LoadingState message="Loading launch details..." />
      </ThemedView>
    );
  }

  if (error || !launch) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Launch Details' }} />
        <ErrorState
          message={error?.message || 'Failed to load launch details'}
        />
      </ThemedView>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: launch.name }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {launch.links.patch.large && (
            <Image
              source={{ uri: launch.links.patch.large }}
              style={styles.patchImage}
              resizeMode="contain"
            />
          )}
          <View style={styles.headerInfo}>
            <ThemedText style={styles.missionName}>{launch.name}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <MaterialIcons name={statusInfo.icon} size={16} color="white" />
              <ThemedText style={styles.statusText}>{statusInfo.text}</ThemedText>
            </View>
          </View>
        </View>

        {/* Launch Details */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Launch Information</ThemedText>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#0066CC" />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Date & Time</ThemedText>
              <ThemedText style={styles.detailValue}>{formatDate(launch.date_utc)}</ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="flight" size={20} color="#0066CC" />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Flight Number</ThemedText>
              <ThemedText style={styles.detailValue}>#{launch.flight_number}</ThemedText>
            </View>
          </View>

          {launch.details && (
            <View style={styles.detailRow}>
              <MaterialIcons name="info" size={20} color="#0066CC" />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Details</ThemedText>
                <ThemedText style={styles.detailValue}>{launch.details}</ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Launchpad Section */}
        {launchpad && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Launchpad</ThemedText>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="place" size={20} color="#0066CC" />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Location</ThemedText>
                <ThemedText style={styles.detailValue}>{launchpad.full_name}</ThemedText>
                <ThemedText style={styles.detailSubvalue}>
                  {launchpad.locality}, {launchpad.region}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="rocket-launch" size={20} color="#0066CC" />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Launch History</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {launchpad.launch_successes} successful out of {launchpad.launch_attempts} attempts
                </ThemedText>
              </View>
            </View>

            {distanceToLaunchpad && (
              <View style={styles.detailRow}>
                <MaterialIcons name="near-me" size={20} color="#0066CC" />
                <View style={styles.detailContent}>
                  <ThemedText style={styles.detailLabel}>Distance from You</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {formatDistance(distanceToLaunchpad)}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Map Section */}
        {launchpad && (
          <View style={styles.section}>
            <View style={styles.mapHeader}>
              <ThemedText style={styles.sectionTitle}>Map Location</ThemedText>
              <TouchableOpacity onPress={toggleMapType} style={styles.mapTypeButton}>
                <MaterialIcons 
                  name={mapType === 'standard' ? 'satellite' : 'map'} 
                  size={20} 
                  color="#0066CC" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapNotice}>
              <MaterialIcons name="public" size={16} color="#007AFF" />
              <ThemedText style={styles.mapNoticeText}>
                WebView maps - No API keys required
              </ThemedText>
            </View>
            
            <View style={styles.mapContainer}>
              <WebViewMapView 
                latitude={launchpad.latitude}
                longitude={launchpad.longitude}
                title={launchpad.name}
                description={`${launchpad.full_name}\n${launchpad.locality}, ${launchpad.region}`}
                height={MAP_HEIGHT}
              />
            </View>

            <View style={styles.mapActions}>
              {!hasPermission && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.locationButton]} 
                  onPress={handleLocationPermission}
                  disabled={locationLoading}
                >
                  <MaterialIcons name="my-location" size={20} color="white" />
                  <ThemedText style={styles.actionButtonText}>
                    {locationLoading ? 'Getting Location...' : 'Show My Location'}
                  </ThemedText>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.directionsButton]} 
                onPress={handleGetDirections}
              >
                <MaterialIcons name="directions" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>Get Directions</ThemedText>
              </TouchableOpacity>
            </View>

            {locationError && (
              <View style={styles.locationError}>
                <MaterialIcons name="warning" size={16} color="#FF9500" />
                <ThemedText style={styles.locationErrorText}>{locationError}</ThemedText>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  patchImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  missionName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailSubvalue: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapTypeButton: {
    padding: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  locationButton: {
    backgroundColor: '#FF9500',
  },
  directionsButton: {
    backgroundColor: '#0066CC',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationError: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  locationErrorText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
  },
  mapNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  mapNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 8,
  },
});
