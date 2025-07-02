import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import StoryItem from '@/components/molecules/StoryItem'
import StoryViewer from '@/components/organisms/StoryViewer'
import storiesService from '@/services/api/storiesService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [uploading, setUploading] = useState(false)
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
    const storyIndex = stories.findIndex(s => s.Id === story.Id)
    setCurrentStoryIndex(storyIndex)
    setViewerOpen(true)
  }

  const handleStoryComplete = async (storyId) => {
    try {
      await storiesService.markAsViewed(storyId)
      setStories(prev => prev.map(s => 
        s.Id === storyId ? { ...s, viewed: true } : s
      ))
    } catch (err) {
      console.error('Failed to mark story as viewed:', err)
    }
  }

  const handleViewerClose = () => {
    setViewerOpen(false)
    setCurrentStoryIndex(0)
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
        {/* Add Story Button */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            className="flex flex-col items-center space-y-2 cursor-pointer"
            onClick={() => setUploadModalOpen(true)}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <ApperIcon name="Plus" className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Add Story</span>
          </div>
        </motion.div>

        {stories.map((story, index) => (
          <motion.div
            key={story.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
            className="flex-shrink-0"
          >
            <StoryItem story={story} onClick={handleStoryClick} />
          </motion.div>
        ))}
      </div>
      
      {viewerOpen && (
        <StoryViewer
          stories={stories}
          currentIndex={currentStoryIndex}
          onClose={handleViewerClose}
          onStoryComplete={handleStoryComplete}
          onIndexChange={setCurrentStoryIndex}
        />
)}

      {/* Story Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setUploadModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Story</h2>
                <button
                  onClick={() => {
                    setUploadModalOpen(false)
                    setSelectedImage(null)
                    setImagePreview('')
                    setSelectedFilter('none')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <Input
                  type="file"
                  label="Select Image"
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                  onFileSelect={handleImageSelect}
                  preview={imagePreview}
                  error={error}
                />

                {imagePreview && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filters
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {filters.map((filter) => (
                          <button
                            key={filter.name}
                            onClick={() => setSelectedFilter(filter.name)}
                            className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                              selectedFilter === filter.name
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={imagePreview}
                              alt={filter.label}
                              className={`w-full h-16 object-cover ${getFilterStyle(filter.name)}`}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                              {filter.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Preview
                      </label>
                      <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-h-64">
                        <img
                          src={imagePreview}
                          alt="Story preview"
                          className={`w-full h-full object-cover ${getFilterStyle(selectedFilter)}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setUploadModalOpen(false)
                      setSelectedImage(null)
                      setImagePreview('')
                      setSelectedFilter('none')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleStoryUpload}
                    disabled={!selectedImage || uploading}
                  >
                    {uploading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Share Story'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  function handleImageSelect(file) {
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  function getFilterStyle(filterName) {
    const filterStyles = {
      none: '',
      grayscale: 'filter grayscale',
      sepia: 'filter sepia',
      blur: 'filter blur-sm',
      brightness: 'filter brightness-125',
      contrast: 'filter contrast-125',
      saturate: 'filter saturate-150'
    }
    return filterStyles[filterName] || ''
  }

  async function handleStoryUpload() {
    if (!selectedImage || !imagePreview) {
      toast.error('Please select an image')
      return
    }

    try {
      setUploading(true)
      setError('')

      const storyData = {
        image: imagePreview,
        filter: selectedFilter,
        userId: 1,
        user: {
          Id: 1,
          username: "current_user",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current"
        }
      }

      const newStory = await storiesService.uploadStory(storyData)
      setStories(prev => [newStory, ...prev])
      
      toast.success('Story uploaded successfully!')
      setUploadModalOpen(false)
      setSelectedImage(null)
      setImagePreview('')
      setSelectedFilter('none')
    } catch (err) {
      setError('Failed to upload story. Please try again.')
      toast.error('Failed to upload story')
    } finally {
      setUploading(false)
    }
  }

  const filters = [
    { name: 'none', label: 'Original' },
    { name: 'grayscale', label: 'B&W' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'blur', label: 'Blur' },
    { name: 'brightness', label: 'Bright' },
    { name: 'contrast', label: 'Sharp' },
    { name: 'saturate', label: 'Vivid' }
  ]
}

export default StoriesBar