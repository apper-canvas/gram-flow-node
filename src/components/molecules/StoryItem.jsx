import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'

const StoryItem = ({ story, onClick }) => {
  return (
    <motion.div
      className="flex flex-col items-center space-y-2 cursor-pointer"
      onClick={() => onClick?.(story)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Avatar
        src={story.user?.avatar}
        alt={story.user?.username}
        size="lg"
        hasStory={!story.viewed}
      />
      <span className="text-xs text-gray-600 max-w-16 truncate">
        {story.user?.username}
      </span>
    </motion.div>
  )
}

export default StoryItem