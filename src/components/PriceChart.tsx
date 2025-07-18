import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { PriceData } from '../services/WebSocketService';
import { APP_CONFIG } from '../config/appConfig';

interface PriceChartProps {
  data: PriceData[];
  symbol: string;
  visible: boolean;
}

interface ChartDataPoint {
  price: number;
  timestamp: number;
}

/**
 * Displays interactive line chart for cryptocurrency price history
 * Shows real-time price trends with visual indicators
 */
export const PriceChart: React.FC<PriceChartProps> = ({ data, symbol, visible }) => {
  if (!visible || data.length === 0) {
    return null;
  }

  const chartData: ChartDataPoint[] = data
    .filter(item => item.symbol === symbol)
    .map(item => ({
      price: parseFloat(item.price),
      timestamp: item.timestamp,
    }))
    .slice(-APP_CONFIG.CHART.MAX_DATA_POINTS);

  if (chartData.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Not enough data for {symbol} chart</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#2d2d2d',
    backgroundGradientFrom: '#2d2d2d',
    backgroundGradientTo: '#2d2d2d',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  const chartDataFormatted = {
    labels: chartData.map((_, index) => 
      index === 0 || index === chartData.length - 1 ? 
      new Date(chartData[index].timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : ''
    ),
    datasets: [
      {
        data: chartData.map(point => point.price),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[chartData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
          <Text style={[
            styles.priceChange,
            priceChange >= 0 ? styles.positiveChange : styles.negativeChange
          ]}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      
      <LineChart
        data={chartDataFormatted}
        width={Dimensions.get('window').width - 30}
        height={APP_CONFIG.CHART.CHART_HEIGHT}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={false}
        withHorizontalLabels={true}
        fromZero={false}
        yAxisSuffix=""
        yAxisInterval={1}
      />
      
      <Text style={styles.timeRange}>Last {APP_CONFIG.CHART.MAX_DATA_POINTS} updates</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveChange: {
    color: '#4CAF50',
  },
  negativeChange: {
    color: '#f44336',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  timeRange: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
  },
  noDataText: {
    color: '#888888',
    textAlign: 'center',
    fontSize: 14,
    padding: 20,
  },
}); 