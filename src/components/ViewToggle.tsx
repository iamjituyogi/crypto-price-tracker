import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ViewToggleProps {
  currentView: 'list' | 'chart';
  onViewChange: (view: 'list' | 'chart') => void;
}

/**
 * Toggle component for switching between list and chart views
 * Provides visual feedback for the currently active view mode
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          currentView === 'list' && styles.activeButton
        ]}
        onPress={() => onViewChange('list')}
      >
        <Text style={[
          styles.toggleText,
          currentView === 'list' && styles.activeText
        ]}>
          📋 List
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.toggleButton,
          currentView === 'chart' && styles.activeButton
        ]}
        onPress={() => onViewChange('chart')}
      >
        <Text style={[
          styles.toggleText,
          currentView === 'chart' && styles.activeText
        ]}>
          📊 Chart
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#404040',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cccccc',
  },
  activeText: {
    color: '#ffffff',
  },
}); 