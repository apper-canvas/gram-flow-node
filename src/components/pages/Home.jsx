import StoriesBar from '@/components/organisms/StoriesBar'
import PostFeed from '@/components/organisms/PostFeed'

const Home = () => {
  return (
    <div className="min-h-screen">
      <StoriesBar />
      <PostFeed />
    </div>
  )
}

export default Home