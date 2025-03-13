
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import PriceChart from './PriceChart';
import { PriceData, formatPrice } from '@/utils/priceData';

interface PredictionModuleProps {
  title: string;
  purity: string;
  historicalData: PriceData[];
  predictionData: PriceData[];
  color: string;
}

const PredictionModule = ({
  title,
  purity,
  historicalData,
  predictionData,
  color
}: PredictionModuleProps) => {
  const [timeframe, setTimeframe] = useState('7d');
  
  // Calculate trend
  const startPrice = predictionData[0]?.value || 0;
  const endPrice = predictionData[predictionData.length - 1]?.value || 0;
  const trend = endPrice > startPrice ? 'up' : (endPrice < startPrice ? 'down' : 'stable');
  const trendPercentage = ((endPrice - startPrice) / startPrice) * 100;
  
  // Get prediction for selected timeframe
  const getPredictionForTimeframe = () => {
    let days = 7;
    switch (timeframe) {
      case '1d': days = 1; break;
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '60d': days = 60; break;
      default: days = 7;
    }
    
    if (predictionData.length === 0) return null;
    
    const targetDay = predictionData[Math.min(days - 1, predictionData.length - 1)];
    const changeAmount = targetDay.value - historicalData[historicalData.length - 1].value;
    const changePercentage = (changeAmount / historicalData[historicalData.length - 1].value) * 100;
    
    return {
      date: targetDay.date,
      price: targetDay.value,
      change: changeAmount,
      changePercentage
    };
  };
  
  const prediction = getPredictionForTimeframe();
  
  if (!prediction) return null;

  return (
    <Card className="w-full glass-card shadow-lg overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle>{title} {purity} Prediction</CardTitle>
              <Badge variant="outline" className="font-semibold">AI</Badge>
            </div>
            <CardDescription>
              Machine learning-based price forecast
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download size={16} />
            <span>Report</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <Tabs 
          value={timeframe} 
          onValueChange={setTimeframe}
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="1d">Next Day</TabsTrigger>
            <TabsTrigger value="7d">1 Week</TabsTrigger>
            <TabsTrigger value="30d">1 Month</TabsTrigger>
            <TabsTrigger value="60d">2 Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value={timeframe} className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PriceChart 
                  title={`${title} ${purity} Prediction`}
                  historicalData={historicalData}
                  predictionData={predictionData}
                  color={color}
                  range="Prediction"
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex flex-col justify-between shadow-inner">
                <div>
                  <h3 className="text-lg font-medium mb-4">Prediction Summary</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Predicted for {new Date(prediction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </p>
                      
                      <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold">{formatPrice(prediction.price)}</span>
                        <div className={`ml-2 flex items-center gap-1 ${prediction.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {prediction.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                          <span className="font-medium">
                            {prediction.change > 0 ? '+' : ''}{prediction.changePercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium mb-2">Overall Trend</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`${trend === 'up' ? 'bg-green-100 text-green-800' : trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {trend === 'up' ? 'Upward' : trend === 'down' ? 'Downward' : 'Stable'}
                        </Badge>
                        <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                          {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium mb-2">Market Confidence</p>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: '82%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Based on historical data pattern similarity
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6 w-full gap-1">
                  <span>Detailed Analysis</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionModule;
