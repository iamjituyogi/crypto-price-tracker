import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceData } from '../services/WebSocketService';

interface PriceCardProps {
  data: PriceData;
}

/**
 * Displays individual cryptocurrency price information in card format
 * Shows symbol, price, timestamp, and price change indicators
 */
export const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  return (
    <View style={styles.priceCard}>
      <View style={styles.symbolContainer}>
        <Text style={styles.symbol}>{data.symbol}</Text>
        <Text style={styles.timestamp}>
          {new Date(data.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <Text
        style={[
          styles.price,
          data.priceChange === 'increase' && styles.priceIncrease,
          data.priceChange === 'decrease' && styles.priceDecrease,
        ]}
      >
        ${data.price}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  priceCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888888',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceIncrease: {
    color: '#4CAF50',
  },
  priceDecrease: {
    color: '#f44336',
  },
}); 