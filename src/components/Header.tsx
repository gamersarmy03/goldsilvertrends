
import { useState, useEffect } from 'react';
import { Bell, Calendar, Download, IndianRupee, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  lastUpdated: string;
}

const Header = ({ lastUpdated }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-gold-600 dark:text-gold-400">
                  <IndianRupee size={24} className="text-gold-700" />
                </span>
                <h1 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gold-700 to-gold-500">
                  GoldSilverTrends
                </h1>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: <span className="font-medium">{lastUpdated}</span>
            </p>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lucknow Market Rates
            </p>
            <Button variant="outline" size="sm" className="ml-2 gap-1.5">
              <Calendar size={16} />
              <span>Historical</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bell size={16} />
              <span>Alerts</span>
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 py-3 border-b border-gray-100 dark:border-gray-800">
              Last Updated: <span className="font-medium">{lastUpdated}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 py-3 border-b border-gray-100 dark:border-gray-800">
              Lucknow Market Rates
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button variant="outline" size="sm" className="w-full justify-center">
                <Calendar size={16} />
                <span className="sr-only">Historical</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-center">
                <Download size={16} />
                <span className="sr-only">Export</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-center">
                <Bell size={16} />
                <span className="sr-only">Alerts</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
