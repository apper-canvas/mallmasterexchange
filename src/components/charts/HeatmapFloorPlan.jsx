import { useState, useEffect, useRef } from 'react';
import { getIcon } from '../../utils/iconUtils';

const ZoomInIcon = getIcon('zoom-in');
const ZoomOutIcon = getIcon('zoom-out');
const RefreshCwIcon = getIcon('refresh-cw');
const MapPinIcon = getIcon('map-pin');

export default function HeatmapFloorPlan({ data, isLoading }) {
  const mapContainerRef = useRef(null);
  const [activeFloor, setActiveFloor] = useState('1');
  const [zoomLevel, setZoomLevel] = useState(1);
  const heatmapInstance = useRef(null);
  
  // Initialize heatmap when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || !window.h337) return;
    
    // Create heatmap instance
    heatmapInstance.current = window.h337.create({
      container: mapContainerRef.current,
      radius: 15,
      maxOpacity: 0.6,
      minOpacity: 0,
      blur: 0.75,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    });
    
    // Load heatmap script if not already loaded
    if (!window.h337) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/heatmap.js@2.0.5/build/heatmap.min.js';
      script.async = true;
      script.onload = initializeHeatmap;
      document.body.appendChild(script);
    } else {
      initializeHeatmap();
    }
    
    return () => {
      if (heatmapInstance.current) {
        // Cleanup if needed
      }
    };
  }, []);
  
  // Update heatmap when data changes
  useEffect(() => {
    if (heatmapInstance.current && data && !isLoading) {
      const filteredData = data.filter(point => point.floor === activeFloor);
      const points = filteredData.map(point => ({
        x: point.x,
        y: point.y,
        value: point.intensity
      }));
      
      heatmapInstance.current.setData({
        max: 100,
        data: points
      });
    }
  }, [data, isLoading, activeFloor]);
  
  const initializeHeatmap = () => {
    if (!mapContainerRef.current || !data) return;
    
    // Initial setup with data
    const filteredData = data.filter(point => point.floor === activeFloor);
    const points = filteredData.map(point => ({
      x: point.x,
      y: point.y,
      value: point.intensity
    }));
    
    heatmapInstance.current.setData({
      max: 100,
      data: points
    });
  };
  
  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 0.2 : prev - 0.2;
      return Math.max(0.5, Math.min(2, newZoom));
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <MapPinIcon size={18} />
            </div>
            <h3 className="font-semibold">Visitor Traffic Heatmap</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700" onClick={() => handleZoom('out')}><ZoomOutIcon size={18} /></button>
            <button className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700" onClick={() => handleZoom('in')}><ZoomInIcon size={18} /></button>
          </div>
        </div>
      </div>
      
      <div className="relative bg-surface-50 dark:bg-surface-900 h-[400px] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Floor tabs */}
            <div className="absolute top-4 left-4 z-10 bg-white dark:bg-surface-800 rounded-lg shadow-md border border-surface-200 dark:border-surface-700 overflow-hidden flex">
              {['1', '2', '3'].map(floor => (
                <button 
                  key={floor}
                  className={`px-3 py-1.5 text-sm ${activeFloor === floor ? 'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  onClick={() => setActiveFloor(floor)}
                >
                  Floor {floor}
                </button>
              ))}
            </div>
            
            {/* Heatmap container */}
            <div 
              ref={mapContainerRef} 
              className="h-full w-full" 
              style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease' 
              }}
            >
              {/* Floor plan background */}
              <img 
                src={`/images/mall-floor-${activeFloor}.png`} 
                alt={`Mall Floor ${activeFloor} Plan`}
                className="absolute inset-0 w-full h-full object-contain opacity-20 dark:opacity-10"
                onError={(e) => {
                  // Fallback when image doesn't exist
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNTAwIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cmVjdCB4PSIxNTAiIHk9IjMwMCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSIyMDAiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHJlY3QgeD0iNDAwIiB5PSIxMDAiIHdpZHRoPSIyNTAiIGhlaWdodD0iMzUwIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjQwMCIgcj0iNzAiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+';
                }}
              />
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-surface-800 p-2 rounded-lg shadow-md border border-surface-200 dark:border-surface-700">
              <p className="text-xs font-medium mb-1">Visitor Density</p>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs ml-1">High</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}