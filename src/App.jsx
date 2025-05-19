import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Building2, Calendar, Tool, BarChart2, Home } from 'lucide-react';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-900 shadow-sm border-b border-surface-200 dark:border-surface-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold">MallMaster</h1>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar/Navigation */}
        <aside 
          className={`fixed lg:sticky top-[61px] h-[calc(100vh-61px)] z-30 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 flex flex-col h-full">
            <div className="flex-1 space-y-1">
              <NavLink to="/" icon={<Home size={20} />} label="Dashboard" />
              <NavLink to="/tenants" icon={<Building2 size={20} />} label="Tenants" />
              <NavLink to="/maintenance" icon={<Tool size={20} />} label="Maintenance" />
              <NavLink to="/events" icon={<Calendar size={20} />} label="Events" />
              <NavLink to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Metro Mall</p>
                  <p className="text-xs text-surface-500">35 Active Tenants</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto px-4 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
      />
    </div>
  );
}

// Helper component for navigation links
function NavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <a 
      href={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-white font-medium'
          : 'hover:bg-surface-100 dark:hover:bg-surface-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}