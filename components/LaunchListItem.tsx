import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import type { Launch } from '../types/spacex';

interface LaunchListItemProps {
  launch: Launch;
  onPress: (launch: Launch) => void;
}

export const LaunchListItem = memo<LaunchListItemProps>(({ launch, onPress }) => {
  const handlePress = () => onPress(launch);

  const getStatusColor = () => {
    if (launch.upcoming) return '#FF9500';
    if (launch.success === true) return '#34C759';
    if (launch.success === false) return '#FF3B30';
    return '#8E8E93';
  };

  const getStatusText = () => {
    if (launch.upcoming) return 'Upcoming';
    if (launch.success === true) return 'Success';
    if (launch.success === false) return 'Failed';
    return 'Unknown';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Date TBD';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        {launch.links.patch.small ? (
          <Image
            source={{ uri: launch.links.patch.small }}
            style={styles.patchImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="rocket-launch" size={24} color="#8E8E93" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.missionName} numberOfLines={1}>
            {launch.name}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={16} color="#8E8E93" />
            <ThemedText style={styles.detailText}>
              {formatDate(launch.date_utc)}
            </ThemedText>
            {!launch.upcoming && (
              <ThemedText style={styles.timeText}>
                {formatTime(launch.date_utc)}
              </ThemedText>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="flight" size={16} color="#8E8E93" />
            <ThemedText style={styles.detailText}>
              Flight #{launch.flight_number}
            </ThemedText>
          </View>
        </View>
        
        {launch.details && (
          <ThemedText style={styles.description} numberOfLines={2}>
            {launch.details}
          </ThemedText>
        )}
      </View>
      
      <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  );
});

LaunchListItem.displayName = 'LaunchListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 12,
  },
  patchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  missionName: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
});
