import React,{useEffect,useState,useContext} from "react";
import { Text, View} from 'react-native';
import TrackPlayer from "react-native-track-player";
import PlaylistContext from '../shared/playlistContext';

export default function QueueScreen () {
    
   

    return (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#121212'}}>
            <Text style={{color:'white'}}>QUEUE</Text>
        </View>
    )

  }
