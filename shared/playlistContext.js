import React, { createContext,useState } from "react";



export const PlaylistContext = createContext();

export const PlaylistInfoProvider = (props)=>{
    // const [list,setList]=useState({
    //     id:'1',
    //     playlists:[
    //         {
    //             playlistName:'حسام الرسام',
    //             playlistId:0,
    //             playlistTracks:[
    //                 {
                        
    //                         id:'1',
    //                         artwork:'https://c-sf.smule.com/rs-s77/arr/a7/13/b47c7fc5-21ab-4747-b7c1-6ef340c50d0d.jpg',
    //                         artist:'حسام الرسام',
    //                         title:'اسير الروح',
    //                         url:'https://cdn1.esm3.com//music/4558/m292197.mp3'
                         

    //                 }
    //             ]
    //         }

    //     ]
    // });

    const [list,setList]=useState(null);
    return(
        <PlaylistContext.Provider value={[list,setList]}>
            {props.children}
        </PlaylistContext.Provider>
    )
}
