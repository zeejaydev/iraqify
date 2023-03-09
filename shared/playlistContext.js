import React, { createContext,useState } from "react";



export const PlaylistContext = createContext();

export const PlaylistInfoProvider = (props)=>{

    const [list,setList]=useState(null);
    return(
        <PlaylistContext.Provider value={[list,setList]}>
            {props.children}
        </PlaylistContext.Provider>
    )
}
