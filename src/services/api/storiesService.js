import mockStories from '@/services/mockData/stories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const storiesService = {
  async getAll() {
    await delay(250)
    return [...mockStories]
  },

  async getById(id) {
    await delay(200)
    const story = mockStories.find(s => s.Id === id)
    if (!story) {
      throw new Error('Story not found')
    }
    return { ...story }
  },

  async create(storyData) {
    await delay(400)
    const newStory = {
      Id: Math.max(...mockStories.map(s => s.Id)) + 1,
      ...storyData,
      viewed: false,
      createdAt: new Date().toISOString()
    }
    mockStories.push(newStory)
    return { ...newStory }
  },

  async update(id, data) {
    await delay(300)
    const index = mockStories.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Story not found')
    }
    mockStories[index] = { ...mockStories[index], ...data }
    return { ...mockStories[index] }
  },

  async delete(id) {
    await delay(300)
    const index = mockStories.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Story not found')
    }
    const deleted = mockStories.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default storiesService