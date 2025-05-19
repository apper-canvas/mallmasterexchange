import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const AlertTriangleIcon = getIcon('alert-triangle');
const HomeIcon = getIcon('home');

export default function NotFound() {
  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <motion.div 
          className="mb-6 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="p-6 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <AlertTriangleIcon size={64} className="text-amber-500" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          404 - Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-lg text-surface-600 dark:text-surface-300 max-w-lg mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link 
          to="/" 
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg inline-flex items-center gap-2 transition-colors"
        >
          <HomeIcon size={20} />
          Return to Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
}