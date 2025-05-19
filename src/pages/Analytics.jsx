import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { 
  visitorMetrics, 
  demographicData, 
  heatmapData, 
  dwellTimeData 
} from '../utils/demoData';

// Import chart components
import VisitorMetrics from '../components/charts/VisitorMetrics';
import HeatmapFloorPlan from '../components/charts/HeatmapFloorPlan';
import DemographicsChart from '../components/charts/DemographicsChart';
import DwellTimeChart from '../components/charts/DwellTimeChart';

// Import icons
const BarChart2Icon = getIcon('bar-chart-2');
const RefreshCwIcon = getIcon('refresh-cw');
const UserIcon = getIcon('user');
const MapPinIcon = getIcon('map-pin');
const ClockIcon = getIcon('clock');
const DownloadIcon = getIcon('download');
const FilterIcon = getIcon('filter');

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [metrics, setMetrics] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [dwellTime, setDwellTime] = useState(null);
  
  // Load data based on time filter
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Wait for simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Apply time filter to simulation
      let timeAdjustedData;
      
      switch(timeFilter) {
        case 'yesterday':
          timeAdjustedData = adjustDataForTimeRange(0.9);
          break;
        case 'week':
          timeAdjustedData = adjustDataForTimeRange(5.2);
          break;
        case 'month':
          timeAdjustedData = adjustDataForTimeRange(22.7);
          break;
        default: // today
          timeAdjustedData = {
            metrics: visitorMetrics,
            demographics: demographicData,
            heatmap: heatmapData,
            dwellTime: dwellTimeData
          };
      }
      
      setMetrics(timeAdjustedData.metrics);
      setDemographics(timeAdjustedData.demographics);
      setHeatmap(timeAdjustedData.heatmap);
      setDwellTime(timeAdjustedData.dwellTime);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [timeFilter]);
  
  // Helper to adjust data based on time range factor
  const adjustDataForTimeRange = (factor) => {
    // Adjust visitor counts
    const adjustedMetrics = {
      totalVisitors: Math.round(visitorMetrics.totalVisitors * factor),
      averageDwellTime: Math.round(visitorMetrics.averageDwellTime * (0.9 + Math.random() * 0.2)),
      peakHourVisitors: Math.round(visitorMetrics.peakHourVisitors * factor * (0.8 + Math.random() * 0.4)),
      conversionRate: visitorMetrics.conversionRate * (0.95 + Math.random() * 0.1)
    };
    
    // Adjust demographic percentages slightly
    const adjustedDemographics = {
      ...demographicData,
      age: demographicData.age.map(item => ({
        ...item,
        percentage: item.percentage * (0.9 + Math.random() * 0.2)
      })),
      gender: demographicData.gender.map(item => ({
        ...item,
        percentage: item.percentage * (0.95 + Math.random() * 0.1)
      }))
    };
    
    // Normalize percentages to 100%
    const ageTotal = adjustedDemographics.age.reduce((sum, item) => sum + item.percentage, 0);
    const genderTotal = adjustedDemographics.gender.reduce((sum, item) => sum + item.percentage, 0);
    
    adjustedDemographics.age = adjustedDemographics.age.map(item => ({
      ...item,
      percentage: (item.percentage / ageTotal) * 100
    }));
    
    adjustedDemographics.gender = adjustedDemographics.gender.map(item => ({
      ...item,
      percentage: (item.percentage / genderTotal) * 100
    }));
    
    // Adjust heatmap intensity
    const adjustedHeatmap = heatmapData.map(point => ({
      ...point,
      intensity: point.intensity * (0.8 + Math.random() * 0.4)
    }));
    
    // Adjust dwell time data
    const adjustedDwellTime = {
      ...dwellTimeData,
      values: dwellTimeData.values.map(value => value * (0.9 + Math.random() * 0.2))
    };
    
    return {
      metrics: adjustedMetrics,
      demographics: adjustedDemographics,
      heatmap: adjustedHeatmap,
      dwellTime: adjustedDwellTime
    };
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate data reload with slight variations
      setMetrics({
        ...metrics,
        totalVisitors: Math.round(metrics.totalVisitors * (0.98 + Math.random() * 0.04)),
        averageDwellTime: Math.round(metrics.averageDwellTime * (0.97 + Math.random() * 0.06)),
        peakHourVisitors: Math.round(metrics.peakHourVisitors * (0.95 + Math.random() * 0.1))
      });
      
      setIsLoading(false);
      toast.success("Analytics data refreshed!");
    }, 1000);
  };
  
  // Handle export
  const handleExport = () => {
    toast.info("Exporting analytics data as CSV...");
    
    // Simulate export delay
    setTimeout(() => {
      toast.success("Analytics data exported successfully!");
    }, 1500);
  };
  
  // Format date range for display
  const getDateRangeText = () => {
    const today = new Date();
    
    switch(timeFilter) {
      case 'yesterday':
        return format(subDays(today, 1), 'MMMM d, yyyy');
      case 'week':
        return `${format(startOfWeek(today), 'MMMM d')} - ${format(today, 'MMMM d, yyyy')}`;
      case 'month':
        return `${format(startOfMonth(today), 'MMMM d')} - ${format(today, 'MMMM d, yyyy')}`;
      default:
        return format(today, 'MMMM d, yyyy');
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Visitor Analytics</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {getDateRangeText()} • Real-time visitor insights
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-surface-300 dark:border-surface-600 overflow-hidden">
            <button 
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 text-sm ${timeFilter === 'today' ? 'bg-primary text-white' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setTimeFilter('yesterday')}
              className={`px-3 py-1.5 text-sm ${timeFilter === 'yesterday' ? 'bg-primary text-white' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Yesterday
            </button>
            <button 
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 text-sm ${timeFilter === 'week' ? 'bg-primary text-white' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 text-sm ${timeFilter === 'month' ? 'bg-primary text-white' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Month
            </button>
          </div>
          
          <button 
            onClick={handleExport}
            className="btn btn-outline flex items-center gap-2"
          >
            <DownloadIcon size={18} />
            <span>Export</span>
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="btn btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCwIcon size={18} />
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <VisitorMetrics data={metrics} isLoading={isLoading} itemVariants={itemVariants} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Traffic Heatmap */}
        <HeatmapFloorPlan data={heatmap} isLoading={isLoading} />
        
        {/* Visitor Demographics */}
        <DemographicsChart data={demographics} isLoading={isLoading} />
      </div>
      
      {/* Visit Duration Analysis */}
      <DwellTimeChart data={dwellTime} isLoading={isLoading} />
    </div>
  );
}