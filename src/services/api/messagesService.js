import mockMessages from '@/services/mockData/messages.json'
import mockConversations from '@/services/mockData/conversations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const messagesService = {
  async getConversations() {
    await delay(300)
    return [...mockConversations]
  },

  async getMessages(conversationId) {
    await delay(250)
    return mockMessages.filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },

  async sendMessage(messageData) {
    await delay(400)
    const newMessage = {
      Id: Math.max(...mockMessages.map(m => m.Id)) + 1,
      senderId: 1, // Current user
      conversationId: 1, // Default conversation
      read: false,
      ...messageData,
      createdAt: new Date().toISOString()
    }
    mockMessages.push(newMessage)
    return { ...newMessage }
  },

  async markAsRead(messageId) {
    await delay(200)
    const index = mockMessages.findIndex(m => m.Id === messageId)
    if (index !== -1) {
      mockMessages[index].read = true
      return { ...mockMessages[index] }
    }
    throw new Error('Message not found')
  },

  async deleteMessage(id) {
    await delay(300)
    const index = mockMessages.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Message not found')
    }
    const deleted = mockMessages.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default messagesService