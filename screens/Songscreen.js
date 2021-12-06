import React,{useEffect,useState} from "react";
import {View,Text,StyleSheet,Image,TouchableOpacity,ScrollView,Dimensions,ImageBackground} from 'react-native';
import {Icon} from 'native-base';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';

const {height}=Dimensions.get('window')

export default function SongScreen ({route,navigation}){

    const playbackState = usePlaybackState();
    
    const [data,setData]=useState([])


    useEffect(()=>{
    
     database().ref('/').once('value').then(snapshot => {
      setData(snapshot.val());
    //   setIsloading(false)
    }).catch((e)=>{
      console.log(e)
    //   setIsloading(false)
      setData(null)
    });



  },[])

    const togglePlay = async () => {

        if(playbackState  === 'idle'){
            await TrackPlayer.add({
                id: route.params.id,
                url: route.params.url,
                title: route.params.song,
                artist: route.params.artist,
                artwork: route.params.img,
                duration: route.params.duration,
                // pitchAlgorithm: 'PITCH_ALGORITHM_MUSIC'
                });
            await TrackPlayer.setVolume(1)
            await TrackPlayer.play()
           
        }else {
            await TrackPlayer.reset()
            await TrackPlayer.add({
                id: route.params.id,
                url: route.params.url,
                title: route.params.song,
                artist: route.params.artist,
                artwork: route.params.img,
                duration: route.params.duration,
                // pitchAlgorithm: 'PITCH_ALGORITHM_MUSIC'
                });
            await TrackPlayer.setVolume(1)
            await TrackPlayer.play()
            
        }

    };

    
    const playPressed = async(item)=>{
        
        if(playbackState === 'idle'){
            
            await TrackPlayer.add({
                id: item.id,
                url: item.songUrl,
                title: item.songName,
                artist: item.artistName,
                artwork: item.imgUri,
                duration: item.duration,
                pitchAlgorithm: item.pitchAlgorithm
                });
            await TrackPlayer.play()

        }else{
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: item.id,
                url: item.songUrl,
                title: item.songName,
                artist: item.artistName,
                artwork: item.imgUri,
                duration: item.duration,
                pitchAlgorithm: item.pitchAlgorithm
                });
            await TrackPlayer.play()
        }
       
       
    }


    const TrackObj = {
        id: route.params.id,
        url: route.params.url,
        title: route.params.song,
        artist: route.params.artist,
        artwork: route.params.img,
        duration: route.params.duration
    }

    return(
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.header}>
                <Image source={{uri:route.params.img}} style={styles.img}/>
                <Text style={styles.text}>{route.params.artist}</Text>
                
                <View>
                <TouchableOpacity style={styles.button} onPress={togglePlay}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
                </View>
            </View>
            
           

            <View style={styles.listContainer}>

                <View style={styles.list}>

                    <View style={styles.newSong}>
                        <View >
                            <TouchableOpacity style={{padding:5}} onPress={togglePlay}>

                                <Text style={styles.songTitle}>{route.params.song}</Text>
                                <Text style={styles.songText}>{route.params.artist}</Text>

                            </TouchableOpacity>
                        </View>
                        <View>

                        <TouchableOpacity onPress={()=>navigation.navigate({name:'AddToPlaylistScreen1',params:{TrackObj},merge:true})} style={{padding:5}}>
                            <Icon name='ellipsis-vertical' style={styles.icon} />
                        </TouchableOpacity>
                        </View>

                    </View>
                    
                   
                       
                        
                    
                </View>

            <View style={styles.otherSongs}>
                <Text style={{...styles.text,textAlign:'center'}}>اغاني اخرى ل{route.params.artist}</Text>
                
                {
                    data.filter(item=>{
                        if(item.artistName.includes(route.params.artist)){
                            return item
                        }else if(item.artistName===route.params.artist){
                            return item
                        }else{
                            return null
                        }
                        
                    }).filter(item=>item.songName!==route.params.song?item:null).map((item)=>{
                        const TrackObj = {
                            id: item.id,
                            url: item.songUrl,
                            title: item.songName,
                            artist: item.artistName,
                            artwork: item.imgUri,
                            duration: item.duration,
                            pitchAlgorithm: item.pitchAlgorithm
                        }
                        // console.log(item)
                        return(
                            <View style={{flex:1,minWidth:'100%',flexDirection:'row',marginVertical:5}} key={item.id}>
                            <View style={{marginLeft:20}}>
                                <TouchableOpacity 
                                onPress={()=>navigation.navigate('AddToPlaylistScreen1',{TrackObj})}
                                style={{padding:10}}
                                >
                                    {/* <Icon name='ellipsis-vertical' style={styles.icon} /> */}
                                    <Image source={require('../shared/icons8-add-list-60.png')} style={styles.addSong}/>
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:10,justifyContent:'center'}}>
                            

                            </View>
                            <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} onPress={()=>playPressed(item)}>
                                <View style={{alignItems:'flex-end',marginHorizontal:8}}>
                                    
                                    <Text style={styles.otherSongsText}>{item.songName}</Text>
                                    
                                    
                                </View>
                                {/* <ImageBackground source={{uri:item.imgUri}} style={styles.otherSongsImg}> */}
                                <FastImage
                                    style={styles.otherSongsImg}
                                    source={{
                                        uri: item.imgUri,
                                        priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                >
                                <View style={{height:height<=600?30:40,backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}}>
                                    <Icon name='play' style={{color:'rgba(255,255,255,0.7)',fontSize:height<=600?15:20}} />
                                </View>
                                </FastImage>
                                {/* </ImageBackground> */}
                            </TouchableOpacity>
                        </View>
                        )
                    })
                }
                
            </View>

            </View>
            
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        color:'white', 
        backgroundColor:'#121212',
    },
    header:{
        aspectRatio:height<=600?10/4.5:10/6,
        alignItems: 'center', 
        
    },
    listContainer:{
        flex:1,
        color:'white', 
        marginTop:5
    },
    list:{

        flexDirection:'row',
        justifyContent:'space-between',
    },
    img:{
        width:height<=600?100:160,
        height:height<=600?100:160,
        marginVertical:height<=600?2:10
    },
    text:{
        fontSize:height<=600?15:17,
        fontWeight:'500',
        color:'#b3b3b3'
    },
    songTitle:{

        color:'#fff',
        marginHorizontal:height<=600?15:20,
        marginVertical:5,
        fontSize:height<=600?12:15,
        fontWeight:'bold'
    },
    songText:{
      
        color:'#b2b2b2',
        marginHorizontal:height<=600?15:20,
        fontSize:height<=600?10:12,
        fontWeight:'bold'
    },
    newSong:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        marginVertical:45
    },
    icon:{
        color:'#fff',
        marginVertical:5,
        marginHorizontal:10,
        fontSize:height<=600?20:30
    },
    button:{
        backgroundColor:'#1db954',
        padding:height<=600?5:10,
        width:height<=600?120:210,
        marginTop:height<=600?5:10,
        borderRadius:50
    },
    buttonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:height<=600?12:15,
        textTransform:'uppercase'
    },
    otherSongs:{
        marginTop:0,
    },
    otherSongsText:{
        flexDirection:'row',
        color:'#fff',
        fontWeight:'bold',
        fontSize:height<=600?12:15
    },
    otherSongsImg:{
        width:height<=600?30:40,
        height:height<=600?30:40,
        marginRight:10
    },
    addSong:{
        width:height<=600?18:30,
        height:height<=600?18:30,
        
    },  
    icon:{
        color:'#fff',
        fontSize:height<=600?18:23,
        justifyContent:'center',
        alignItems:'center'
    }
    
})