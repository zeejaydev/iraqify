import React,{useEffect,useState,useContext} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import { Icon } from "native-base";
import TrackPlayer,{usePlaybackState,useTrackPlayerProgress, useTrackPlayerEvents } from 'react-native-track-player';
import { TrackContext } from "../shared/Trackcontext";
import TextTicker from 'react-native-text-ticker';

const {width,height}=Dimensions.get('window')
const bottom =  height <= 750 ? height/15 : height/12



export default function PlayerWidget({navigation}){

    const [trackInfo,setTrackInfo]=useContext(TrackContext);
    const playbackState = usePlaybackState();
    const progress = useTrackPlayerProgress(150);


    useEffect(() => { 
        setup() 
    }, []);

    useEffect(()=>{
      updateTrackInfo()
    },[progress.duration,progress.position])
    
    const updateTrackInfo = async ()=>{
      const trackid = await TrackPlayer.getCurrentTrack()
      
      if(trackid){
        const track = await TrackPlayer.getTrack(trackid)
        setTrackInfo({...trackInfo,artistName:track.artist,songTitle:track.title,position:progress.position,duration:progress.duration})
      }else{
        return null
      }
    }

    useTrackPlayerEvents(["playback-track-changed","playback-queue-ended"], async event => {
        
      if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
          
          
          if(event.nextTrack){
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork,id,duration} = track || {};
            if(title == undefined || artwork==undefined || artist==undefined ){
              setTrackInfo({songTitle:'',artistName:'',artwork:'',duration:0,position:0})
              
            }else{
              setTrackInfo({...trackInfo,songTitle:title,artistName:artist,artwork:artwork,duration:duration})
              await TrackPlayer.setVolume(1)
            
            }
          }else{
            setTrackInfo({songTitle:'',artistName:'',artwork:'https://zeejaydev.com/iraqify/artworks/nosong.jpeg',duration:0,position:0})
          }
        
        }else if(event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_QUEUE_ENDED){
          
          setTrackInfo({songTitle:'',artistName:'',artwork:'https://zeejaydev.com/iraqify/artworks/nosong.jpeg',duration:0,position:0})
        }

      });


      

      async function setup() {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
          ],
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ]
        });
      }

      const togglePause = async()=>{
         await TrackPlayer.pause();
         setTrackInfo({...trackInfo,position:progress.position,duration:progress.duration})
        //  setIsPlaying(false)
      }
      
      const togglePlay = async()=>{
         await TrackPlayer.play();
        //  setIsPlaying(true)
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
                    {/* <Text style={styles.songTitle}>{trackInfo.songTitle}</Text>
                    <Text style={{color:'#fff',fontWeight:'700'}}> - </Text> */}
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
                playbackState===TrackPlayer.STATE_PLAYING ?
                <TouchableOpacity style={{padding:8}} onPress={togglePause}>
                    <Icon name='pause-circle-outline' style={{color:'#fff',fontSize:height<=600?20:30}} />
                </TouchableOpacity>
                :
                playbackState===TrackPlayer.STATE_PAUSED?
                <TouchableOpacity style={{padding:8}} onPress={togglePlay}>
                    <Icon name='play-circle-outline' style={{color:'#fff',fontSize:height<=600?20:30}} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{padding:8}} onPress={togglePlay}>
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
