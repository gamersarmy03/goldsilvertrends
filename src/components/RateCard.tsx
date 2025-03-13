
import { useState } from 'react';
import { TrendingDown, TrendingUp, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetalRate, formatPrice } from '@/utils/priceData';
import { Badge } from '@/components/ui/badge';

interface RateCardProps {
  metalRate: MetalRate;
  onViewHistory: (id: string) => void;
  onViewPrediction: (id: string) => void;
}

const RateCard = ({ metalRate, onViewHistory, onViewPrediction }: RateCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isGold = metalRate.name === "Gold";
  
  const getTrendIcon = () => {
    if (metalRate.change_24h > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (metalRate.change_24h < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTrendColor = () => {
    if (metalRate.change_24h > 0) return "text-green-500";
    if (metalRate.change_24h < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${expanded ? 'shadow-lg' : 'shadow-md'} glass-card hover:shadow-xl`}>
      <CardHeader className={`pb-2 ${isGold ? 'gold-gradient' : 'silver-gradient'} text-white`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/20 text-white border-none font-semibold">
              {metalRate.purity}
            </Badge>
            <CardTitle>{metalRate.name}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Per KG</p>
              <p className="text-2xl font-semibold">{formatPrice(metalRate.rate_per_kg)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Per 100g</p>
              <p className="text-2xl font-semibold">{formatPrice(metalRate.rate_per_100g)}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {getTrendIcon()}
              <span className={`font-medium ${getTrendColor()}`}>
                {metalRate.change_24h > 0 ? '+' : ''}{formatPrice(metalRate.change_24h)}
              </span>
            </div>
            <Badge variant={metalRate.change_percentage >= 0 ? "outline" : "destructive"} className={metalRate.change_percentage >= 0 ? "text-green-600 border-green-200 bg-green-50" : ""}>
              {metalRate.change_percentage > 0 ? '+' : ''}{metalRate.change_percentage.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardContent>
      
      {expanded && (
        <div className="animate-slide-up px-6 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onViewHistory(metalRate.id)}
            >
              History
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onViewPrediction(metalRate.id)}
            >
              Prediction
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RateCard;
