// // import Users from "./pages/Users/Users"

// import { createContext, useState } from "react";
// import Users from "./pages/Users/Users";

// export const UserPostsContext = createContext({
//   id: null,
//   setId: (id: number | null) => {},
// });

// const App = () => {
//   const [id, setId] = useState<number | null>(null);
//   return (
//     <>
//       <UserPostsContext.Provider value={{ id, setId }}>
//         <Users />
//       </UserPostsContext.Provider>
//     </>
//   );
// };

// export default App;


// App.tsx
import { createContext, useState, ReactNode } from "react";

type ContextType = {
  id: number | null;
  setId: (id: number | null) => void;
};

export const UserPostsContext = createContext<ContextType>({
  id: null,
  setId: () => {},
});

export const UserPostsProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);

  return (
    <UserPostsContext.Provider value={{ id, setId }}>
      {children}
    </UserPostsContext.Provider>
  );
};