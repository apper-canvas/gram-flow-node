import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'

const StoryItem = ({ story, onClick }) => {
  const progressRingClass = !story.viewed 
    ? 'p-1 story-gradient rounded-full' 
    : 'p-1 bg-gray-200 rounded-full'
    
  return (
    <motion.div
      className="flex flex-col items-center space-y-2 cursor-pointer"
      onClick={() => onClick?.(story)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={progressRingClass}>
        <div className="p-0.5 bg-white rounded-full">
          <img
            src={story.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user?.username}`}
            alt={story.user?.username}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>
      </div>
      <span className={`text-xs max-w-16 truncate ${
        !story.viewed ? 'text-gray-900 font-medium' : 'text-gray-500'
      }`}>
        {story.user?.username}
      </span>
    </motion.div>
  )
}

export default StoryItem