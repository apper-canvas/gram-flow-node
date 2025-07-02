import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const NotificationItem = ({ 
  activity, 
  index = 0, 
  showFollowButton = false, 
  showPostImage = false,
  compact = false 
}) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'like': return 'Heart'
      case 'comment': return 'MessageCircle'
      case 'follow': return 'UserPlus'
      case 'mention': return 'AtSign'
      default: return 'Bell'
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'like':
        return `${activity.user?.username} liked your photo.`
      case 'comment':
        return `${activity.user?.username} commented: "${activity.content}"`
      case 'follow':
        return `${activity.user?.username} started following you.`
      case 'mention':
        return `${activity.user?.username} mentioned you in a comment.`
      default:
        return activity.content
    }
  }

  const getIconBgColor = (type) => {
    switch (type) {
      case 'like': return 'bg-red-500'
      case 'comment': return 'bg-blue-500' 
      case 'follow': return 'bg-green-500'
      case 'mention': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <motion.div
      className={`flex items-center space-x-3 ${compact ? 'p-3' : 'p-4'} ${
        compact ? 'hover:bg-gray-50' : 'bg-surface rounded-xl'
      } ${!activity.read ? 'bg-blue-50' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={activity.user?.avatar}
          alt={activity.user?.username}
          size={compact ? "sm" : "md"}
        />
        <div className={`absolute -bottom-1 -right-1 ${compact ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex items-center justify-center ${getIconBgColor(activity.type)}`}>
          <ApperIcon
            name={getActivityIcon(activity.type)}
            className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-800 leading-relaxed`}>
          {compact && activity.content.length > 60 
            ? `${getActivityText(activity).substring(0, 60)}...`
            : getActivityText(activity)
          }
        </p>
        <p className={`${compact ? 'text-xs' : 'text-xs'} text-gray-500 mt-1`}>
          {formatDistanceToNow(new Date(activity.createdAt))} ago
        </p>
      </div>

      {showFollowButton && activity.type === 'follow' && (
        <Button variant="primary" size="sm">
          Follow Back
        </Button>
      )}

      {showPostImage && activity.postImage && (
        <img
          src={activity.postImage}
          alt="Post"
          className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} object-cover rounded-lg flex-shrink-0`}
        />
      )}

      {!activity.read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
      )}
    </motion.div>
  )
}

export default NotificationItem