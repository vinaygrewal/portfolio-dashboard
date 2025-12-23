import React, { useState, useEffect } from 'react';
import { formatCurrency, formatNumber, formatPercent, calculatePortfolioData } from '../utils/portfolioUtils';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function PortfolioTable({ initialData }) {
  const [stocks, setStocks] = useState(initialData);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // set sectors acc to initial json
  const [expandedSectors, setExpandedSectors] = useState(() => {
    const sectors = new Set();
    initialData.forEach(stock => sectors.add(stock.sector));
    return sectors;
  });

  // Calculate portfolio data whenever stocks change 
  useEffect(() => {
    const calculated = calculatePortfolioData(stocks);
    setPortfolioData(calculated);
  }, [stocks]);

  // Fetch stock data from API
  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const symbols = stocks.map(stock => stock.nseBse);
      const response = await axios.post(`${API_BASE_URL}/api/stocks/batch`, {
        symbols,
      });

      const updatedStocks = stocks.map(stock => {
        const quote = response.data.find((q) => q.symbol === stock.nseBse);
        if (quote) {
          const newCmp = quote.price || stock.cmp;
          const newPresentValue = newCmp * stock.qty;
          
          return {
            ...stock,
            cmp: newCmp,
            presentValue: newPresentValue,
            peRatio: quote.peRatio || stock.peRatio,
            latestEarnings: quote.earningsDate || stock.latestEarnings,
            marketCap: quote.marketCap || stock.marketCap,
          };
        }
        return stock;
      });

      setStocks(updatedStocks);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Using cached values.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data
  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleSector = (sector) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  if (!portfolioData) {
    return <div className="p-4">Loading portfolio data...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Updating stock prices...
        </div>
      )}

      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">No</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Particulars</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Purchase Price</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Qty</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Investment</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Portfolio (%)</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">NSE/BSE</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">CMP</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Present Value</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Gain/Loss</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">Gain/Loss (%)</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase">P/E Ratio</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Latest Earnings</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.sectors.map((sectorSummary) => (
            <React.Fragment key={sectorSummary.sector}>
              <tr 
                className="bg-green-700 text-white font-semibold cursor-pointer hover:bg-green-800"
                onClick={() => toggleSector(sectorSummary.sector)}
              >
                <td colSpan={3} className="px-4 py-3">
                  {sectorSummary.sector}
                </td>
                <td className="px-4 py-3 text-right">
                  {expandedSectors.has(sectorSummary.sector) ? '▼' : '▶'}
                </td>
                <td className="px-4 py-3 text-right">{formatCurrency(sectorSummary.totalInvestment)}</td>
                <td className="px-4 py-3 text-right">{formatNumber(sectorSummary.portfolioPercent)}%</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right">{formatCurrency(sectorSummary.totalPresentValue)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${
                  sectorSummary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(sectorSummary.totalGainLoss)}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${
                  sectorSummary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercent(sectorSummary.totalGainLossPercent)}
                </td>
                <td colSpan={2} className="px-4 py-3"></td>
              </tr>
              
              {/* Individual Stock Rows */}
              {expandedSectors.has(sectorSummary.sector) && sectorSummary.stocks.map((stock) => (
                <tr key={stock.id} className="bg-green-50 hover:bg-green-100 border-b">
                  <td className="px-4 py-2">{stock.no}</td>
                  <td className="px-4 py-2 font-medium">{stock.particulars}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(stock.purchasePrice)}</td>
                  <td className="px-4 py-2 text-right">{stock.qty}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(stock.investment)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(stock.portfolioPercent)}%</td>
                  <td className="px-4 py-2">{stock.nseBse}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatCurrency(stock.cmp)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(stock.presentValue)}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${
                    stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stock.gainLoss)}
                  </td>
                  <td className={`px-4 py-2 text-right font-semibold ${
                    stock.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(stock.gainLossPercent)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.peRatio ? formatNumber(stock.peRatio) : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    {stock.latestEarnings || 'N/A'}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          
          {/* Total Row */}
          <tr className="bg-gray-900 text-white font-bold">
            <td colSpan={4} className="px-4 py-3">TOTAL</td>
            <td className="px-4 py-3 text-right">{formatCurrency(portfolioData.totalInvestment)}</td>
            <td className="px-4 py-3 text-right">100%</td>
            <td className="px-4 py-3"></td>
            <td className="px-4 py-3"></td>
            <td className="px-4 py-3 text-right">{formatCurrency(portfolioData.totalPresentValue)}</td>
            <td className={`px-4 py-3 text-right ${
              portfolioData.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(portfolioData.totalGainLoss)}
            </td>
            <td className={`px-4 py-3 text-right ${
              portfolioData.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercent(portfolioData.totalGainLossPercent)}
            </td>
            <td colSpan={2} className="px-4 py-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

