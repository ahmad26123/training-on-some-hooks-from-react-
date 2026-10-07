// import { createContext, useState, ReactNode } from "react";

// // 1. تعريف واجهة البيانات (TypeScript Interface)
// interface UserPostsContextType {
//     id: number | null;
//     setId: (id: number | null) => void;
// }

// // 2. إنشاء الـ Context
// export const UserPostsContext = createContext<UserPostsContextType>({
//     id: null,
//     setId: () => { },
// });

// // 3. إنشاء وتصدير الـ Provider (تأكد من وجود كلمة export هنا)
// export const UserPostsProvider = ({ children }: { children: ReactNode }) => {
//     const [id, setId] = useState<number | null>(null);

//     return (
//         <UserPostsContext.Provider value={{ id, setId }}>
//             {children}
//         </UserPostsContext.Provider>
//     );
// };