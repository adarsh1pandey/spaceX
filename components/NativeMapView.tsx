import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import type { Launchpad } from '../types/spacex';

interface NativeMapViewProps {
  launchpad: Launchpad;
  height?: number;
  showControls?: boolean;
}

export function NativeMapView({ launchpad, height = 250, showControls = true }: NativeMapViewProps) {
  const openInMaps = async () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${launchpad.latitude},${launchpad.longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${launchpad.latitude},${launchpad.longitude}`;
    
    Alert.alert(
      'Open in Maps',
      'Choose how to view this location:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Google Maps',
          onPress: () => Linking.openURL(googleMapsUrl),
        },
        {
          text: 'Apple Maps',
          onPress: () => Linking.openURL(appleMapsUrl),
        },
      ]
    );
  };

  const getDirections = async () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${launchpad.latitude},${launchpad.longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?daddr=${launchpad.latitude},${launchpad.longitude}&dirflg=d`;
    
    Alert.alert(
      'Get Directions',
      'Choose your preferred maps app:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Google Maps',
          onPress: () => Linking.openURL(googleMapsUrl),
        },
        {
          text: 'Apple Maps',
          onPress: () => Linking.openURL(appleMapsUrl),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE} // Apple Maps on iOS, Google Maps on Android (no API key needed)
        initialRegion={{
          latitude: launchpad.latitude,
          longitude: launchpad.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor="#0066CC"
        moveOnMarkerPress={false}
      >
        <Marker
          coordinate={{
            latitude: launchpad.latitude,
            longitude: launchpad.longitude,
          }}
          title={launchpad.name}
          description={`${launchpad.full_name}\n${launchpad.locality}, ${launchpad.region}\nStatus: ${launchpad.status}`}
          onPress={() => {
            Alert.alert(
              launchpad.name,
              `${launchpad.full_name}\n${launchpad.locality}, ${launchpad.region}\n\nStatus: ${launchpad.status}\nLaunches: ${launchpad.launch_successes}/${launchpad.launch_attempts} successful`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Get Directions',
                  onPress: getDirections,
                },
              ]
            );
          }}
        >
          <View style={styles.markerContainer}>
            <MaterialIcons 
              name="rocket-launch" 
              size={30} 
              color={launchpad.status === 'active' ? '#34C759' : '#8E8E93'} 
            />
          </View>
        </Marker>
      </MapView>
      
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={openInMaps}>
            <MaterialIcons name="open-in-new" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.info}>
        <ThemedText style={styles.infoText}>{launchpad.name}</ThemedText>
        <ThemedText style={styles.infoSubtext}>
          {launchpad.locality}, {launchpad.region}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: '#0066CC',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
});
