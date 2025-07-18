import { PriceData } from './WebSocketService';
import { APP_CONFIG } from '../config/appConfig';

/**
 * Singleton service for managing historical price data
 * Provides data storage and retrieval for chart visualization
 */
export class PriceHistoryService {
  private static instance: PriceHistoryService;
  private priceHistory: Map<string, PriceData[]> = new Map();
  private maxHistorySize = APP_CONFIG.CHART.HISTORY_SIZE;

  private constructor() {}

  /**
   * Returns singleton instance of PriceHistoryService
   */
  static getInstance(): PriceHistoryService {
    if (!PriceHistoryService.instance) {
      PriceHistoryService.instance = new PriceHistoryService();
    }
    return PriceHistoryService.instance;
  }

  /**
   * Adds new price data to historical storage
   */
  addPriceData(data: PriceData[]): void {
    data.forEach(item => {
      const symbol = item.symbol;
      if (!this.priceHistory.has(symbol)) {
        this.priceHistory.set(symbol, []);
      }

      const history = this.priceHistory.get(symbol)!;
      history.push(item);

      if (history.length > this.maxHistorySize) {
        history.splice(0, history.length - this.maxHistorySize);
      }
    });
  }

  /**
   * Retrieves price history for a specific trading symbol
   */
  getPriceHistory(symbol: string): PriceData[] {
    return this.priceHistory.get(symbol) || [];
  }

  /**
   * Returns all stored price history data
   */
  getAllPriceHistory(): Map<string, PriceData[]> {
    return new Map(this.priceHistory);
  }

  /**
   * Clears historical data for specific symbol or all data
   */
  clearHistory(symbol?: string): void {
    if (symbol) {
      this.priceHistory.delete(symbol);
    } else {
      this.priceHistory.clear();
    }
  }

  /**
   * Returns the most recent price data for a symbol
   */
  getLatestPrice(symbol: string): PriceData | null {
    const history = this.priceHistory.get(symbol);
    return history && history.length > 0 ? history[history.length - 1] : null;
  }

  /**
   * Calculates price change and percentage change for a symbol
   */
  getPriceChange(symbol: string): { change: number; percentChange: number } | null {
    const history = this.priceHistory.get(symbol);
    if (!history || history.length < 2) {
      return null;
    }

    const current = parseFloat(history[history.length - 1].price);
    const previous = parseFloat(history[history.length - 2].price);
    const change = current - previous;
    const percentChange = previous > 0 ? (change / previous) * 100 : 0;

    return { change, percentChange };
  }
} 