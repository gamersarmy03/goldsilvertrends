
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RateCard from '@/components/RateCard';
import PriceChart from '@/components/PriceChart';
import PredictionModule from '@/components/PredictionModule';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IndianRupee, ChevronUp } from 'lucide-react';
import { 
  goldRates, 
  silverRates, 
  getGoldHistoricalData,
  getSilverHistoricalData,
  getPredictionData,
  MetalRate
} from '@/utils/priceData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('gold');
  const [activeMetalId, setActiveMetalId] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'history' | 'prediction'>('history');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Format the current date and time
  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle view history/prediction button clicks
  const handleViewHistory = (id: string) => {
    setActiveMetalId(id);
    setChartView('history');
    
    // Scroll to chart section
    setTimeout(() => {
      const chartSection = document.getElementById('chart-section');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  const handleViewPrediction = (id: string) => {
    setActiveMetalId(id);
    setChartView('prediction');
    
    // Scroll to chart section
    setTimeout(() => {
      const chartSection = document.getElementById('prediction-section');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  // Get active metal details
  const getActiveMetal = (): MetalRate | null => {
    if (!activeMetalId) return null;
    return [...goldRates, ...silverRates].find(metal => metal.id === activeMetalId) || null;
  };
  
  const activeMetal = getActiveMetal();
  
  // Get chart data for the active metal
  const getChartData = () => {
    if (!activeMetal) return { historical: [], prediction: [], color: '#E5B654' };
    
    const isGold = activeMetal.name === 'Gold';
    const purity = activeMetal.purity;
    
    return {
      historical: isGold 
        ? getGoldHistoricalData(purity) 
        : getSilverHistoricalData(purity),
      prediction: getPredictionData(isGold ? 'gold' : 'silver', purity),
      color: isGold ? '#E5B654' : '#ADB5BD'
    };
  };
  
  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header lastUpdated={currentDateTime} />
      
      <main className="pt-20 pb-16">
        {/* Hero section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-100/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/90 -z-10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block mb-4">
                <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm backdrop-blur-sm">
                  <IndianRupee size={28} className="text-gold-700 dark:text-gold-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gold-800 to-gold-600 dark:from-gold-400 dark:to-gold-300">
                Lucknow Gold & Silver Rates
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Real-time precious metal rates for jewelers and traders in Lucknow, Uttar Pradesh
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse mb-2">
                Live rates updated as of {currentDateTime}
              </p>
            </div>
          </div>
        </section>
        
        {/* Rates section */}
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger value="gold">Gold Rates</TabsTrigger>
                  <TabsTrigger value="silver">Silver Rates</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="gold" className="mt-0 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goldRates.map((rate) => (
                    <RateCard 
                      key={rate.id}
                      metalRate={rate}
                      onViewHistory={handleViewHistory}
                      onViewPrediction={handleViewPrediction}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="silver" className="mt-0 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {silverRates.map((rate) => (
                    <RateCard 
                      key={rate.id}
                      metalRate={rate}
                      onViewHistory={handleViewHistory}
                      onViewPrediction={handleViewPrediction}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Chart section */}
        {activeMetal && (
          <section id="chart-section" className="mt-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <PriceChart 
                title={`${activeMetal.name} ${activeMetal.purity} Price History`}
                historicalData={chartData.historical}
                color={chartData.color}
              />
            </div>
          </section>
        )}
        
        {/* Prediction section */}
        {activeMetal && chartView === 'prediction' && (
          <section id="prediction-section" className="mt-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <PredictionModule 
                title={activeMetal.name}
                purity={activeMetal.purity}
                historicalData={chartData.historical}
                predictionData={chartData.prediction}
                color={chartData.color}
              />
            </div>
          </section>
        )}
        
        {/* Market info section */}
        <section className="mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass-card lg:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Lucknow Gold Market</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Lucknow's gold and silver market, centered in Chowk area, is known for its traditional jewelry craftsmanship and competitive rates. Prices typically follow the MCX (Multi Commodity Exchange) with slight local variations based on demand and supply factors.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Shop owners and traders rely on accurate, real-time pricing information to make informed decisions about buying, selling, and setting retail prices for their customers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Market Factors</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gold-100 dark:bg-gray-800 flex-shrink-0 mt-0.5"></span>
                      <span className="text-gray-600 dark:text-gray-300">MCX Gold and Silver futures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gold-200 dark:bg-gray-700 flex-shrink-0 mt-0.5"></span>
                      <span className="text-gray-600 dark:text-gray-300">International spot prices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gold-300 dark:bg-gray-600 flex-shrink-0 mt-0.5"></span>
                      <span className="text-gray-600 dark:text-gray-300">USD/INR exchange rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gold-400 dark:bg-gray-500 flex-shrink-0 mt-0.5"></span>
                      <span className="text-gray-600 dark:text-gray-300">Local demand and supply</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gold-500 dark:bg-gray-400 flex-shrink-0 mt-0.5"></span>
                      <span className="text-gray-600 dark:text-gray-300">Government policies and taxes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} GoldSilverTrends | Lucknow Market Data
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data sources: MCX, Local Bullion Markets
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 z-50 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Index;
