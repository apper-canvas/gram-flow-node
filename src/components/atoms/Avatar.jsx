import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt = 'User avatar', 
  size = 'md', 
  hasStory = false,
  className = '',
  onClick
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }
  
  const storyRing = hasStory ? 'p-0.5 story-gradient' : ''
  
  return (
    <motion.div
      className={`${sizes[size]} ${storyRing} rounded-full flex-shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <img
        src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${hasStory ? 'border-2 border-white' : ''}`}
      />
    </motion.div>
  )
}

export default Avatar