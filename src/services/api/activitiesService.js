import mockActivities from '@/services/mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const activitiesService = {
  async getAll() {
    await delay(300)
    return [...mockActivities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const activity = mockActivities.find(a => a.Id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(400)
    const newActivity = {
      Id: Math.max(...mockActivities.map(a => a.Id)) + 1,
      ...activityData,
      createdAt: new Date().toISOString()
    }
    mockActivities.unshift(newActivity)
    return { ...newActivity }
  },

  async update(id, data) {
    await delay(300)
    const index = mockActivities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    mockActivities[index] = { ...mockActivities[index], ...data }
    return { ...mockActivities[index] }
  },

  async delete(id) {
    await delay(300)
    const index = mockActivities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    const deleted = mockActivities.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default activitiesService