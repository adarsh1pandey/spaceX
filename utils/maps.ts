import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 100) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
}

/**
 * Open native maps app with directions to a specific location
 */
export async function openMapsWithDirections(
  destination: Coordinates,
  locationName?: string
): Promise<void> {
  const { latitude, longitude } = destination;
  const label = locationName ? encodeURIComponent(locationName) : 'Destination';
  
  let url: string;
  
  if (Platform.OS === 'ios') {
    // Use Apple Maps on iOS
    url = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d&t=m`;
    if (locationName) {
      url += `&q=${label}`;
    }
  } else {
    // Use Google Maps on Android
    url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    if (locationName) {
      url += `&destination_place_id=${label}`;
    }
  }
  
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    // Fallback to web maps
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    await Linking.openURL(webUrl);
  }
}

/**
 * Open maps app to show a location (without directions)
 */
export async function openMapsToLocation(
  location: Coordinates,
  locationName?: string
): Promise<void> {
  const { latitude, longitude } = location;
  const label = locationName ? encodeURIComponent(locationName) : 'Location';
  
  let url: string;
  
  if (Platform.OS === 'ios') {
    url = `http://maps.apple.com/?q=${label}&ll=${latitude},${longitude}`;
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    const webUrl = `https://www.google.com/maps/search/${latitude},${longitude}`;
    await Linking.openURL(webUrl);
  }
}
