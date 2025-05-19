import { useEffect, useState } from 'react';
import { getIcon } from '../../utils/iconUtils';
import Chart from 'react-apexcharts';

// Import icons
const ClockIcon = getIcon('clock');

export default function DwellTimeChart({ data, isLoading }) {
  const [chartOptions, setChartOptions] = useState(null);
  const [chartSeries, setChartSeries] = useState(null);
  const [dwellStats, setDwellStats] = useState([]);
  
  useEffect(() => {
    if (data && !isLoading) {
      prepareChartData();
      prepareDwellStats();
    }
  }, [data, isLoading]);
  
  const prepareChartData = () => {
    if (!data) return;
    
    setChartSeries([{
      name: 'Average Dwell Time',
      data: data.values
    }]);
    
    setChartOptions({
      chart: {
        type: 'area',
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        foreColor: '#64748b',
      },
      colors: ['#3b82f6'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: data.areas,
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Time (minutes)'
        },
        labels: {
          formatter: function (val) {
            return Math.round(val) + ' min';
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' minutes';
          }
        }
      }
    });
  };
  
  const prepareDwellStats = () => {
    if (!data) return;
    
    // Find max, min and average
    const maxValue = Math.max(...data.values);
    const maxIndex = data.values.indexOf(maxValue);
    const maxArea = data.areas[maxIndex];
    
    const minValue = Math.min(...data.values);
    const minIndex = data.values.indexOf(minValue);
    const minArea = data.areas[minIndex];
    
    const avgValue = data.values.reduce((a, b) => a + b, 0) / data.values.length;
    
    setDwellStats([
      { label: 'Highest Dwell Time', value: `${maxValue} min`, area: maxArea, change: '+12%' },
      { label: 'Lowest Dwell Time', value: `${minValue} min`, area: minArea, change: '-5%' },
      { label: 'Average Dwell Time', value: `${avgValue.toFixed(1)} min`, area: 'All Areas', change: '+3%' }
    ]);
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <ClockIcon size={18} />
          </div>
          <h3 className="font-semibold">Dwell Time Analysis</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg animate-pulse">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-24 mb-2"></div>
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-16 mb-1"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-32"></div>
              </div>
            ))
          ) : (
            dwellStats.map((stat, index) => (
              <div key={index} className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-surface-600 dark:text-surface-300">{stat.area}</p>
                  <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chartOptions && chartSeries ? (
            <Chart 
              options={chartOptions} 
              series={chartSeries} 
              type="area" 
              height="100%" 
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-surface-500">No dwell time data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}