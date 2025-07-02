import mockPosts from '@/services/mockData/posts.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const postsService = {
  async getAll() {
    await delay(300)
    return [...mockPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const post = mockPosts.find(p => p.Id === id)
    if (!post) {
      throw new Error('Post not found')
    }
    return { ...post }
  },

  async create(postData) {
    await delay(400)
    const newPost = {
      Id: Math.max(...mockPosts.map(p => p.Id)) + 1,
      userId: 1, // Current user
      user: {
        Id: 1,
        username: 'you',
        avatar: null
      },
      ...postData,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
    mockPosts.unshift(newPost)
    return { ...newPost }
  },

  async update(id, data) {
    await delay(300)
    const index = mockPosts.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    mockPosts[index] = { ...mockPosts[index], ...data }
    return { ...mockPosts[index] }
  },

  async delete(id) {
    await delay(300)
    const index = mockPosts.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    const deleted = mockPosts.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default postsService