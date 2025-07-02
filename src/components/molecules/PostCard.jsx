import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import { formatDistanceToNow } from 'date-fns'

const PostCard = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = () => {
    setLiked(!liked)
    onLike?.(post.Id)
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites', {
      icon: liked ? '💔' : '❤️'
    })
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onComment?.(post.Id, comment)
      setComment('')
      toast.success('Comment added!')
    }
  }

  return (
    <motion.div
      className="bg-surface rounded-xl post-shadow overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={post.user?.avatar} 
            alt={post.user?.username}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.user?.username}</h3>
            <p className="text-sm text-gray-500">{post.location}</p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ApperIcon name="MoreHorizontal" className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.images?.[0] || 'https://picsum.photos/600/600?random=' + post.Id}
          alt={post.caption}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              className="flex items-center space-x-1"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-6 h-6 ${liked ? 'text-red-500 fill-current' : 'text-gray-700'}`} 
                />
              </motion.div>
            </motion.button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="MessageCircle" className="w-6 h-6 text-gray-700" />
            </button>
            
            <button className="flex items-center space-x-1">
              <ApperIcon name="Send" className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <button>
            <ApperIcon name="Bookmark" className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-gray-800 mb-2">
          {post.likes?.length || 0} likes
        </p>

        {/* Caption */}
        <div className="mb-3">
          <span className="font-semibold text-gray-800 mr-2">{post.user?.username}</span>
          <span className="text-gray-700">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments?.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2 hover:text-gray-700"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 mb-3"
          >
            {post.comments?.slice(0, 3).map((comment) => (
              <div key={comment.Id} className="flex items-start space-x-2">
                <Avatar src={comment.user?.avatar} size="sm" />
                <div className="flex-1">
                  <span className="font-semibold text-sm mr-2">{comment.user?.username}</span>
                  <span className="text-sm text-gray-700">{comment.text}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Add comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-3 border-t pt-3">
          <Avatar size="sm" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 text-sm placeholder-gray-500 border-none outline-none"
          />
          {comment.trim() && (
            <button
              type="submit"
              className="text-primary font-semibold text-sm hover:text-primary-dark"
            >
              Post
            </button>
          )}
        </form>

        {/* Time */}
        <p className="text-xs text-gray-400 mt-2">
          {formatDistanceToNow(new Date(post.createdAt))} ago
        </p>
      </div>
    </motion.div>
  )
}

export default PostCard