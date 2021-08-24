import React,{useEffect,useState,useContext} from 'react';
import { View,Text, StyleSheet,Image,Dimensions,TouchableOpacity,Platform } from "react-native";
import TrackPlayer,{useTrackPlayerProgress,usePlaybackState}  from 'react-native-track-player';
import {Icon} from 'native-base';
import Slider from "@brlja/react-native-slider";
import { TrackContext } from "../shared/Trackcontext";


export default function PlayerScreen(){

    const [trackInfo,setTrackInfo]=useContext(TrackContext);
    const {height,width} = Dimensions.get('window');
    
    const [isSeeking,setIsSeeking]=useState(false);
    const [sliderDis,setSliderDis]=useState(false)
    const [isPlaying,setIsPlaying] = useState(false)
    const [isPaused,setIsPaused] = useState(false)
    
    const [disable,setDisable] = useState(true);
    const [disableNext,setDisableNext] = useState(true);
    const [disablePrev,setDisablePrev] = useState(true);

    const [currentTrack,setCurrentTrack] = useState({artistName:'No Artist',songTitle:'No Song Playing',artwork:'https://zeejaydev.com/iraqify/artworks/nosong.jpeg'})

    const playBackState = usePlaybackState();
    const {position,duration}=useTrackPlayerProgress(100);
    const [sliderValue,setSliderValue]=useState(()=>{
        if(trackInfo.position>0){
            return trackInfo.position/trackInfo.duration
        }else{
            return 0
        }
    });

    const [sizes,setSizes] = useState({
        imgWidth:250,
        imgHeight:250,
        aspectR:height>=1000?10/5:10/8
    })
    
    const durationMin = Math.floor(duration / 60);
    const  durationSec = (duration  - durationMin * 60).toFixed(0);
    
    const TdurationMin = Math.floor(trackInfo.duration / 60);
    const  TdurationSec = (trackInfo.duration  - TdurationMin * 60).toFixed(0);

    const positionMin = Math.floor(position / 60);
    const  positionSec = (position  - positionMin * 60).toFixed(0);
    
    const TpositionMin = Math.floor(trackInfo.position / 60);
    const  TpositionSec = (trackInfo.position  - TpositionMin * 60).toFixed(0);
    
   


    useEffect(()=>{
        
        const getWindowHeight = ()=>{
            if(height<=600){
                setSizes({...sizes,imgHeight:130,imgWidth:130,aspectR:10/5.2})
            }else if(height<=700){
                setSizes({...sizes,imgHeight:180,imgWidth:180,aspectR:10/5.7})
            }else{
                return
            }
        }

        const getPlayingStatus = ()=>{
            if(playBackState===TrackPlayer.STATE_PLAYING){
                setIsPlaying(true)
                
            }else if(playBackState===TrackPlayer.STATE_PAUSED){
                setDisable(false)
                setIsPaused(true)
                setIsPlaying(false)
            }else{
                setIsPlaying(false)
              
            }
        }


        const getCurrentTrack = async ()=>{
            
            const currenttrack = await TrackPlayer.getCurrentTrack();
            
            if(currenttrack  == null){
                setCurrentTrack({artistName:'No Artist',songTitle:'No Song Playing',artwork:'https://zeejaydev.com/iraqify/artworks/nosong.jpeg'})
                setIsPlaying(false)
                setSliderDis(true)
             }else{
                
                const trackId = await TrackPlayer.getCurrentTrack();
                const trackInf = await TrackPlayer.getTrack(trackId);
                
                setCurrentTrack({artistName:trackInf.artist,songTitle:trackInf.title,artwork:trackInf.artwork,duration:trackInf.duration})
                setSliderDis(false)

                const getQue = await TrackPlayer.getQueue()

                if(getQue.length > 1){
                    setDisableNext(false)
                    setDisablePrev(false)
                }
                
             }
        }
    
            getWindowHeight()
            getPlayingStatus()
            getCurrentTrack()
       
    },[playBackState])

    useEffect(()=>{
        if(!isSeeking && position && duration){
            setSliderValue(position/duration)
        } 
       
    },[position,duration])
   
  
    const slidingStarted = ()=>{
        setIsSeeking(true)
    }

    const slidingCompleted = async value=>{

        if(playBackState===TrackPlayer.STATE_PAUSED){
            await TrackPlayer.seekTo(value * trackInfo.duration).then(()=>{
                setSliderValue(value)
                setIsSeeking(false)
                TrackPlayer.play()
            });
           
        }else{
            await TrackPlayer.seekTo(value * duration).then(()=>{
                setSliderValue(value)
                setIsSeeking(false)
            });
           
        }


        
    }

    const playPressed = async()=>{
        await TrackPlayer.play();
        setIsPlaying(true)
    }
    const pausePressed = async()=>{
        await TrackPlayer.pause();
        setIsPlaying(false)
    }
    const playNext = async()=>{

        try{
            
            await TrackPlayer.skipToNext();
            await TrackPlayer.play()
            setIsPlaying(true)
        }catch{
            console.log('last track')
        }
    }
    const playPrev = async()=>{

        try{
            await TrackPlayer.skipToPrevious();
            await TrackPlayer.play()
            setIsPlaying(true)
        }catch{
            console.log('on first track')
        }
        
    }


    const styles = StyleSheet.create({
        container:{
            flex:1,
            color:'#fff', 
            backgroundColor:'#212121',
        },
        img:{
            height:sizes.imgHeight,
            width:sizes.imgWidth,
        },
        header:{
            alignItems:'center',
            aspectRatio:sizes.aspectR,
            padding:0,
            shadowColor: "#000",

        shadowOffset: {
          width: 5,
          height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 15
        },
        titleContainer:{
            aspectRatio:10/1 ,
            justifyContent:'space-around',
            flexDirection:'row'
        },
        title:{
            alignItems:'center',
            flex:1,
            justifyContent:'center'
        },
        progressBar:{
            aspectRatio:10/3,
            paddingTop:'10%',
            justifyContent:'center',
            flexDirection:'row',
        },
        progress: {
            height: 2,
            minWidth: "60%",
            maxWidth:"70%",
            flexDirection: "row",
            marginHorizontal:5
          },
        progressStopped: {
            height: 2,
            minWidth: "95%",
            maxWidth:"70%",
            flexDirection: "row",
            marginHorizontal:5
          },
        controlers:{
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
        },
        durationText:{
            color:'white',
            marginRight:5,
            fontWeight:'bold',
            fontSize:height<=600?11:17
        }
    })

  
    

        return(
            <View style={{flex:1}}>
                <View style={styles.container} >
                    
                    <View style={styles.header}>
                        <Image source={{uri:currentTrack.artwork}} style={styles.img} />                   
                    </View>
                    
                    <View style={styles.titleContainer}>
                        <View style={styles.title}>
                            <Text style={{color:'white',fontWeight:'bold',fontSize:height<=600?11:17,marginVertical:5}}>{currentTrack.songTitle}</Text>
                            <Text style={{color:'#b3b3b3',fontWeight:'bold',fontSize:height<=600?11:17}}>{currentTrack.artistName}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.progressBar}>

                                <View>
                                   { playBackState===TrackPlayer.STATE_PLAYING 
                                   ?
                                    <Text style={styles.durationText}>
                                        {positionMin}:{positionSec < 10 ? '0'+positionSec:positionSec}
                                    </Text> 
                                    :
                                    isPaused
                                    ?
                                        <Text style={styles.durationText}>
                                            {TpositionMin}:{TpositionSec < 10 ? '0'+TpositionSec:TpositionSec}
                                        </Text>
                                    :
                                    <Text style={styles.durationText}>0:00</Text>
                                    
                                    }
                                </View>

                    
                                    <View style={styles.progress}>
                                        <Slider
                                            disabled={sliderDis}
                                            style={{width:'100%',height:25}}
                                            thumbTintColor='#fff'
                                            minimumValue={0}
                                            maximumValue={1}
                                            value={sliderValue}
                                            minimumTrackTintColor='grey'
                                            maximumTrackTintColor='#fff'
                                            onSlidingStart={slidingStarted}
                                            onSlidingComplete={slidingCompleted}
                                        />
                                    </View>
                                   

                                {
                                    isPlaying
                                    ?
                                   
                                        <Text style={styles.durationText}>
                                            {durationMin}:{durationSec<10?'0'+durationSec:durationSec}
                                        </Text>
                                   
                                    :
                                    isPaused
                                    
                                    ?
                                        <Text style={styles.durationText}>
                                            {TdurationMin}:{TdurationSec<10?'0'+TdurationSec:TdurationSec}
                                        </Text>
                                    :
                                        <Text style={styles.durationText}>0:00</Text>
                                 
                                }

                    </View>
    
                    <View style={styles.controlers}>
                        <View>
                            <TouchableOpacity onPress={playPrev} disabled={disablePrev}>
                                <Icon name="play-skip-back" style={{color:disablePrev?'gray':'#fff',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={{marginHorizontal:25}}>
                           {
                               !isPlaying?
                                <TouchableOpacity onPress={playPressed} disabled={disable}>
                                    <Icon name='play-circle-outline' style={{color:'white',fontSize:height<=600?60:100}}/>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={pausePressed} >
                                    <Icon name='pause-circle-outline' style={{color:'white',fontSize:height<=600?60:100}}/>
                                </TouchableOpacity>
                           }
                        </View>
                        <View>
                            <TouchableOpacity onPress={playNext} disabled={disableNext}>
                                <Icon name="play-skip-forward" style={{color:disableNext?'gray':'#fff',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                
            </View>
        )
    
}

