import React,{useEffect,useState,useContext} from 'react';
import { View,Text, StyleSheet,Image,Dimensions,TouchableOpacity } from "react-native";
import TrackPlayer,{useProgress,usePlaybackState,State,RepeatMode,useTrackPlayerEvents,Event}  from 'react-native-track-player';
import { TrackContext } from "../shared/Trackcontext";
import { QueueManagementContext } from "../shared/queueManagementContext";
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
export default function PlayerScreen(){

    const [trackInfo,setTrackInfo]=useContext(TrackContext);
    const [queManagement,setQueManagement]=useContext(QueueManagementContext);
    const {height,width} = Dimensions.get('window');
    const [isSeeking,setIsSeeking]=useState(false);
    const [sliderDis,setSliderDis]=useState(false)
    const [disableNext,setDisableNext] = useState(true);
    const [disablePrev,setDisablePrev] = useState(true);
    const [disableShuffle,setDisableShuffle] = useState(true);
    
    const [currentTrack,setCurrentTrack] = useState(async()=>{
        const cTrack = await TrackPlayer.getCurrentTrack()
        const getQue = await TrackPlayer.getQueue()
        
        if(cTrack!==null){
            const trackInf = await TrackPlayer.getTrack(cTrack || 0);
            if(getQue.length > 1){
                setDisableNext(false)
                setDisablePrev(false)
                setDisableShuffle(false)
            }
            setCurrentTrack({artistName:trackInf.artist,songTitle:trackInf.title,artwork:trackInf.artwork,duration:trackInf.duration})
        }else{
            setCurrentTrack({artistName:'No Artist',songTitle:'No Song Playing',artwork:'https://zeejaydev.com/iraqify/artworks/nosong.jpeg'})
            setSliderDis(true)
        }
    })

    const playBackState = usePlaybackState();
    const {position,duration}=useProgress(100);
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
        
            getWindowHeight()
       
    },[])
    
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack || 0);
        const {title, artist, artwork,duration} = track || {};
        setCurrentTrack({artistName:artist,songTitle:title,artwork:artwork})
      }
    });

    useEffect(()=>{
        if(!isSeeking && position && duration){
            setSliderValue(position/duration)
        } 
    },[position,duration])
   
  
    const slidingStarted = ()=>{
        setIsSeeking(true)
    }

    const slidingCompleted = async value=>{

        if(playBackState===State.Paused){
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
    }
    const pausePressed = async()=>{
        await TrackPlayer.pause();
    }

    const shufflePressed = async()=>{
        const que = await TrackPlayer.getQueue()
        if(que.length > 1){
            if(queManagement.shuffle===1){
                if(queManagement.repeat>1){setQueManagement({...queManagement,repeat:1})}
                setQueManagement({...queManagement,shuffle:queManagement.shuffle+1,shuffled:true})
                // console.log(queManagement.shuffle+'Shuffle on: coming from Playerscreen.js Shuffle fun')
                const shuffled = que.map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
                await TrackPlayer.reset()
                await TrackPlayer.add(shuffled).then(()=>TrackPlayer.play())
            }else{
                // console.log(queManagement.shuffle+'Shuffle off: coming from Playerscreen.js Shuffle fun')
                setQueManagement({...queManagement,shuffle:1})
                
            }
        }else{
            console.log('NO QUEUE: coming from Playerscreen.js Shuffle fun')
        }
    }
    const repeatPressed= async()=>{
        // console.log(queManagement.repeat)
        if(queManagement.repeat===1){
            //repeate track
            setQueManagement({...queManagement,repeat:queManagement.repeat+1})
            await TrackPlayer.setRepeatMode(RepeatMode.Track)
            return
        }
        if(queManagement.repeat===2){
            //repeat queue
            setQueManagement({...queManagement,repeat:queManagement.repeat+1})
            await TrackPlayer.setRepeatMode(RepeatMode.Queue)
        }else{
            await TrackPlayer.setRepeatMode(RepeatMode.Off)
            setQueManagement({...queManagement,repeat:1})
        }
    }
    const playNext = async()=>{

        try{
            
            await TrackPlayer.skipToNext();
            await TrackPlayer.play()
        }catch{
            console.log('last track: coming from Playerscreen.js')
        }
    }
    const playPrev = async()=>{

        try{
            await TrackPlayer.skipToPrevious();
            await TrackPlayer.play()
        }catch{
            console.log('on first track: coming from Playerscreen.js')
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
            height: 40,
            minWidth: "60%",
            maxWidth:"70%",
            flexDirection: "row",
            marginHorizontal:5,
            justifyContent:'center'
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
            fontSize:height<=600?11:15,
        },
        durationContainer:{
            display: 'flex',
            height: 40,
            justifyContent:'center'
        },
        repeatbutton:{
            position:'absolute',
            color:'white',
            top:-2,
            left:5
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

                                <View style={styles.durationContainer}>
                                    <Text style={styles.durationText}>
                                        {new Date(position * 1000).toISOString().substr(14, 5)}
                                    </Text>
                                </View>

                    
                                    <View style={styles.progress}>
                                        <Slider
                                            disabled={sliderDis}
                                            style={{width:'100%',height:40}}
                                            thumbTintColor='#fff'
                                            minimumValue={0}
                                            maximumValue={1}
                                            value={sliderValue}
                                            minimumTrackTintColor='grey'
                                            maximumTrackTintColor='#fff'
                                            onSlidingStart={slidingStarted}
                                            onSlidingComplete={slidingCompleted}
                                            tapToSeek
                                        />
                                    </View>
                                   
                                    <View style={styles.durationContainer}>
                                        <Text style={styles.durationText}>
                                            {new Date((duration - position) * 1000).toISOString().substr(14, 5)}
                                        </Text>
                                    </View>

                    </View>
    
                    <View style={styles.controlers}>
                        <View style={{marginHorizontal:8}}>
                            <TouchableOpacity onPress={shufflePressed} disabled={disableShuffle}>
                                <Icon name="ios-shuffle" style={{color:queManagement.shuffle===1?'gray':'white',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={playPrev} disabled={disablePrev}>
                                <Icon name="play-skip-back" style={{color:disablePrev?'gray':'#fff',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={{marginHorizontal:10}}>
                           {
                               playBackState===State.Paused?
                               <TouchableOpacity onPress={playPressed} disabled={playBackState===State.Paused?false:true}>
                                    <Icon name='play-circle-outline' style={{color:'white',fontSize:height<=600?60:100}}/>
                                </TouchableOpacity>
                                
                                :playBackState===State.Playing?
                                <TouchableOpacity onPress={pausePressed} >
                                    <Icon name='pause-circle-outline' style={{color:'white',fontSize:height<=600?60:100}}/>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={playPressed} disabled={playBackState===State.Paused?false:true}>
                                    <Icon name='play-circle-outline' style={{color:'white',fontSize:height<=600?60:100}}/>
                                </TouchableOpacity>
                           }
                        </View>
                        <View>
                            <TouchableOpacity onPress={playNext} disabled={disableNext}>
                                <Icon name="play-skip-forward" style={{color:disableNext?'gray':'#fff',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginHorizontal:8}}>
                            <TouchableOpacity onPress={repeatPressed}>
                                {queManagement.repeat > 2?<Text style={styles.repeatbutton}>2</Text>:null}
                                <Icon name="ios-repeat-sharp" style={{color:queManagement.repeat>1?'#fff':'gray',fontSize:height<=600?30:50}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                
            </View>
        )
    
}

