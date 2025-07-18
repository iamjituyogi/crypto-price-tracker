import { APP_CONFIG } from '../config/appConfig';
import { PriceHistoryService } from './PriceHistoryService';

export interface PriceData {
  symbol: string;
  price: string;
  timestamp: number;
  priceChange: 'increase' | 'decrease' | 'none';
}

export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onPriceUpdate?: (data: PriceData[]) => void;
}

/**
 * WebSocket service for managing real-time cryptocurrency price data
 * from Binance WebSocket API with automatic reconnection capabilities
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private callbacks: WebSocketCallbacks = {};
  private tradingPairs = APP_CONFIG.TRADING_PAIRS;
  private priceHistoryService = PriceHistoryService.getInstance();

  constructor(callbacks: WebSocketCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Establishes WebSocket connection to Binance API
   */
  connect(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(APP_CONFIG.WEBSOCKET.URL);

      this.ws.onopen = () => {
        console.log('WebSocket Connected to Binance');
        this.isConnecting = false;
        this.callbacks.onConnect?.();
      };

      this.ws.onmessage = (event: any) => {
        this.handleMessage(event);
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected from Binance');
        this.isConnecting = false;
        this.callbacks.onDisconnect?.();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.isConnecting = false;
        this.callbacks.onError?.(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      this.callbacks.onError?.(error);
    }
  }

  /**
   * Closes WebSocket connection and clears reconnection timer
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnecting = false;
  }

  /**
   * Processes incoming WebSocket messages and filters for relevant trading pairs
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        const filteredData = data
          .filter((item: any) => this.tradingPairs.includes(item.s.toLowerCase()))
          .map((item: any) => this.processPriceData(item));

        this.priceHistoryService.addPriceData(filteredData);
        this.callbacks.onPriceUpdate?.(filteredData);
      }
    } catch (error) {
      console.error('Error parsing WebSocket data:', error);
    }
  }

  /**
   * Converts raw API data to standardized PriceData format
   */
  private processPriceData(item: any): PriceData {
    const symbol = item.s;
    const price = parseFloat(item.c).toFixed(2);
    const timestamp = Date.now();

    const currentPrice = parseFloat(item.c);
    const previousPrice = parseFloat(item.P);
    let priceChange: 'increase' | 'decrease' | 'none' = 'none';

    if (currentPrice > previousPrice) {
      priceChange = 'increase';
    } else if (currentPrice < previousPrice) {
      priceChange = 'decrease';
    }

    return {
      symbol: symbol.toUpperCase(),
      price,
      timestamp,
      priceChange,
    };
  }

  /**
   * Schedules automatic reconnection attempt after connection loss
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect to Binance WebSocket...');
      this.reconnectTimeout = null;
      this.connect();
    }, APP_CONFIG.WEBSOCKET.RECONNECT_DELAY);
  }

  /**
   * Returns current connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Returns human-readable connection state
   */
  getConnectionState(): string {
    if (this.isConnecting) return 'Connecting...';
    if (this.isConnected()) return 'Connected';
    return 'Disconnected';
  }
} 