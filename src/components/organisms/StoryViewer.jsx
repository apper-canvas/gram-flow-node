import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@react-spring/web'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
const StoryViewer = ({ 
  stories, 
  currentIndex, 
  onClose, 
  onStoryComplete, 
  onIndexChange 
}) => {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const currentStory = stories[currentIndex]
  const STORY_DURATION = 5000 // 5 seconds per story

  // Progress animation
  const progressAnimation = useSpring({
    width: `${progress}%`,
    config: { duration: 100 }
  })

  // Swipe gesture handling
  const [{ x }, api] = useSpring(() => ({ x: 0 }))
  
  const bind = useDrag(
    ({ last, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (last) {
        const shouldSwipe = Math.abs(mx) > 100 || Math.abs(vx) > 0.5
        if (shouldSwipe) {
          if (dx > 0) {
            handlePrevious()
          } else {
            handleNext()
          }
        }
        api.start({ x: 0 })
      } else {
        api.start({ x: mx })
      }
    },
    { axis: 'x', bounds: { left: -200, right: 200 } }
  )

  // Story progression logic
  useEffect(() => {
    if (!imageLoaded || isPaused) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (STORY_DURATION / 100))
        if (newProgress >= 100) {
          handleNext()
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, imageLoaded, isPaused])

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0)
    setImageLoaded(false)
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      onStoryComplete(currentStory.Id)
      onIndexChange(currentIndex + 1)
    } else {
      onStoryComplete(currentStory.Id)
      onClose()
      toast.success('All stories viewed!')
    }
  }, [currentIndex, stories.length, currentStory?.Id, onStoryComplete, onIndexChange, onClose])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }, [currentIndex, onIndexChange])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrevious()
          break
        case 'Escape':
          onClose()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleNext, handlePrevious, onClose])

  // Prevent body scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleStoryClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const centerX = rect.width / 2
    
    if (clickX < centerX) {
      handlePrevious()
    } else {
      handleNext()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1 z-20">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              {index < currentIndex && (
                <div className="w-full h-full bg-white rounded-full" />
              )}
              {index === currentIndex && (
                <animated.div
                  style={progressAnimation}
                  className="h-full bg-white rounded-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <img
              src={currentStory?.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory?.user?.username}`}
              alt={currentStory?.user?.username}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="text-white font-medium text-sm">
              {currentStory?.user?.username}
            </span>
            <span className="text-white/70 text-xs">
              {currentStory?.createdAt && new Date(currentStory.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Story content */}
        <animated.div
          {...bind()}
          style={{ x }}
          className="relative w-full h-full max-w-md mx-auto"
          onClick={handleStoryClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={currentStory?.image}
            alt="Story content"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Navigation hints */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 cursor-pointer" />
            <div className="flex-1 cursor-pointer" />
          </div>
        </animated.div>

        {/* Mobile navigation hints */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs text-center sm:hidden">
          <p>Tap left or right to navigate</p>
          <p>Swipe to skip stories</p>
        </div>

        {/* Desktop navigation hints */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs text-center hidden sm:block">
          <p>← → Arrow keys or click to navigate • ESC to close</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StoryViewer