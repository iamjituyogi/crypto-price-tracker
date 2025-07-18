import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { WebSocketService, PriceData } from './src/services/WebSocketService';
import { PriceCard } from './src/components/PriceCard';
import { PriceChart } from './src/components/PriceChart';
import { ViewToggle } from './src/components/ViewToggle';
import { PriceHistoryService } from './src/services/PriceHistoryService';
import { APP_CONFIG } from './src/config/appConfig';

/**
 * Main application component for Crypto Price Tracker
 * Manages WebSocket connection, data flow, and UI state
 */
const App = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [currentView, setCurrentView] = useState<'list' | 'chart'>('list');
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const priceHistoryService = PriceHistoryService.getInstance();

  useEffect(() => {
    wsServiceRef.current = new WebSocketService({
      onConnect: () => {
        setIsConnected(true);
        setConnectionStatus('Connected');
      },
      onDisconnect: () => {
        setIsConnected(false);
        setConnectionStatus('Disconnected');
      },
      onError: (error) => {
        console.error('WebSocket Error:', error);
        setConnectionStatus('Error');
        Alert.alert('Connection Error', 'Failed to connect to price feed');
      },
      onPriceUpdate: (data) => {
        setPriceData(data);
      },
    });

    wsServiceRef.current.connect();

    return () => {
      wsServiceRef.current?.disconnect();
    };
  }, []);

  const renderPriceItem = ({ item }: { item: PriceData }) => (
    <PriceCard data={item} />
  );

  const toggleConnection = () => {
    if (!wsServiceRef.current) return;

    if (isConnected) {
      wsServiceRef.current.disconnect();
    } else {
      wsServiceRef.current.connect();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{APP_CONFIG.APP_INFO.NAME}</Text>
        <Text style={styles.subtitle}>Hii, {APP_CONFIG.APP_INFO.AUTHOR}</Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }]} />
          <Text style={styles.statusText}>{connectionStatus}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: isConnected ? '#f44336' : '#4CAF50' }]}
          onPress={toggleConnection}
        >
          <Text style={styles.toggleButtonText}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      <ViewToggle currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'list' ? (
        <FlatList
          data={priceData}
          renderItem={renderPriceItem}
          keyExtractor={(item) => item.symbol}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isConnected ? 'Waiting for price updates...' : 'Connect to start receiving price updates'}
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {priceData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isConnected ? 'Waiting for price updates...' : 'Connect to start receiving price updates'}
              </Text>
            </View>
          ) : (
            priceData.map((item) => (
              <PriceChart
                key={item.symbol}
                data={priceHistoryService.getPriceHistory(item.symbol)}
                symbol={item.symbol}
                visible={true}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#2d2d2d',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
