
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { UserPostsProvider } from './App.tsx' // استورد الـ Provider هون

import Todos from './pages/Todos/Todos.tsx'
import MyPost from './pages/MyPost/MyPost.tsx'
import Posts from './pages/Posts/Posts.tsx'
import Albums from './pages/Albums/Albums.tsx'
import RongURL from './pages/RongURL/RongURL.tsx'
import Users from './pages/Users/Users.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Photos from './pages/Photos/Photos.tsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <Users />
  },
  {
    path: "/todos",
    element:<ProtectedRoute> <Todos /> </ProtectedRoute>
  }, {
    path: "/mypost",
    element: <ProtectedRoute> <MyPost /> </ProtectedRoute>
  }, {
    path: "/posts",
    element: <ProtectedRoute> <Posts /> </ProtectedRoute>
  }, {
    path: "/albums",
    element: <ProtectedRoute> <Albums /> </ProtectedRoute>
  },
  {
    path:"/photos",
    element: <ProtectedRoute> <Photos /> </ProtectedRoute>
  },
  {
    path: "*",
    element: <RongURL />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserPostsProvider>
      <RouterProvider router={route} />
    </UserPostsProvider>
  </StrictMode>,
)