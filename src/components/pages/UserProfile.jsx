import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import usersService from '@/services/api/usersService'
import postsService from '@/services/api/postsService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const UserProfile = () => {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [following, setFollowing] = useState(false)

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      setError('')
      const [users, allPosts] = await Promise.all([
        usersService.getAll(),
        postsService.getAll()
      ])
      
      const foundUser = users.find(u => u.username === username)
      if (!foundUser) {
        setError('User not found')
        return
      }
      
      setUser(foundUser)
      setPosts(allPosts.filter(post => post.userId === foundUser.Id))
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [username])

  const handleFollow = () => {
    setFollowing(!following)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadUserProfile} />
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
          <Button
            variant={following ? "secondary" : "primary"}
            className="flex-1"
            onClick={handleFollow}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
          <Button variant="secondary" className="flex-1">
            Message
          </Button>
          <Button variant="secondary" size="md">
            <ApperIcon name="UserPlus" className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Posts Grid */}
      <div className="p-4">
        {posts.length === 0 ? (
          <Empty
            type="posts"
            title="No posts yet"
            message={`${user?.username} hasn't shared any posts yet.`}
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
      </div>
    </div>
  )
}

export default UserProfile