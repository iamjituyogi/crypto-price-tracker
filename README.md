# Crypto Price Tracker

A React Native mobile app that connects to Binance WebSocket API to display real-time cryptocurrency price updates.

## Features

- **Real-time Price Updates**: Connects to Binance WebSocket API for live cryptocurrency prices
- **Multiple Trading Pairs**: Tracks BTC/USDT, ETH/USDT, BNB/USDT, ADA/USDT, and SOL/USDT
- **Visual Price Indicators**: Green text for price increases, red text for price decreases
- **Interactive Charts**: Beautiful line charts showing price history over time
- **Dual View Modes**: Switch between list view and chart view
- **Connection Management**: Manual connect/disconnect functionality with status indicators
- **Auto-reconnection**: Automatically attempts to reconnect if connection is lost
- **Modern UI**: Dark theme with card-based layout for better user experience
- **Timestamp Display**: Shows when each price update was received
- **Price History**: Stores and displays historical price data for trend analysis

## Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone or navigate to the project directory:
```bash
cd CryptoPriceTracker
```

2. Install dependencies:
```bash
npm install
```

3. For iOS (macOS only), install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

## Running the App

### Android
```bash
npx react-native run-android
```

### iOS (macOS only)
```bash
npx react-native run-ios
```

## How to Use

1. **Launch the App**: The app will automatically attempt to connect to the Binance WebSocket API
2. **View Prices**: Real-time cryptocurrency prices will be displayed in cards
3. **Switch Views**: Use the toggle button to switch between List view and Chart view
4. **Monitor Status**: Check the connection status indicator at the top
5. **Manual Control**: Use the Connect/Disconnect button to manually control the connection
6. **Price Changes**: Watch for green (increase) and red (decrease) price indicators
7. **Chart Analysis**: In chart view, see price trends over time with interactive line charts

## Technical Details

- **WebSocket Endpoint**: `wss://stream.binance.com:9443/ws/!ticker@arr`
- **Supported Pairs**: BTC/USDT, ETH/USDT, BNB/USDT, ADA/USDT, SOL/USDT
- **Update Frequency**: Real-time as provided by Binance API
- **Reconnection**: Automatic retry every 5 seconds on connection loss

## Project Structure

```
CryptoPriceTracker/
├── App.tsx              # Main application component
├── package.json         # Dependencies and scripts
├── ios/                 # iOS-specific files
├── android/             # Android-specific files
└── README.md           # This file
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check your internet connection
   - Ensure you're not behind a restrictive firewall
   - Try restarting the app

2. **iOS Build Issues**
   - Run `cd ios && pod install` to install CocoaPods dependencies
   - Clean build: `cd ios && xcodebuild clean`

3. **Android Build Issues**
   - Clean build: `cd android && ./gradlew clean`
   - Ensure Android SDK is properly configured

## Dependencies

- `react-native`: Core React Native framework
- `react-native-chart-kit`: Interactive charts and graphs
- `react-native-svg`: SVG support for charts
- `react-native-websocket`: WebSocket functionality (if needed for additional features)

## License

This project is for educational purposes. Please refer to Binance API terms of service for production use.

---

**Note**: This app uses the public Binance WebSocket API. For production applications, please review Binance's API terms of service and rate limits.
