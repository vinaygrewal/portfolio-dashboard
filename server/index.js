require('dotenv').config();
const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = process.env.PORT || 4010;

// CORS configuration - allow requests from frontend
// In production, set FRONTEND_URL environment variable to your Vercel domain
const allowedOrigins = [
  'http://localhost:4000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Cache flow for stock data to reduce API calls
const stockCache = new Map();
const CACHE_DURATION = 10000; 

function getCachedData(key) {
  const cached = stockCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  stockCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// to Fetch stock price from Yahoo Finance library
async function fetchYahooFinancePrice(symbol) {
  try {
    const cached = getCachedData(`yahoo_${symbol}`);
    if (cached) return cached;

    const searchSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
    
    const quote = await yahooFinance.quote(searchSymbol);
    const price = quote.regularMarketPrice || quote.price || null;
    
    if (price) {
      setCachedData(`yahoo_${symbol}`, price);
      return price;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error.message);
    return null;
  }
}

async function fetchGoogleFinanceData(symbol) {

  return {
    peRatio: null,
    earningsDate: null,
    marketCap: null,
  };
}

app.post('/api/stocks/batch', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols must be an array' });
    }

    // Fetch all stocks in parallel with rate limiting
    const promises = symbols.map(async (symbol) => {
      try {
        const [price, googleData] = await Promise.all([
          fetchYahooFinancePrice(symbol),
          fetchGoogleFinanceData(symbol),
        ]);

        return {
          symbol,
          price: price || 0,
          peRatio: googleData?.peRatio || null,
          earningsDate: googleData?.earningsDate || null,
          marketCap: googleData?.marketCap || null,
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return {
          symbol,
          price: 0,
          peRatio: null,
          earningsDate: null,
          marketCap: null,
        };
      }
    });

    // Add small delay between batches to avoid rate limiting
    const batchSize = 5;
    const results = [];
    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < promises.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Error in /api/stocks/batch:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

