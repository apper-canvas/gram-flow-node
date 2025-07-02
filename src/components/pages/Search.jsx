import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import postsService from '@/services/api/postsService'
import usersService from '@/services/api/usersService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Avatar from '@/components/atoms/Avatar'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [postsData, usersData] = await Promise.all([
        postsService.getAll(),
        usersService.getAll()
      ])
      setPosts(postsData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredPosts = posts.filter(post => 
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="p-4 space-y-6">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search for users and posts..."
        className="sticky top-0 z-10"
      />

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {['posts', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div>
          {searchQuery && filteredPosts.length === 0 ? (
            <Empty
              type="search"
              title="No posts found"
              message={`No posts found for "${searchQuery}". Try searching for something else.`}
            />
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {(searchQuery ? filteredPosts : posts).map((post, index) => (
                <motion.div
                  key={post.Id}
                  className="aspect-square cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={post.images?.[0] || `https://picsum.photos/300/300?random=${post.Id}`}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {searchQuery && filteredUsers.length === 0 ? (
            <Empty
              type="search"
              title="No users found"
              message={`No users found for "${searchQuery}". Try searching for someone else.`}
            />
          ) : (
            <div className="space-y-3">
              {(searchQuery ? filteredUsers : users).map((user, index) => (
                <motion.div
                  key={user.Id}
                  className="flex items-center justify-between p-3 bg-surface rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar src={user.avatar} alt={user.username} size="md" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.displayName}</p>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200">
                    Follow
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search