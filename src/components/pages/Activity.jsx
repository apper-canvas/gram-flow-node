import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import activitiesService from '@/services/api/activitiesService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'

const Activity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await activitiesService.getAll()
      setActivities(data)
    } catch (err) {
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true
    return activity.type === activeTab
  })

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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadActivities} />
  }

  return (
    <div className="p-4 space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'like', label: 'Likes' },
          { key: 'comment', label: 'Comments' },
          { key: 'follow', label: 'Follows' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activities */}
      {filteredActivities.length === 0 ? (
        <Empty
          type="activity"
          title="No activity yet"
          message="When someone likes, comments, or follows you, you'll see it here."
        />
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              className="flex items-center space-x-3 p-4 bg-surface rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <Avatar
                  src={activity.user?.avatar}
                  alt={activity.user?.username}
                  size="md"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  activity.type === 'like' ? 'bg-red-500' :
                  activity.type === 'comment' ? 'bg-blue-500' :
                  activity.type === 'follow' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  <ApperIcon
                    name={getActivityIcon(activity.type)}
                    className="w-3 h-3 text-white"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt))} ago
                </p>
              </div>

              {activity.type === 'follow' && (
                <Button variant="primary" size="sm">
                  Follow Back
                </Button>
              )}

              {activity.postImage && (
                <img
                  src={activity.postImage}
                  alt="Post"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Activity