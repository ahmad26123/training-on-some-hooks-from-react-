import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Todos from './pages/Todos/Todos.tsx'
import MyPost from './pages/MyPost/MyPost.tsx'
import Posts from './pages/Posts/Posts.tsx'
import Albums from './pages/Albums/Albums.tsx'
import RongURL from './pages/RongURL/RongURL.tsx'
import Users from './pages/Users/Users.tsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <Users />
  },
  {
    path: "/todos",
    element: <Todos />
  }, {
    path: "/mypost",
    element: <MyPost />
  }, {
    path: "/posts",
    element: <Posts />
  }, {
    path: "/albums",
    element: <Albums />
  },
  {
    path: "*",
    element: <RongURL />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}

    <RouterProvider router={route} />
  </StrictMode>,
)
