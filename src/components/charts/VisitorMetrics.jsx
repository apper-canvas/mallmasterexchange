import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';

// Import icons
const UsersIcon = getIcon('users');
const ClockIcon = getIcon('clock');
const TrendingUpIcon = getIcon('trending-up');
const ShoppingBagIcon = getIcon('shopping-bag');

export default function VisitorMetrics({ data, isLoading, itemVariants }) {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={itemVariants ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } } : null}
      initial="hidden"
      animate="visible"
    >
      <MetricCard 
        title="Total Visitors"
        value={data?.totalVisitors?.toLocaleString() || '0'}
        icon={<UsersIcon size={24} />}
        color="bg-blue-500"
        isLoading={isLoading}
        variants={itemVariants}
        change={+4.2}
      />
      
      <MetricCard 
        title="Average Dwell Time"
        value={data?.averageDwellTime ? `${data.averageDwellTime} min` : '0 min'}
        icon={<ClockIcon size={24} />}
        color="bg-purple-500"
        isLoading={isLoading}
        variants={itemVariants}
        change={-1.3}
      />
      
      <MetricCard 
        title="Peak Hour Visitors"
        value={data?.peakHourVisitors?.toLocaleString() || '0'}
        icon={<TrendingUpIcon size={24} />}
        color="bg-amber-500"
        isLoading={isLoading}
        variants={itemVariants}
        change={+6.8}
      />
      
      <MetricCard 
        title="Conversion Rate"
        value={data?.conversionRate ? `${data.conversionRate.toFixed(1)}%` : '0%'}
        icon={<ShoppingBagIcon size={24} />}
        color="bg-green-500"
        isLoading={isLoading}
        variants={itemVariants}
        change={+2.5}
      />
    </motion.div>
  );
}

function MetricCard({ title, value, icon, color, isLoading, variants, change }) {
  return (
    <motion.div 
      className="card p-5 hover:shadow-md transition-shadow"
      variants={variants}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-surface-500 text-sm font-medium">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded animate-pulse mt-1" />
          ) : (
            <div>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'} mt-1 flex items-center`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% {change >= 0 ? 'increase' : 'decrease'}
              </p>
            </div>
          )}
        </div>
        <div className={`${color} text-white p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}