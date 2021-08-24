import React from "react";
import {StyleSheet,View,Text} from "react-native";
import  {useTrackPlayerProgress} from "react-native-track-player";


export default function ProgressBar(){
    
    const progress = useTrackPlayerProgress(190);
    
    if(progress.duration && progress.position > 0){
        return(
            <View style={styles.progress}>
                <View style={{ flex: progress.position, backgroundColor: "#fff" }} />
                <View
                    style={{
                    flex: progress.duration - progress.position,
                    backgroundColor: "grey"
                    }}
                />
            </View>
            
        )
    }else{
        return(
            <View style={styles.progress}>
                
                <View
                    style={{flex:1,
                    backgroundColor: "grey"
                    }}
                />
                
            </View>
        )
    }
}

const styles= StyleSheet.create({
    progress: {
        height: 2,
        minWidth:'60%',
        flexDirection: "row",
        marginHorizontal:10
      },
})