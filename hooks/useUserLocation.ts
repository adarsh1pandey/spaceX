import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { logger } from '../utils/logger';
import type { Coordinates } from '../utils/maps';

export interface LocationState {
  location: Location.LocationObject | null;
  error: string | null;
  loading: boolean;
  permissionStatus: Location.PermissionStatus | null;
}

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    loading: false,
    permissionStatus: null,
  });

  const requestLocationPermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus !== 'granted') {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        setState(prev => ({ ...prev, permissionStatus: status }));
        
        if (status !== 'granted') {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Location permission denied. You can enable it in your device settings to see your distance to launch sites.',
          }));
          return false;
        }
      } else {
        setState(prev => ({ ...prev, permissionStatus: existingStatus }));
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      setState(prev => ({
        ...prev,
        location,
        loading: false,
        error: null,
      }));

      logger.info('User location obtained successfully');
      return true;
    } catch (error) {
      logger.error('Error getting user location', error as Error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to get your current location. Please check your location settings.',
      }));
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    if (state.permissionStatus !== 'granted') {
      return requestLocationPermission();
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      setState(prev => ({
        ...prev,
        location,
        loading: false,
      }));

      return true;
    } catch (error) {
      logger.error('Error refreshing location', error as Error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh your location.',
      }));
      return false;
    }
  }, [state.permissionStatus, requestLocationPermission]);

  // Get permission status on mount
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setState(prev => ({ ...prev, permissionStatus: status }));
      } catch (error) {
        logger.error('Error checking location permission', error as Error);
      }
    };

    checkPermissionStatus();
  }, []);

  const getUserCoordinates = useCallback((): Coordinates | null => {
    if (state.location) {
      return {
        latitude: state.location.coords.latitude,
        longitude: state.location.coords.longitude,
      };
    }
    return null;
  }, [state.location]);

  return {
    ...state,
    requestLocationPermission,
    refreshLocation,
    getUserCoordinates,
    hasPermission: state.permissionStatus === 'granted',
    hasLocation: !!state.location,
  };
}
