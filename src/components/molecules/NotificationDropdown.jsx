import { useState, useEffect } from 'react'
import { Menu } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import NotificationItem from '@/components/molecules/NotificationItem'
import activitiesService from '@/services/api/activitiesService'

const NotificationDropdown = () => {
  const [activities, setActivities] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await activitiesService.getAll()
      // Show only recent 5 notifications in dropdown
      setActivities(data.slice(0, 5))
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await activitiesService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await activitiesService.markAllAsRead()
      setUnreadCount(0)
      setActivities(prev => prev.map(activity => ({ ...activity, read: true })))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const handleViewAll = () => {
    navigate('/activity')
  }

  const groupedActivities = activities.reduce((groups, activity) => {
    const type = activity.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(activity)
    return groups
  }, {})

  const getGroupIcon = (type) => {
    switch (type) {
      case 'like': return 'Heart'
      case 'comment': return 'MessageCircle'
      case 'follow': return 'UserPlus'
      case 'mention': return 'AtSign'
      default: return 'Bell'
    }
  }

  const getGroupLabel = (type) => {
    switch (type) {
      case 'like': return 'Likes'
      case 'comment': return 'Comments'
      case 'follow': return 'New Followers'
      case 'mention': return 'Mentions'
      default: return 'Activity'
    }
  }

  const getGroupColor = (type) => {
    switch (type) {
      case 'like': return 'text-red-500'
      case 'comment': return 'text-blue-500'
      case 'follow': return 'text-green-500'
      case 'mention': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ApperIcon name="Bell" className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </Menu.Button>

          <AnimatePresence>
            {open && (
              <Menu.Items
                as={motion.div}
                static
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-4 z-50 max-h-96 overflow-y-auto"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <ApperIcon name="Bell" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {/* Grouped Activities */}
                    <div className="px-2">
                      {Object.entries(groupedActivities).map(([type, typeActivities]) => (
                        <div key={type} className="mb-4 last:mb-0">
                          {/* Group Header */}
                          <div className="flex items-center space-x-2 px-2 py-2">
                            <ApperIcon 
                              name={getGroupIcon(type)} 
                              className={`w-4 h-4 ${getGroupColor(type)}`}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {getGroupLabel(type)} ({typeActivities.length})
                            </span>
                          </div>
                          
                          {/* Group Items */}
                          <div className="space-y-1">
                            {typeActivities.slice(0, 3).map((activity, index) => (
                              <Menu.Item key={activity.Id}>
                                {({ active }) => (
                                  <NotificationItem
                                    activity={activity}
                                    index={index}
                                    compact={true}
                                    showPostImage={true}
                                  />
                                )}
                              </Menu.Item>
                            ))}
                            {typeActivities.length > 3 && (
                              <div className="px-3 py-1">
                                <span className="text-xs text-gray-500">
                                  +{typeActivities.length - 3} more {getGroupLabel(type).toLowerCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 pt-3 px-4">
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors py-2"
                      >
                        View all notifications
                      </button>
                    </div>
                  </>
                )}
              </Menu.Items>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  )
}

export default NotificationDropdown