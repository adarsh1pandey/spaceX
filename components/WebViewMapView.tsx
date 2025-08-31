import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewMapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  width?: DimensionValue;
  height?: DimensionValue;
}

export default function WebViewMapView({
  latitude,
  longitude,
  title = 'Location',
  description,
  width = '100%',
  height = 300,
}: WebViewMapViewProps) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          height: 100vh; 
          overflow: hidden;
        }
        #mapContainer { 
          width: 100%; 
          height: 100vh; 
        }
        .marker {
          background-color: #ff4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          position: absolute;
          transform: translate(-50%, -100%);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        }
        .marker::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #ff4444;
        }
        .info-window {
          position: absolute;
          background: white;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          max-width: 200px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          transform: translate(-50%, -100%);
          margin-bottom: 35px;
          display: none;
        }
        .info-window::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        }
        .map-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
        }
        .control-btn {
          display: block;
          margin: 5px;
          padding: 10px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .control-btn:hover {
          background: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <div class="map-controls">
        <button class="control-btn" onclick="changeMapType('roadmap')">Road</button>
        <button class="control-btn" onclick="changeMapType('satellite')">Satellite</button>
        <button class="control-btn" onclick="changeMapType('hybrid')">Hybrid</button>
        <button class="control-btn" onclick="zoomIn()">+</button>
        <button class="control-btn" onclick="zoomOut()">-</button>
      </div>
      
      <iframe 
        id="mapContainer"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
      
      <script>
        let currentMapType = 'roadmap';
        let currentZoom = 15;
        
        function changeMapType(type) {
          currentMapType = type;
          updateMap();
        }
        
        function zoomIn() {
          currentZoom = Math.min(currentZoom + 1, 20);
          updateMap();
        }
        
        function zoomOut() {
          currentZoom = Math.max(currentZoom - 1, 1);
          updateMap();
        }
        
        function updateMap() {
          const iframe = document.getElementById('mapContainer');
          let baseUrl;
          
          if (currentMapType === 'satellite') {
            // Use satellite imagery from another provider
            baseUrl = \`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0zCsDAwJzAwLjAiTiA4McKwMDAnMDAuMCJX!5e1!3m2!1sen!2sus!4v1\`;
          } else if (currentMapType === 'hybrid') {
            baseUrl = \`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0zCsDAwJzAwLjAiTiA4McKwMDAnMDAuMCJX!5e3!3m2!1sen!2sus!4v1\`;
          } else {
            // Default to OpenStreetMap for road view
            const bbox = \`${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}\`;
            baseUrl = \`https://www.openstreetmap.org/export/embed.html?bbox=\${bbox}&layer=mapnik&marker=${latitude},${longitude}\`;
          }
          
          iframe.src = baseUrl;
        }
        
        // Add marker click handler
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Map loaded for: ${title}');
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        source={{ html: mapHtml }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
