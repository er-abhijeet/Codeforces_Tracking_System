import  {  useState } from 'react'
import UserContext from './UserContext'


function UserContextProvider({children}) {
      const [students, setStudents] = useState([]);
    
    
    return (
        <UserContext.Provider value={{students, setStudents}}>
            {children}
        </UserContext.Provider>

    )
}

export default UserContextProvider
