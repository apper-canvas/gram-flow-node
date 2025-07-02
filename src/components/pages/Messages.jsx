import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import messagesService from '@/services/api/messagesService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadConversations = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await messagesService.getConversations()
      setConversations(data)
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const data = await messagesService.getMessages(conversationId)
      setMessages(data)
    } catch (err) {
      console.error('Failed to load conversation messages')
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation)
    loadMessages(conversation.Id)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message = {
        text: newMessage.trim(),
        receiverId: selectedConversation.user.Id,
        createdAt: new Date().toISOString()
      }
      
      await messagesService.sendMessage(message)
      setNewMessage('')
      loadMessages(selectedConversation.Id)
    } catch (err) {
      console.error('Failed to send message')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadConversations} />
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold gradient-text">Messages</h2>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4">
              <Empty
                type="messages"
                title="No messages yet"
                message="Start a conversation by sending a message to someone."
              />
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation, index) => (
                <motion.button
                  key={conversation.Id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${
                    selectedConversation?.Id === conversation.Id ? 'bg-primary/10' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <Avatar
                      src={conversation.user?.avatar}
                      alt={conversation.user?.username}
                      size="md"
                    />
                    {!conversation.lastMessage?.read && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800">
                      {conversation.user?.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage?.text || 'No messages'}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {conversation.lastMessage && 
                      formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })
                    }
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                </button>
                <Avatar
                  src={selectedConversation.user?.avatar}
                  alt={selectedConversation.user?.username}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedConversation.user?.username}
                  </h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Phone" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Video" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Info" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.senderId === 1 // Current user ID
                return (
                  <motion.div
                    key={message.Id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatDistanceToNow(new Date(message.createdAt))} ago
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" type="button">
                  <ApperIcon name="Image" className="w-5 h-5" />
                </Button>
                
                <Input
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newMessage.trim()}
                >
                  <ApperIcon name="Send" className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center">
              <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                Your Messages
              </h3>
              <p className="text-gray-400">
                Send private messages to a friend or group.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages