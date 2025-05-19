import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

// Import icons as React components
const ToolIcon = getIcon('tool');
const PlusIcon = getIcon('plus');
const ClipboardCheckIcon = getIcon('clipboard-check');
const ClockIcon = getIcon('clock');
const AlertTriangleIcon = getIcon('alert-triangle');
const CheckCircleIcon = getIcon('check-circle');
const XIcon = getIcon('x');
const FilterIcon = getIcon('filter');
const SearchIcon = getIcon('search');
const ChevronDownIcon = getIcon('chevron-down');

export default function MainFeature({ isLoading, onRequestCreated }) {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    priority: 'medium'
  });
  const [formErrors, setFormErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate fetching data
  useEffect(() => {
    const fetchRequests = async () => {
      // Simulate API fetch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockRequests = [
        {
          id: '1',
          category: 'Plumbing',
          description: 'Water leak in food court restroom',
          location: 'Food Court, Ground Floor',
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
        },
        {
          id: '2',
          category: 'Electrical',
          description: 'Flickering lights in corridor near Store #124',
          location: 'West Wing, First Floor',
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
          id: '3',
          category: 'HVAC',
          description: 'AC not working properly in the main atrium',
          location: 'Main Atrium, Ground Floor',
          priority: 'high',
          status: 'assigned',
          createdAt: new Date(Date.now() - 43200000) // 12 hours ago
        },
        {
          id: '4',
          category: 'General',
          description: 'Broken tile near entrance',
          location: 'Main Entrance, Ground Floor',
          priority: 'low',
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          resolvedAt: new Date(Date.now() - 86400000) // 1 day ago
        }
      ];
      
      setMaintenanceRequests(mockRequests);
    };
    
    fetchRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being filled
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    // Create new request
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date()
    };
    
    // Add to list
    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
    
    // Reset form
    setFormData({
      category: '',
      description: '',
      location: '',
      priority: 'medium'
    });
    
    // Close form
    setIsFormOpen(false);
    
    // Notify parent component
    if (onRequestCreated) {
      onRequestCreated();
    }
    
    // Show success toast
    toast.success('Maintenance request created successfully!');
  };

  // Handle request status update
  const updateRequestStatus = (id, newStatus) => {
    const updatedRequests = maintenanceRequests.map(request => {
      if (request.id === id) {
        const updatedRequest = { 
          ...request, 
          status: newStatus 
        };
        
        if (newStatus === 'completed') {
          updatedRequest.resolvedAt = new Date();
        }
        
        return updatedRequest;
      }
      return request;
    });
    
    setMaintenanceRequests(updatedRequests);
    toast.success(`Request status updated to ${newStatus}`);
  };

  // Filter requests based on selection and search term
  const getFilteredRequests = () => {
    return maintenanceRequests.filter(request => {
      // Apply status filter
      if (filter !== 'all' && request.status !== filter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          request.description.toLowerCase().includes(search) ||
          request.location.toLowerCase().includes(search) ||
          request.category.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  };

  // Animation variants
  const listVariants = {
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

  const filteredRequests = getFilteredRequests();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <ToolIcon size={24} />
          </div>
          <h2 className="text-xl font-bold">Maintenance Requests</h2>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
          disabled={isLoading || isFormOpen}
        >
          <PlusIcon size={20} />
          <span>New Request</span>
        </button>
      </div>
      
      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-surface-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search requests..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <FilterIcon size={18} className="text-surface-500" />
            <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Filter:</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input py-2 pl-3 pr-8 appearance-none"
            style={{ maxWidth: '160px' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Maintenance Requests List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-4/5"></div>
              <div className="flex justify-between mt-4">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-24"></div>
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredRequests.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800">
                  <ClipboardCheckIcon size={40} className="text-surface-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">No maintenance requests found</h3>
              <p className="text-surface-500 dark:text-surface-400 mb-6">
                {searchTerm || filter !== 'all' 
                  ? "Try adjusting your filters or search terms" 
                  : "Create a new maintenance request to get started"}
              </p>
              {(searchTerm || filter !== 'all') && (
                <div className="flex justify-center gap-4">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="btn btn-outline"
                    >
                      Clear Search
                    </button>
                  )}
                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="btn btn-outline"
                    >
                      Show All
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid gap-4 grid-cols-1"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredRequests.map(request => (
                <motion.div 
                  key={request.id} 
                  className="card overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <StatusBadge status={request.status} />
                        <div>
                          <h3 className="font-semibold text-surface-800 dark:text-surface-100">
                            {request.category}
                          </h3>
                          <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1">
                            <ClockIcon size={14} />
                            <span>
                              Reported {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <PriorityBadge priority={request.priority} />
                    </div>
                    
                    <p className="text-surface-700 dark:text-surface-300 mb-3">
                      {request.description}
                    </p>
                    
                    <div className="bg-surface-100 dark:bg-surface-800 p-2 rounded-lg text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2 mb-4">
                      <span className="i-lucide-map-pin text-surface-500" />
                      <span>{request.location}</span>
                    </div>
                    
                    {request.status !== 'completed' && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'assigned')}
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          >
                            Assign
                          </button>
                        )}
                        
                        {request.status === 'assigned' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'in-progress')}
                            className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                          >
                            Start Work
                          </button>
                        )}
                        
                        {request.status === 'in-progress' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                            className="px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
      
      {/* New Request Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <ToolIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">New Maintenance Request</h3>
                </div>
                
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <XIcon size={20} className="text-surface-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`input ${formErrors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="HVAC">HVAC</option>
                      <option value="General">General</option>
                      <option value="Security">Security</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`input min-h-[100px] ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Describe the issue in detail..."
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`input ${formErrors.location ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="e.g. Food Court, Ground Floor"
                    />
                    {formErrors.location && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <div className="flex flex-wrap gap-3">
                      {['low', 'medium', 'high'].map(priority => (
                        <label 
                          key={priority} 
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors
                            ${formData.priority === priority
                              ? priority === 'high'
                                ? 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-700'
                                : priority === 'medium'
                                  ? 'bg-amber-100 border-amber-400 dark:bg-amber-900/30 dark:border-amber-700' 
                                  : 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-700'
                              : 'bg-white dark:bg-surface-700 border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-600'
                            }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={formData.priority === priority}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          {priority === 'high' && (
                            <AlertTriangleIcon size={18} className="text-red-500 dark:text-red-400" />
                          )}
                          {priority === 'medium' && (
                            <ClockIcon size={18} className="text-amber-500 dark:text-amber-400" />
                          )}
                          {priority === 'low' && (
                            <CheckCircleIcon size={18} className="text-green-500 dark:text-green-400" />
                          )}
                          <span className="capitalize">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Helper components
function StatusBadge({ status }) {
  let color, icon, label;
  
  switch (status) {
    case 'pending':
      color = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      icon = <ClockIcon size={14} />;
      label = 'Pending';
      break;
    case 'assigned':
      color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      icon = <ClipboardCheckIcon size={14} />;
      label = 'Assigned';
      break;
    case 'in-progress':
      color = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      icon = <ToolIcon size={14} />;
      label = 'In Progress';
      break;
    case 'completed':
      color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      icon = <CheckCircleIcon size={14} />;
      label = 'Completed';
      break;
    default:
      color = 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300';
      icon = null;
      label = status;
  }
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  let color, icon, label;
  
  switch (priority) {
    case 'high':
      color = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      icon = <AlertTriangleIcon size={14} />;
      label = 'High Priority';
      break;
    case 'medium':
      color = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      icon = <ClockIcon size={14} />;
      label = 'Medium Priority';
      break;
    case 'low':
      color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      icon = <CheckCircleIcon size={14} />;
      label = 'Low Priority';
      break;
    default:
      color = 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300';
      icon = null;
      label = priority;
  }
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}