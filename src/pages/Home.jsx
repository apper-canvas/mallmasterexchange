import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Import icons
const BuildingIcon = getIcon('building');
const AlertCircleIcon = getIcon('alert-circle');
const CalendarIcon = getIcon('calendar');
const TrendingUpIcon = getIcon('trending-up');

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTenants: 0,
    maintenanceRequests: 0,
    upcomingEvents: 0,
    occupancyRate: 0
  });

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalTenants: 35,
        maintenanceRequests: 12,
        upcomingEvents: 5,
        occupancyRate: 89
      });
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Refresh data handler
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update with "new" data (with slight variations)
      setStats({
        totalTenants: stats.totalTenants,
        maintenanceRequests: Math.floor(Math.random() * 5) + 10,
        upcomingEvents: Math.floor(Math.random() * 3) + 4,
        occupancyRate: Math.min(100, stats.occupancyRate + Math.floor(Math.random() * 5) - 2)
      });
      
      setIsLoading(false);
      toast.success("Dashboard data refreshed!");
    }, 1000);
  };

  // Animate cards as they appear
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
          <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Mall Dashboard</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Overview of mall operations and performance
          </p>
        </div>
        
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
              <span className="i-lucide-refresh-cw"></span>
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard 
          title="Total Tenants"
          value={stats.totalTenants}
          icon={<BuildingIcon size={24} />}
          color="bg-blue-500"
          isLoading={isLoading}
          variants={itemVariants}
        />
        
        <StatCard 
          title="Maintenance Requests"
          value={stats.maintenanceRequests}
          icon={<AlertCircleIcon size={24} />}
          color="bg-amber-500"
          isLoading={isLoading}
          variants={itemVariants}
        />
        
        <StatCard 
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={<CalendarIcon size={24} />}
          color="bg-purple-500"
          isLoading={isLoading}
          variants={itemVariants}
        />
        
        <StatCard 
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={<TrendingUpIcon size={24} />}
          color="bg-green-500"
          isLoading={isLoading}
          variants={itemVariants}
        />
      </motion.div>
      
      {/* Main Feature */}
      <MainFeature isLoading={isLoading} onRequestCreated={() => {
        setStats(prev => ({ 
          ...prev, 
          maintenanceRequests: prev.maintenanceRequests + 1 
        }));
      }} />
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, isLoading, variants }) {
  return (
    <motion.div 
      className="card p-5 hover:shadow-md transition-shadow"
      variants={variants}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-surface-500 text-sm font-medium">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-surface-200 dark:bg-surface-700 rounded animate-pulse mt-1" />
          ) : (
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          )}
        </div>
        <div className={`${color} text-white p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}