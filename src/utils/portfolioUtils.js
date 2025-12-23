export function calculatePortfolioData(stocks) {
  // Calculate total investment and present value
  const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
  const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 
    ? (totalGainLoss / totalInvestment) * 100 
    : 0;

  // Group by sector
  const sectorMap = new Map();
  stocks.forEach(stock => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector).push(stock);
  });

  // Calculate sector summaries
  const sectors = Array.from(sectorMap.entries()).map(([sector, sectorStocks]) => {
    const sectorInvestment = sectorStocks.reduce((sum, stock) => sum + stock.investment, 0);
    const sectorPresentValue = sectorStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const sectorGainLoss = sectorPresentValue - sectorInvestment;
    const sectorGainLossPercent = sectorInvestment > 0 
      ? (sectorGainLoss / sectorInvestment) * 100 
      : 0;
    const sectorPortfolioPercent = totalInvestment > 0 
      ? (sectorInvestment / totalInvestment) * 100 
      : 0;

    return {
      sector,
      totalInvestment: sectorInvestment,
      totalPresentValue: sectorPresentValue,
      totalGainLoss: sectorGainLoss,
      totalGainLossPercent: sectorGainLossPercent,
      portfolioPercent: sectorPortfolioPercent,
      stocks: sectorStocks,
    };
  });

  // Update portfolio percentages for each stock
  const updatedStocks = stocks.map(stock => ({
    ...stock,
    portfolioPercent: totalInvestment > 0 
      ? (stock.investment / totalInvestment) * 100 
      : 0,
    gainLoss: stock.presentValue - stock.investment,
    gainLossPercent: stock.investment > 0 
      ? ((stock.presentValue - stock.investment) / stock.investment) * 100 
      : 0,
  }));

  return {
    stocks: updatedStocks,
    sectors,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercent,
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value, decimals = 2) {
  return value.toFixed(decimals);
}

export function formatPercent(value, decimals = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

