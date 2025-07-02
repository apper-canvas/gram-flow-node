import mockUsers from '@/services/mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const usersService = {
  async getAll() {
    await delay(250)
    return [...mockUsers]
  },

  async getById(id) {
    await delay(200)
    const user = mockUsers.find(u => u.Id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      ...userData,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isPrivate: false
    }
    mockUsers.push(newUser)
    return { ...newUser }
  },

async update(id, data) {
    await delay(300)
    
    // Validate required fields
    if (data.username && data.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }
    
    if (data.displayName && data.displayName.trim().length < 1) {
      throw new Error('Display name is required')
    }
    
    // Check for duplicate username if changing
    if (data.username) {
      const existingUser = mockUsers.find(u => u.Id !== id && u.username === data.username.trim())
      if (existingUser) {
        throw new Error('Username already taken')
      }
    }
    
    const index = mockUsers.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    // Clean and update data
    const cleanData = {
      ...data,
      username: data.username?.trim(),
      displayName: data.displayName?.trim(),
      bio: data.bio?.trim()
    }
    
    mockUsers[index] = { ...mockUsers[index], ...cleanData }
    return { ...mockUsers[index] }
  },

  async delete(id) {
    await delay(300)
    const index = mockUsers.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    const deleted = mockUsers.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default usersService