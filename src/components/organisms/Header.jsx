import { useLocation, useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import { motion } from 'framer-motion'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Gram Flow'
      case '/search': return 'Search'
      case '/create': return 'New Post'
      case '/activity': return 'Activity'
      case '/profile': return 'Profile'
      case '/messages': return 'Messages'
      default: return 'Gram Flow'
    }
  }

  const showBackButton = !['/'].includes(location.pathname)

  return (
    <motion.header
      className="bg-surface border-b border-gray-200 sticky top-0 z-40"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}
          
          <h1 className="text-xl font-display font-bold gradient-text">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {location.pathname === '/' && (
            <>
              <button
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ApperIcon name="MessageCircle" className="w-6 h-6 text-gray-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ApperIcon name="Heart" className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
          
          {location.pathname === '/search' && (
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ApperIcon name="ScanLine" className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header