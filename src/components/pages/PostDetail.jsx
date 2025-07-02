import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
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
    try {
      const updatedPost = await postsService.toggleLike(postId, 1) // Current user ID
      setPost(updatedPost)
      
      const isLiked = updatedPost.likes?.some(like => like.userId === 1)
      toast.success(isLiked ? 'Post liked!' : 'Like removed')
    } catch (err) {
      toast.error('Failed to update like')
      console.error('Like error:', err)
    }
  }

  const handleComment = async (postId, commentText) => {
    if (!commentText?.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const updatedPost = await postsService.addComment(postId, { text: commentText.trim() })
      setPost(updatedPost)
      toast.success('Comment added!')
    } catch (err) {
      toast.error('Failed to add comment')
      console.error('Comment error:', err)
    }
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