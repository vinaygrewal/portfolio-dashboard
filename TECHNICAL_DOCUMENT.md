# Technical Document: Portfolio Dashboard Implementation

## Overview

This document explains the key technical challenges faced during the implementation of the Portfolio Dashboard and the solutions adopted.

## Architecture

The application follows a client-server architecture:

- **Frontend**: React 18 with JavaScript, Vite, and Tailwind CSS
- **Backend**: Node.js with Express.js
- **Data Sources**: Yahoo Finance (for Current Market Price - CMP)
- **Note**: P/E Ratio and Latest Earnings are not available (displayed as N/A)

## Key Technical Challenges and Solutions

### 1. API Limitations and Unofficial APIs

**Challenge:**
- Yahoo Finance does not provide an official public API
- Need to use unofficial libraries
- APIs may break due to site structure changes

**Solution:**
- **Yahoo Finance**: Used `yahoo-finance2` npm package, which is a well-maintained unofficial library that provides a stable interface to Yahoo Finance data
- **P/E Ratio and Earnings**: Initially attempted Google Finance scraping, but it was unreliable and has been removed. These fields now display "N/A" in the UI
- Implemented error handling to gracefully handle API failures without crashing the application
- Cache mechanism prevents excessive API calls

**Code Location:**
- `server/index.js` - `fetchYahooFinancePrice()` function
- `server/index.js` - `fetchGoogleFinanceData()` returns null values

### 2. Rate Limiting and API Throttling

**Challenge:**
- Yahoo Finance API may have rate limits
- Fetching data for 26+ stocks simultaneously could trigger rate limits
- Need to prevent IP blocking

**Solution:**
- **Caching Mechanism**: Implemented an in-memory cache with 10-second TTL to reduce API calls
  - Cache stores stock prices for 10 seconds
  - If the same stock is requested within 10 seconds, cached data is returned
  - This is especially useful since frontend polls every 15 seconds
- **Batch Processing**: Created a batch API endpoint that processes requests in smaller groups (5 stocks at a time)
- **Delays Between Batches**: Added 500ms delay between batches to avoid overwhelming the servers
- **Parallel Processing**: Used `Promise.all()` for parallel requests within batches while maintaining rate limit compliance

**Code Location:**
- `server/index.js` - Cache implementation (`getCachedData()`, `setCachedData()`) and batch processing in `/api/stocks/batch` endpoint

### 3. Asynchronous Operations and Data Transformation

**Challenge:**
- Need to fetch stock prices from Yahoo Finance for multiple stocks
- Transform raw API data into the required table schema
- Handle multiple async operations efficiently

**Solution:**
- Used `Promise.all()` to fetch data in parallel for each stock
- Created utility functions in `src/utils/portfolioUtils.js` for data transformation and calculations
- Used async/await pattern throughout for better readability and error handling
- Batch endpoint processes all stocks in one request instead of individual calls

**Code Location:**
- `server/index.js` - Parallel fetching in stock data functions
- `src/utils/portfolioUtils.js` - Data transformation utilities

### 4. Real-Time Updates

**Challenge:**
- Update stock prices every 15 seconds
- Update Present Value and Gain/Loss based on new CMP
- Ensure UI updates smoothly without flickering

**Solution:**
- Used React's `useEffect` hook with `setInterval` to fetch data every 15 seconds
- Implemented proper cleanup in `useEffect` to prevent memory leaks (returns cleanup function)
- Used React state management to update only changed values
- Added loading indicators to show when data is being fetched
- Calculated derived values (Present Value, Gain/Loss) reactively based on updated CMP

**Code Location:**
- `src/components/PortfolioTable.jsx` - `useEffect` hook with interval and `fetchStockData()` function

### 5. Performance Optimization

**Challenge:**
- Re-rendering entire table on every update could be slow
- Need to optimize calculations for 26+ stocks
- Prevent unnecessary API calls

**Solution:**
- **Caching**: Backend caching reduces redundant API calls (10-second cache duration)
- **Efficient State Updates**: Only update changed stock data, not entire portfolio
- **Batch API Calls**: Single API call for all stocks instead of 26 individual calls
- **Conditional Rendering**: Only render expanded sectors to reduce DOM nodes
- React's reconciliation efficiently handles re-renders

**Code Location:**
- `src/components/PortfolioTable.jsx` - State management and conditional rendering
- `server/index.js` - Caching and batch processing

### 6. Error Handling

**Challenge:**
- API failures should not crash the application
- Users should be informed of errors
- Application should continue functioning with cached/previous data

**Solution:**
- Wrapped all API calls in try-catch blocks
- Display user-friendly error messages in the UI
- Fallback to previous/cached data when API calls fail
- Log errors to console for debugging
- Show loading states during data fetching
- Each stock fetch is wrapped in try-catch to prevent one failure from breaking the entire batch

**Code Location:**
- `src/components/PortfolioTable.jsx` - Error state and error display
- `server/index.js` - Try-catch blocks in all API functions

### 7. Data Structure and Calculations

**Challenge:**
- Complex calculations: Portfolio percentages, Gain/Loss, Sector summaries
- Need to maintain data consistency
- Handle edge cases (zero investment, negative values)

**Solution:**
- Created dedicated utility functions for all calculations
- Centralized calculation logic in `calculatePortfolioData()` function
- Added validation to prevent division by zero
- Separated calculation logic from UI components
- Used JavaScript objects and arrays for data structure consistency

**Code Location:**
- `src/utils/portfolioUtils.js` - Calculation functions
- `src/components/PortfolioTable.jsx` - Uses `calculatePortfolioData()` from utils

### 8. UI/UX Design

**Challenge:**
- Display large amounts of data in a readable format
- Show sector grouping with expand/collapse functionality
- Color-code gains/losses for quick visual feedback
- Responsive design for different screen sizes

**Solution:**
- Used Tailwind CSS for responsive, modern styling
- Implemented expandable/collapsible sectors using React state (Set data structure)
- Color-coded gain/loss values (green for positive, red for negative)
- Used proper table structure with semantic HTML
- Added hover effects and visual feedback
- Implemented proper number formatting (currency in INR, percentages)

**Code Location:**
- `src/components/PortfolioTable.jsx` - Table rendering and styling
- `src/utils/portfolioUtils.js` - Formatting functions (`formatCurrency`, `formatPercent`, `formatNumber`)

### 9. Code Organization

**Challenge:**
- Maintain clean, readable code structure
- Ensure consistency between frontend and backend
- Organize utilities and data files logically

**Solution:**
- Organized code into logical modules (components, utils, data, server)
- Used consistent naming conventions
- Separated concerns (data, calculations, UI)
- Used ES6 modules for clean imports/exports
- Frontend uses ES modules, backend uses CommonJS (for yahoo-finance2 compatibility)

**Code Location:**
- All `.js` and `.jsx` files follow consistent structure
- Modular organization with clear separation of concerns
- `src/` directory for frontend, `server/` directory for backend

### 10. Security Considerations

**Challenge:**
- Do not expose API keys in client-side code
- Prevent CORS issues
- Handle sensitive data properly

**Solution:**
- All API calls go through the backend server (not directly from frontend)
- Backend acts as a proxy, keeping API implementation details hidden
- Used CORS middleware properly configured in Express
- No sensitive data stored in frontend code
- Environment variables can be used for configuration (dotenv configured)

**Code Location:**
- `server/index.js` - Backend API proxy with CORS middleware
- `vite.config.js` - Vite proxy configuration for development

## API Endpoints

The application uses a single API endpoint:

### POST `/api/stocks/batch`
- **Purpose**: Fetch stock prices for multiple symbols in one request
- **Request Body**: `{ "symbols": ["HDFCBANK", "ICICIBANK", ...] }`
- **Response**: Array of stock objects with price, peRatio (null), earningsDate (null)
- **Features**: 
  - Batch processing (5 stocks at a time)
  - 500ms delay between batches
  - Caching (10-second TTL)
  - Error handling per stock

**Removed Endpoints:**
- `GET /api/stock/:symbol` - Removed (not used by frontend)
- `GET /api/health` - Removed (not needed)

## Cache Implementation

**Location**: Backend only (`server/index.js`)

**How it works:**
1. When `fetchYahooFinancePrice()` is called, it first checks cache using `getCachedData()`
2. If cached data exists and is less than 10 seconds old, it returns immediately (no API call)
3. If cache miss or expired, it fetches from Yahoo Finance
4. After fetching, it stores the result in cache using `setCachedData()` with timestamp
5. Next request within 10 seconds uses cached data

**Benefits:**
- Reduces API calls to Yahoo Finance
- Faster response times for cached data
- Helps prevent rate limiting
- Frontend polls every 15 seconds, cache prevents duplicate calls within 10 seconds

## Data Flow

1. **Initial Load**: Frontend loads initial portfolio data from `src/data/portfolioData.js`
2. **Data Fetching**: Frontend calls backend API `POST /api/stocks/batch` with all stock symbols
3. **Backend Processing**: 
   - Validates request (checks if symbols is an array)
   - For each symbol:
     - Checks cache first (`getCachedData()`)
     - If cache miss, fetches from Yahoo Finance (`fetchYahooFinancePrice()`)
     - Stores result in cache (`setCachedData()`)
     - Returns price and null values for P/E and earnings
   - Processes in batches of 5 with 500ms delays
   - Returns combined data array
4. **Frontend Update**: 
   - Updates stock CMP (Current Market Price)
   - Recalculates Present Value (CMP × Quantity)
   - Recalculates Gain/Loss and Gain/Loss Percentage
   - Updates UI with new values
   - P/E Ratio and Latest Earnings show "N/A"
5. **Repeat**: Process repeats every 15 seconds via `setInterval`

## Technology Stack Details

### Frontend
- **React 18**: UI library for building components
- **Vite**: Build tool and dev server (faster than Create React App)
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for API routes
- **yahoo-finance2**: Unofficial Yahoo Finance library
- **CORS**: Middleware for cross-origin requests
- **dotenv**: Environment variable management

### Removed Dependencies
- **cheerio**: Removed (was used for Google Finance scraping, not working)
- **axios** (backend): Removed (was only used for scraping)

## Future Improvements

1. **WebSocket Integration**: Replace polling with WebSockets for real-time updates
2. **Database Integration**: Store portfolio data in a database instead of static files
3. **User Authentication**: Add user login to manage multiple portfolios
4. **Historical Data**: Store and display historical performance charts
5. **Alerts**: Notify users when stocks hit certain thresholds
6. **Export Functionality**: Export portfolio data to Excel/PDF
7. **Advanced Filtering**: Filter and sort stocks by various criteria
8. **Charts and Visualizations**: Add charts using libraries like recharts
9. **P/E Ratio and Earnings**: Find alternative data source or API for these metrics

## Conclusion

The Portfolio Dashboard successfully addresses all the technical challenges mentioned in the requirements. The implementation uses modern web technologies (React.js with Vite), follows best practices, and provides a robust solution for portfolio tracking. The modular architecture makes it easy to extend and maintain. The application focuses on reliable stock price fetching from Yahoo Finance, with caching to optimize performance and prevent rate limiting. P/E Ratio and Earnings data are currently not available but the architecture allows for easy integration of alternative data sources in the future.
