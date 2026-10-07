// import Users from "./pages/Users/Users"

import { createContext } from "react"
import Users from "./pages/Users/Users"


export const UserPostsContext = createContext({
  id: null,
  setId: (id: number | null) => { },
})

const App = () => {
  return (
    <>
      <UserPostsContext.Provider value={{ id, setId }}>

        <Users />
      </UserPostsContext.Provider>

    </>
  )
}

export default App
