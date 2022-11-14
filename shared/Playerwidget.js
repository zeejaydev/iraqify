import React,{useEffect,useState,useContext} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer,{usePlaybackState,useProgress, useTrackPlayerEvents,Capability,State,Event } from 'react-native-track-player';
import { TrackContext } from "../shared/Trackcontext";
import TextTicker from 'react-native-text-ticker';

const {width,height}=Dimensions.get('window')



export default function PlayerWidget({navigation}){

  // const [trackInfo,setTrackInfo]=useState({
  //     arttistName:'',
  //     songTitle:'',
  //     artwork:'',
  //     position:0,
  //     duration:0
  // });
  const [trackInfo,setTrackInfo]=useContext(TrackContext);
  const playbackState = usePlaybackState();
  const progress = useProgress(150);

    
  useTrackPlayerEvents([Event.PlaybackQueueEnded,Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged 
    ) {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(currentTrack || 0)
      if(track){
        const {title, artist, artwork,duration} = track || {};
        return setTrackInfo({...trackInfo,artistName:artist,songTitle:title,position:progress.position,duration:duration})
      }
    }

    if (
      event.type === Event.PlaybackQueueEnded &&
      event.nextTrack == undefined
    ) {
      console.log("last track")
    //   const que = await TrackPlayer.getQueue()
      
    //   await TrackPlayer.add([...que]).then(()=>TrackPlayer.pause())
    }
  });
    
    // useEffect(()=>{
      
    //   const updateTrackInfo = async ()=>{
    //     const trackid = await TrackPlayer.getCurrentTrack()
    //     if(trackid===0||trackid>0){
    //       const track = await TrackPlayer.getTrack(trackid)
          
    //       setTrackInfo({...trackInfo,artistName:track.artist,songTitle:track.title,position:progress.position,duration:progress.duration})
    //     }else{
    //       return null
    //     }
    //   }
      
    //   return updateTrackInfo

    // },[progress.duration,progress.position])
    
    

      const togglePause = async()=>{
         await TrackPlayer.pause();
         setTrackInfo({...trackInfo,position:progress.position,duration:progress.duration})
      }
      
      const togglePlay = async()=>{
        await TrackPlayer.play();
      }

      const songInfo = `${trackInfo.songTitle} - ${trackInfo.artistName}  `
      
    return(
        <View style={styles.container}>
            <View style={styles.progressbar}>
            <View style={styles.progress}>
                <View style={{ flex: progress.position, backgroundColor: "#fff" }} />
                <View
                    style={{
                    flex: progress.duration - progress.position,
                    backgroundColor: "grey"
                    }}
                />
            </View>
            </View>
            <TouchableOpacity style={{padding:8}} onPress={()=>{navigation.navigate('Playerscreen',{})}}>
                <Icon name='chevron-up' style={{color:'#fff',fontSize:height<=600?20:30}} />
            </TouchableOpacity>
            
            
            <View style={{flexDirection:'row',flex:0.80,alignItems:'center',justifyContent:'center'}}>
                {
                    trackInfo.songTitle === '' || trackInfo.artistName === ''?
                    <Text style={styles.noSongText}>لا يوجد اغنيه بقائمة التشغيل</Text>
                   
                    :
                    <React.Fragment  >
                    <TextTicker
                      style={styles.noSongText}
                      duration={4000}
                      animationType='bounce'
                      loop
                      scroll={false}
                      isRTL
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={3000}
                    >
                      {songInfo}
                    </TextTicker>
                    </React.Fragment>
                    
                }
                
            </View>
            
            {
                playbackState==='loading'||playbackState==='buffering'||playbackState==='ready'?
                <TouchableOpacity style={{padding:8}} onPress={togglePause}>
                  <ActivityIndicator color='#fff'/>
                </TouchableOpacity>
                :
                playbackState===State.Playing ?
                <TouchableOpacity style={{padding:8}} onPress={togglePause}>
                    <Icon name='pause-circle-outline' style={{color:'#fff',fontSize:height<=600?20:30}} />
                </TouchableOpacity>
                :
                playbackState===State.Paused?
                <TouchableOpacity style={{padding:8}} onPress={togglePlay}>
                    <Icon name='play-circle-outline' style={{color:'#fff',fontSize:height<=600?20:30}} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{padding:8}} onPress={togglePlay} disabled={playbackState===1?true:false}>
                    <Icon name='play-circle-outline' style={{color:'#fff',fontSize:height<=600?20:30}} />
                </TouchableOpacity>
            }
            

        </View>
    )
    
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#212121',
        height:height<=600?40:60,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        
    },    
    songTitle:{
        color:'white',
        fontWeight:'bold'
    },
    artistTitle:{
        color:'#fff',
        fontWeight:'bold'
    },
    progressbar:{
        width:'100%',
        position:'absolute',
        top:0,
        left:0
    },
    progress: {
        height: 2,
        minWidth: "100%",
        flexDirection: "row",
        
      },
      noSongText:{
        fontSize:height<=600?10:15,
        color:'#fff',
        fontWeight:'bold'
      }
    })
