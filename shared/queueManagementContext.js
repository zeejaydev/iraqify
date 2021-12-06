import React, { createContext,useState } from "react";



export const QueueManagementContext = createContext();

export const QueueManagementProvider = (props)=>{
    const [queManagement,setQueManagement]=useState({
        shuffle:1,
        repeat:1,
        shuffled:false
    });



    
    return(
        <QueueManagementContext.Provider value={[queManagement,setQueManagement]}>
            {props.children}
        </QueueManagementContext.Provider>
    )
}