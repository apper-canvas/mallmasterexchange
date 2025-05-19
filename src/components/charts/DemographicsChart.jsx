import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getIcon } from '../../utils/iconUtils';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Import icons
const UserIcon = getIcon('user');

export default function DemographicsChart({ data, isLoading }) {
  const [activeTab, setActiveTab] = useState('age');
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (data && !isLoading) {
      prepareChartData();
    }
  }, [data, isLoading, activeTab]);
  
  const prepareChartData = () => {
    if (!data) return;
    
    if (activeTab === 'age') {
      const ageData = {
        labels: data.age.map(item => item.range),
        datasets: [{
          data: data.age.map(item => item.percentage),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }]
      };
      setChartData(ageData);
    } else if (activeTab === 'gender') {
      const genderData = {
        labels: data.gender.map(item => item.type),
        datasets: [{
          data: data.gender.map(item => item.percentage),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        }]
      };
      setChartData(genderData);
    } else if (activeTab === 'location') {
      const locationData = {
        labels: data.location.map(item => item.area),
        datasets: [{
          label: 'Visitors by Location',
          data: data.location.map(item => item.percentage),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      };
      setChartData(locationData);
    }
  };
  
  // Chart options
  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };
  
  const barOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <UserIcon size={18} />
            </div>
            <h3 className="font-semibold">Visitor Demographics</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              className={`px-3 py-1 text-xs rounded-full ${activeTab === 'age' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              onClick={() => setActiveTab('age')}
            >
              Age
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-full ${activeTab === 'gender' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              onClick={() => setActiveTab('gender')}
            >
              Gender
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-full ${activeTab === 'location' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative h-[400px] p-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : chartData ? (
          <div className="h-full flex items-center justify-center p-2">
            {activeTab === 'location' ? (
              <Bar data={chartData} options={barOptions} />
            ) : (
              <Pie data={chartData} options={pieOptions} />
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-surface-500">No demographic data available</p>
          </div>
        )}
      </div>
    </div>
  );
}