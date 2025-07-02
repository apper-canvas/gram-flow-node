import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search...", className = '' }) => {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <motion.div
        className={`relative ${focused ? 'ring-2 ring-primary/20' : ''} rounded-xl transition-all duration-200`}
        whileFocus={{ scale: 1.01 }}
      >
        <ApperIcon
          name="Search"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-xl placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onSearch?.('')
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </motion.div>
    </form>
  )
}

export default SearchBar