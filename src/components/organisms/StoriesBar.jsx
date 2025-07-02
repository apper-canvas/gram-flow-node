import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StoryItem from '@/components/molecules/StoryItem'
import storiesService from '@/services/api/storiesService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStories = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await storiesService.getAll()
      setStories(data)
    } catch (err) {
      setError('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const handleStoryClick = (story) => {
    // Handle story view logic
    console.log('View story:', story)
  }

  if (loading) {
    return (
      <div className="p-4 bg-surface">
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
              <div className="w-12 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadStories} />
  }

  return (
    <motion.div
      className="p-4 bg-surface border-b border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <motion.div
            key={story.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <StoryItem story={story} onClick={handleStoryClick} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default StoriesBar