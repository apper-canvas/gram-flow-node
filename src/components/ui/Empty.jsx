import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  type = 'posts',
  title = "No posts yet",
  message = "When you create your first post, it will appear here.",
  actionText = "Create Post",
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'posts': return 'Camera'
      case 'messages': return 'MessageCircle'
      case 'activity': return 'Bell'
      case 'search': return 'Search'
      default: return 'Camera'
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={getIcon()} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-display font-semibold gradient-text mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
        {message}
      </p>
      
      {onAction && actionText && (
        <motion.button
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty