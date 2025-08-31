import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #map { height: 100vh; width: 100%; }
        .custom-marker {
          background: #0066CC;
          border: 3px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .popup-content {
          text-align: center;
          min-width: 200px;
        }
        .directions-btn {
          background: #0066CC;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        // Initialize map centered on launchpad
        const map = L.map('map').setView([${launchpad.latitude}, ${launchpad.longitude}], 13);
        
        // Add tile layer (OpenStreetMap - no API key required)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Create custom rocket icon
        const rocketIcon = L.divIcon({
          className: 'custom-marker',
          html: '🚀',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        // Add marker for the launchpad
        const marker = L.marker([${launchpad.latitude}, ${launchpad.longitude}], {
          icon: rocketIcon
        }).addTo(map);

        // Create popup content
        const popupContent = \`
          <div class="popup-content">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${launchpad.name}</h3>
            <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>${launchpad.full_name}</strong></p>
            <p style="margin: 4px 0; color: #666; font-size: 13px;">📍 ${launchpad.locality}, ${launchpad.region}</p>
            <p style="margin: 4px 0; font-size: 13px;">
              <span style="color: ${launchpad.status === 'active' ? '#34C759' : '#8E8E93'}; font-weight: bold;">
                ● ${launchpad.status.toUpperCase()}
              </span>
            </p>
            ${launchpad.launch_attempts > 0 ? `
              <p style="margin: 4px 0; color: #666; font-size: 12px;">
                🚀 ${launchpad.launch_successes}/${launchpad.launch_attempts} successful launches
              </p>
            ` : ''}
            <button 
              onclick="getDirections()"
              class="directions-btn"
            >
              📍 Get Directions
            </button>
          </div>
        \`;

        marker.bindPopup(popupContent).openPopup();

        // Function to communicate with React Native
        function getDirections() {
          const message = {
            type: 'getDirections',
            latitude: ${launchpad.latitude},
            longitude: ${launchpad.longitude},
            name: '${launchpad.name}'
          };
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
          }
        }
      </script>
    </body>
    </html>
  `;

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
        provider={PROVIDER_DEFAULT}
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
        <ThemedText style={styles.infoText}>
          📍 {launchpad.name}
        </ThemedText>
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
  webview: {
    flex: 1,
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
