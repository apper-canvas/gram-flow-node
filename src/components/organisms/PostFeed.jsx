import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PostCard from '@/components/molecules/PostCard'
import postsService from '@/services/api/postsService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const PostFeed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await postsService.getAll()
      setPosts(data)
    } catch (err) {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleLike = async (postId) => {
    // Handle like logic
    console.log('Like post:', postId)
  }

  const handleComment = async (postId, comment) => {
    // Handle comment logic
    console.log('Comment on post:', postId, comment)
  }

  if (loading) {
    return <Loading type="feed" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPosts} />
  }

  if (posts.length === 0) {
    return (
      <Empty
        type="posts"
        title="No posts in your feed"
        message="Follow some users to see their posts here, or create your first post to get started!"
        actionText="Create Post"
        onAction={() => window.location.href = '/create'}
      />
    )
  }

  return (
    <div className="space-y-6 p-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default PostFeed