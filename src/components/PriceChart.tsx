
import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceData, formatPrice } from '@/utils/priceData';

interface PriceChartProps {
  title: string;
  historicalData: PriceData[];
  predictionData?: PriceData[];
  color: string;
  range?: '1M' | '3M' | 'All' | 'Prediction';
}

const PriceChart = ({ 
  title, 
  historicalData,
  predictionData = [],
  color,
  range = 'All'
}: PriceChartProps) => {
  const [activeTab, setActiveTab] = useState<string>(range);
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [isPrediction, setIsPrediction] = useState(range === 'Prediction');
  
  useEffect(() => {
    if (activeTab === 'Prediction' && predictionData.length > 0) {
      // Show last 30 days of historical + prediction data
      const last30Days = historicalData.slice(-30);
      setChartData([...last30Days, ...predictionData]);
      setIsPrediction(true);
    } else {
      let filteredData = [...historicalData];
      
      if (activeTab === '1M') {
        filteredData = historicalData.slice(-30); // Last 30 days
      } else if (activeTab === '3M') {
        filteredData = historicalData.slice(-90); // Last 90 days
      }
      
      setChartData(filteredData);
      setIsPrediction(false);
    }
  }, [activeTab, historicalData, predictionData]);

  // Calculate current price and change
  const latestPrice = historicalData[historicalData.length - 1]?.value || 0;
  const previousPrice = historicalData[historicalData.length - 2]?.value || 0;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  // Find min and max values for better chart scaling
  const dataValues = chartData.map(item => item.value);
  const minValue = Math.min(...dataValues) * 0.995;
  const maxValue = Math.max(...dataValues) * 1.005;

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isPredicted = historicalData.findIndex(d => d.date === dataPoint.date) === -1;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-md font-semibold">{formatPrice(dataPoint.value)}</p>
          {isPredicted && (
            <p className="text-xs mt-1 text-blue-500 dark:text-blue-300">
              Predicted value
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format x-axis tick values
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <Card className="w-full overflow-hidden glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">{formatPrice(latestPrice)}</p>
            <p className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(0)} 
              ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-4 w-full max-w-xs">
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Prediction" disabled={predictionData.length === 0}>Predict</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <div className="chart-container p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 12 }}
                    tickCount={7}
                  />
                  <YAxis 
                    domain={[minValue, maxValue]}
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {isPrediction && (
                    <ReferenceLine
                      x={historicalData[historicalData.length - 1]?.date}
                      stroke="#888"
                      strokeDasharray="3 3"
                      label={{ value: 'Prediction Start', position: 'insideTopRight', fill: '#888', fontSize: 12 }}
                    />
                  )}
                  
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 1, stroke: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
