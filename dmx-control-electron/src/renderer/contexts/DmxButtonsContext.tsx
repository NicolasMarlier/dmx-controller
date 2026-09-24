import { createContext, useContext, useEffect, useState } from "react";
import { listPrograms } from "../apiClient";


interface DmxButtonsContextType {
  programs: Program[]
}


export const DmxButtonsContext = createContext<DmxButtonsContextType | null>(null);

export const useDmxButtonsContext = () => {
  const dmxButtonsContext = useContext(DmxButtonsContext);

  if (!dmxButtonsContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }
  return dmxButtonsContext
}



export const DmxButtonsContextProvider = ({ children }: {children: React.ReactNode}) => {
  // Use State to keep the values
  const [programs, setPrograms] = useState([] as Program[])
  


  
  const syncPrograms = () => listPrograms().then(setPrograms)

  
  
  

  useEffect(() => { syncPrograms() }, []) 

  
  
  // pass the value in provider and return
  return (
    <DmxButtonsContext.Provider value={ {
        programs


        
        } }>
      {children}
    </DmxButtonsContext.Provider>
  )
}
