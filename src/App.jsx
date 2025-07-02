import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Search from '@/components/pages/Search'
import CreatePost from '@/components/pages/CreatePost'
import Activity from '@/components/pages/Activity'
import Profile from '@/components/pages/Profile'
import Messages from '@/components/pages/Messages'
import PostDetail from '@/components/pages/PostDetail'
import UserProfile from '@/components/pages/UserProfile'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="activity" element={<Activity />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="user/:username" element={<UserProfile />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App