import React, { createContext,useState } from "react";



export const TrackContext = createContext();

export const TrackInfoProvider = (props)=>{
    const [trackInfo,setTrackInfo]=useState({
        artistName:'',
        songTitle:'',
        artwork:'',
        position:0,
        duration:0
    });



    
    return(
        <TrackContext.Provider value={[trackInfo,setTrackInfo]}>
            {props.children}
        </TrackContext.Provider>
    )
}


