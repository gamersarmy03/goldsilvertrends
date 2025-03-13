
// Mock data for gold and silver rates
export interface PriceData {
  date: string;
  value: number;
}

export interface MetalRate {
  id: string;
  name: string;
  purity: string;
  rate_per_kg: number;
  rate_per_100g: number;
  change_24h: number;
  change_percentage: number;
}

// Mock current rates
export const goldRates: MetalRate[] = [
  {
    id: "gold-24k",
    name: "Gold",
    purity: "24K",
    rate_per_kg: 6283500,
    rate_per_100g: 628350,
    change_24h: 1250,
    change_percentage: 0.2,
  },
  {
    id: "gold-22k",
    name: "Gold",
    purity: "22K",
    rate_per_kg: 5785000,
    rate_per_100g: 578500,
    change_24h: 1150,
    change_percentage: 0.2,
  },
  {
    id: "gold-18k",
    name: "Gold",
    purity: "18K",
    rate_per_kg: 4712600,
    rate_per_100g: 471260,
    change_24h: 950,
    change_percentage: 0.2,
  },
];

export const silverRates: MetalRate[] = [
  {
    id: "silver-999",
    name: "Silver",
    purity: "999",
    rate_per_kg: 75600,
    rate_per_100g: 7560,
    change_24h: -350,
    change_percentage: -0.46,
  },
  {
    id: "silver-925",
    name: "Silver",
    purity: "925",
    rate_per_kg: 70000,
    rate_per_100g: 7000,
    change_24h: -320,
    change_percentage: -0.46,
  },
];

// Helper to generate dates for the past X days
const generatePastDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Historical data for the past 90 days (3 months)
export const generateHistoricalData = (
  startPrice: number,
  volatility: number = 0.01,
  days: number = 90
): PriceData[] => {
  const dates = generatePastDates(days);
  const data: PriceData[] = [];
  let currentPrice = startPrice;
  
  dates.forEach((date) => {
    // Add some random fluctuation
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    
    data.push({
      date,
      value: Math.round(currentPrice),
    });
  });
  
  return data;
};

// Generate prediction data
export const generatePredictionData = (
  lastPrice: number,
  days: number = 60,
  trend: 'up' | 'down' | 'stable' = 'up',
  volatility: number = 0.005
): PriceData[] => {
  const startDate = new Date();
  const data: PriceData[] = [];
  let price = lastPrice;
  
  // Define trend factor
  const trendFactor = trend === 'up' ? 1.001 : (trend === 'down' ? 0.999 : 1);
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Apply trend and random volatility
    price = price * trendFactor + (price * (Math.random() * volatility * 2 - volatility));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(price),
    });
  }
  
  return data;
};

// Fetch gold historical data
export const getGoldHistoricalData = (purity: string = "24K"): PriceData[] => {
  const startPrice = purity === "24K" 
    ? 620000 
    : (purity === "22K" ? 570000 : 465000);
  
  return generateHistoricalData(startPrice);
};

// Fetch silver historical data
export const getSilverHistoricalData = (purity: string = "999"): PriceData[] => {
  const startPrice = purity === "999" ? 74000 : 68500;
  return generateHistoricalData(startPrice, 0.015); // Silver is more volatile
};

// Get prediction data
export const getPredictionData = (metal: 'gold' | 'silver', purity: string): PriceData[] => {
  let lastPrice = 0;
  
  if (metal === 'gold') {
    const historicalData = getGoldHistoricalData(purity);
    lastPrice = historicalData[historicalData.length - 1].value;
    return generatePredictionData(lastPrice, 60, 'up');
  } else {
    const historicalData = getSilverHistoricalData(purity);
    lastPrice = historicalData[historicalData.length - 1].value;
    return generatePredictionData(lastPrice, 60, 'stable', 0.01);
  }
};

// Format price in Indian Rupees
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
