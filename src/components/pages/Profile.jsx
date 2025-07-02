import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    displayName: '',
    bio: ''
  })
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

  useEffect(() => {
    if (user && showEditModal) {
      setEditForm({
        username: user.username || '',
        displayName: user.displayName || '',
        bio: user.bio || ''
      })
    }
  }, [user, showEditModal])

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setEditLoading(true)
      const updatedUser = await usersService.update(user.Id, editForm)
      setUser(updatedUser)
      setShowEditModal(false)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
    if (user) {
      setEditForm({
        username: user.username || '',
        displayName: user.displayName || '',
        bio: user.bio || ''
      })
    }
  }

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
<div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              size="xl"
            />
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                {user?.username}
              </h1>
              <p className="text-gray-600">{user?.displayName}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm">
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

        {user?.bio && (
          <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
        )}

<div className="flex space-x-3">
          <Button variant="secondary" className="flex-1" onClick={handleEditProfile}>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button 
                onClick={handleEditCancel}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <Input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Enter display name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleEditCancel}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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