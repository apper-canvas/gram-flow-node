import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  accept,
  onFileSelect,
  preview,
  ...props
}) => {
const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept || { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0 && onFileSelect) {
        onFileSelect(acceptedFiles[0])
      }
    },
    disabled: type !== 'file'
  })

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {type === 'file' ? (
        <div>
          <motion.div
            {...getRootProps()}
            className={`w-full min-h-[120px] border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            } ${error ? 'border-error' : ''}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-2">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                />
                <p className="text-sm text-gray-600">Click or drag to change image</p>
              </div>
            ) : (
              <div className="space-y-3">
                <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-600">
                    {isDragActive ? 'Drop the image here' : 'Click or drag image to upload'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Support for JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
            </div>
          )}
          
          <motion.input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              error ? 'border-error ring-2 ring-error/20' : ''
            }`}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
        </div>
      )}
      
      {error && (
        <motion.p
          className="mt-2 text-sm text-error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input