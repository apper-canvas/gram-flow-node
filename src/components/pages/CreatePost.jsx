import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import postsService from '@/services/api/postsService'

const CreatePost = () => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [loading, setLoading] = useState(false)

  const filters = [
    { name: 'none', label: 'Original' },
    { name: 'grayscale', label: 'B&W' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'brightness', label: 'Bright' },
    { name: 'contrast', label: 'Pop' },
    { name: 'saturate', label: 'Vivid' },
    { name: 'blur', label: 'Soft' }
  ]

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getFilterStyle = (filterName) => {
    switch (filterName) {
      case 'grayscale': return { filter: 'grayscale(100%)' }
      case 'sepia': return { filter: 'sepia(100%)' }
      case 'brightness': return { filter: 'brightness(120%)' }
      case 'contrast': return { filter: 'contrast(120%)' }
      case 'saturate': return { filter: 'saturate(150%)' }
      case 'blur': return { filter: 'blur(1px)' }
      default: return {}
    }
  }

  const handlePost = async () => {
    if (!selectedImage || !caption.trim()) {
      toast.error('Please select an image and add a caption')
      return
    }

    try {
      setLoading(true)
      const newPost = {
        images: [selectedImage],
        caption: caption.trim(),
        location: location.trim(),
        filter: selectedFilter,
        createdAt: new Date().toISOString()
      }
      
      await postsService.create(newPost)
      toast.success('Post created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Image Upload */}
      {!selectedImage ? (
        <motion.div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center"
          whileHover={{ borderColor: '#E1306C' }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="Camera" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select a photo to share
          </h3>
          <p className="text-gray-500 mb-6">
            Choose from your camera roll or take a new photo
          </p>
          
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button variant="primary" className="w-full">
                <ApperIcon name="Upload" className="w-4 h-4" />
                Upload Photo
              </Button>
            </label>
            
            <Button variant="secondary" className="w-full">
              <ApperIcon name="Camera" className="w-4 h-4" />
              Take Photo
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-80 object-cover rounded-xl"
              style={getFilterStyle(selectedFilter)}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Filters</h4>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`flex-shrink-0 ${
                    selectedFilter === filter.name
                      ? 'ring-2 ring-primary'
                      : ''
                  } rounded-lg overflow-hidden`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt={filter.label}
                      className="w-16 h-16 object-cover"
                      style={getFilterStyle(filter.name)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                      {filter.label}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <Input
            label="Caption"
            type="text"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Location */}
          <Input
            label="Location"
            type="text"
            placeholder="Add location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon="MapPin"
          />

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setSelectedImage(null)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Share Post'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePost