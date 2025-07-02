import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/search', icon: 'Search', label: 'Search' },
    { path: '/create', icon: 'PlusSquare', label: 'Create' },
    { path: '/activity', icon: 'Heart', label: 'Activity' },
    { path: '/profile', icon: 'User', label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-50 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-3 min-w-0 flex-1"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon
                  name={item.icon}
                  className={`w-6 h-6 ${
                    isActive ? 'text-primary' : 'text-gray-600'
                  }`}
                />
              </motion.div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-primary font-medium' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation