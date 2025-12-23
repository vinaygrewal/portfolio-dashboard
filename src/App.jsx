import React from 'react';
import { initialPortfolioData } from './data/portfolioData';
import PortfolioTable from './components/PortfolioTable';
import './App.css';

function App() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time stock portfolio tracking with automatic updates every 15 seconds
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PortfolioTable initialData={initialPortfolioData} />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> Stock prices are fetched from Yahoo Finance and Google Finance APIs. 
            Data updates automatically every 15 seconds.
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;

