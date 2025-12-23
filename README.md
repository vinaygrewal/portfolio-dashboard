# Portfolio Dashboard

A dynamic portfolio dashboard built with React.js, Node.js, and Express.js that displays real-time stock portfolio information with automatic updates.

## Features

- **Real-time Stock Data**: Fetches current market prices (CMP) from Yahoo Finance
- **Financial Metrics**: Retrieves P/E ratios and latest earnings from Google Finance
- **Dynamic Updates**: Automatically refreshes stock prices every 15 seconds
- **Sector Grouping**: Groups stocks by sector with sector-level summaries
- **Visual Indicators**: Color-coded gain/loss indicators (green for gains, red for losses)
- **Interactive UI**: Expandable/collapsible sector groups
- **Responsive Design**: Works across different screen sizes

## Technology Stack

- **Frontend**: React 18, JavaScript, Vite
- **Backend**: Node.js, Express.js
- **Styling**: Tailwind CSS
- **Data Fetching**: Axios
- **APIs**: Yahoo Finance (via yahoo-finance2), Google Finance (via web scraping)

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assignmentStock
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

Open a terminal and run:
```bash
npm run server
```

The backend server will start on `http://localhost:4010`

### Start the Frontend Development Server

Open another terminal and run:
```bash
npm run dev
```

The frontend will be available at `http://localhost:4000`
