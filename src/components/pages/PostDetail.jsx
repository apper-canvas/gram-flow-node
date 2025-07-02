import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PostCard from '@/components/molecules/PostCard'
import postsService from '@/services/api/postsService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPost = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await postsService.getById(parseInt(id))
      setPost(data)
    } catch (err) {
      setError('Post not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPost()
  }, [id])

  const handleLike = async (postId) => {
    console.log('Like post:', postId)
  }

  const handleComment = async (postId, comment) => {
    console.log('Comment on post:', postId, comment)
  }

  if (loading) {
    return <Loading type="feed" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPost} />
  }

  if (!post) {
    return <Error message="Post not found" />
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PostCard
        post={post}
        onLike={handleLike}
        onComment={handleComment}
      />
    </motion.div>
  )
}

export default PostDetail