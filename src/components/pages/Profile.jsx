import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import postsService from '@/services/api/postsService'
import usersService from '@/services/api/usersService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('grid')

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const [userData, postsData] = await Promise.all([
        usersService.getById(1), // Current user
        postsService.getAll()
      ])
      setUser(userData)
      // Filter posts by current user
      setPosts(postsData.filter(post => post.userId === userData.Id))
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadProfile} />
  }

  return (
    <div className="pb-6">
      {/* Profile Header */}
      <motion.div
        className="p-6 bg-surface"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            size="xl"
          />
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {user?.username}
            </h1>
            <p className="text-gray-600 mb-3">{user?.displayName}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{posts.length}</div>
                <div className="text-gray-500">posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{user?.followersCount || 0}</div>
                <div className="text-gray-500">followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{user?.followingCount || 0}</div>
                <div className="text-gray-500">following</div>
              </div>
            </div>
          </div>
        </div>

        {user?.bio && (
          <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
        )}

        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1">
            Edit Profile
          </Button>
          <Button variant="secondary" size="md">
            <ApperIcon name="Share" className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="md">
            <ApperIcon name="UserPlus" className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-surface">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === 'grid'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          }`}
        >
          <ApperIcon name="Grid3X3" className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === 'tagged'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          }`}
        >
          <ApperIcon name="Tag" className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'grid' && (
          <>
            {posts.length === 0 ? (
              <Empty
                type="posts"
                title="No posts yet"
                message="Share your first photo or video to get started and connect with others."
                actionText="Create Post"
                onAction={() => window.location.href = '/create'}
              />
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.Id}
                    className="aspect-square cursor-pointer relative group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={post.images?.[0] || `https://picsum.photos/300/300?random=${post.Id}`}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Heart" className="w-5 h-5" />
                          <span className="font-semibold">{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" className="w-5 h-5" />
                          <span className="font-semibold">{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'tagged' && (
          <Empty
            type="posts"
            title="No tagged posts"
            message="When people tag you in their posts, they'll appear here."
          />
        )}
      </div>
    </div>
  )
}

export default Profile