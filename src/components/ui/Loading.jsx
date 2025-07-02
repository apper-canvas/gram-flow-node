import { motion } from 'framer-motion'

const Loading = ({ type = 'feed' }) => {
  if (type === 'feed') {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="bg-surface rounded-xl p-4 post-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Header skeleton */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
              <div>
                <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-1" />
                <div className="w-16 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Image skeleton */}
            <div className="w-full h-80 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
            
            {/* Actions skeleton */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
            
            {/* Caption skeleton */}
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="w-3/4 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'profile-grid') {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, index) => (
          <motion.div
            key={index}
            className="aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    )
  }

  // Default loading
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-8 h-8 border-3 border-gray-300 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading