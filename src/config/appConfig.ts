/**
 * Application configuration constants
 * Centralizes all app settings for easy maintenance and customization
 */
export const APP_CONFIG = {
  WEBSOCKET: {
    URL: 'wss://stream.binance.com:9443/ws/!ticker@arr',
    RECONNECT_DELAY: 5000,
    MAX_RECONNECT_ATTEMPTS: 10,
  },
  
  TRADING_PAIRS: [
    'btcusdt',
    'ethusdt', 
    'bnbusdt',
    'adausdt',
    'solusdt',
  ],
  
  UI: {
    REFRESH_RATE: 1000,
    PRICE_DECIMAL_PLACES: 2,
    TIMESTAMP_FORMAT: 'en-US',
  },
  
  CHART: {
    MAX_DATA_POINTS: 20,
    HISTORY_SIZE: 100,
    CHART_HEIGHT: 220,
    UPDATE_INTERVAL: 1000,
  },
  
  APP_INFO: {
    NAME: 'Crypto Price Tracker',
    VERSION: '1.0.0',
    AUTHOR: 'Jitendra Yogi',
  },
} as const;

export type TradingPair = typeof APP_CONFIG.TRADING_PAIRS[number]; 