import React,{useEffect,useState} from "react";
import {View,Text,StyleSheet,Image,TouchableOpacity,
    ScrollView,Dimensions,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import { SongScreenText } from "../types";
import { language } from "../utils/langCheck";

const {height}=Dimensions.get('window');

const iconSize = height > 1000 ? 30 : 20;
const textSize = height > 1000 ? 18 : 15;
const smallTextSize = height > 1000 ? 15 : 12;
const titleSize = height > 1000 ? 19 : 17;
const headerSize = height > 1000 ? 10/3 : 10/6;
const bigImageSize = height > 1000 ? 200 : 150;
const imageSize = height > 1000 ? 80 : 40;
const bgSize = height > 1000 ? 80 : 40 ;

export default function SongScreen ({route,navigation}){

    const playbackState = usePlaybackState();
    const en = language() === "en" ? true : false;
    const [data,setData]=useState([])
    const [loading,setloading]=useState(false)

    useEffect(()=>{
    setloading(true)
    database().ref('/').once('value').then(snapshot => {
      setData(snapshot.val().filter((songs)=>songs.artistName===route.params.artist));
      setloading(false)
    //   setIsloading(false)
    }).catch((e)=>{
      console.log(e)
    //   setIsloading(false)
      setData(null)
    });



  },[])

    // Futuer update to include english artist and song names
    // const artistName = route.params.altArtistName && en ? route.params.altArtistName : route.params.artist;
    // const songName = route.params.altSongTitle && en ? route.params.altSongTitle : route.params.song;
    const artistName = route.params.artist;
    const songName = route.params.song;

    const togglePlay = async () => {
        if(playbackState  === 'idle'){
            await TrackPlayer.add({
                id: route.params.id,
                url: route.params.url,
                title: songName,
                artist: artistName,
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
                title: songName,
                artist: artistName,
                artwork: route.params.img,
                duration: route.params.duration,
                // pitchAlgorithm: 'PITCH_ALGORITHM_MUSIC'
                });
            await TrackPlayer.setVolume(1)
            await TrackPlayer.play()
            
        }

    };

    const shuffle = (array)=> {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    const playAll = async () => {
        const tracks = data.map((i)=>({
            id:i.id,
            url:i.songUrl,
            title:i.songName,
            artist:i.artistName,
            artwork:i.imgUri,
            duration: i.duration,
            pitchAlgorithm: i.pitchAlgorithm
        }))
        const shuffled = shuffle(tracks)
        
        if(playbackState  === 'idle'){
            await TrackPlayer.add([...shuffled]);
            await TrackPlayer.setVolume(1)
            await TrackPlayer.play()
           
        }else {
            await TrackPlayer.reset()
            await TrackPlayer.add([...shuffled]);
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
        title: songName,
        artist: artistName,
        artwork: route.params.img,
        duration: route.params.duration
    }

    return(
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.header}>
                <Image source={{uri:route.params.img}} style={styles.img}/>
                <Text style={styles.text}>{artistName}</Text>
                
                {
                    loading ? <View style={styles.button}>
                    <ActivityIndicator  color='white' size='small'/>
                </View>:
                <View>
                <TouchableOpacity style={styles.button} onPress={playAll}>
                    <Text style={styles.buttonText}>{SongScreenText[`${language()}-playall`]}</Text>
                </TouchableOpacity>
                </View>
                }
                
            </View>
            
           

            <View style={styles.listContainer}>

                <View style={styles.list}>

                    <View style={styles.newSong}>
                        <View>

                            <TouchableOpacity onPress={()=>navigation.navigate({name:'AddToPlaylistScreen1',params:{TrackObj},merge:true})} style={{padding:10}}>
                                <Icon name='ellipsis-vertical' style={styles.icon} />
                            </TouchableOpacity>
                        </View>

                        <View >
                            <TouchableOpacity style={{padding:5}} onPress={togglePlay}>

                                <Text style={styles.songTitle}>{songName}</Text>
                                <Text style={styles.songText}>{artistName}</Text>

                            </TouchableOpacity>
                        </View>
                        

                    </View>
                    
                   
                       
                        
                    
                </View>

            <View style={styles.otherSongs}>
                <Text style={{...styles.text,textAlign:'center'}}>{`${SongScreenText[`${language()}-other`]}`}</Text>
                
                {
                    data.filter(item=>{
                        if(item.artistName.includes(artistName) || item.artistName){
                            return item
                        }else if(item.artistName===artistName){
                            return item
                        }else{
                            return null
                        }
                        
                    }).filter(item=>(item.songName!==songName && item.altSongName!==songName)?item:null).map((item)=>{
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
                                <View style={{height:height<=600?30:bgSize,backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}}>
                                    <Icon name='play' style={{color:'rgba(255,255,255,0.7)',fontSize:height<=600?15:iconSize}} />
                                </View>
                                </FastImage>
                                {/* </ImageBackground> */}
                            </TouchableOpacity>
                        </View>
                        )
                    }).reverse()
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
        aspectRatio:height<=600?10/4.5:headerSize,
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
        width:height<=600?100:bigImageSize,
        height:height<=600?100:bigImageSize,
        marginVertical:height<=600?2:10
    },
    text:{
        fontSize:height<=600?15:titleSize,
        fontWeight:'500',
        color:'#b3b3b3',
        textTransform:'capitalize'
    },
    songTitle:{
        textAlign:'right',
        color:'#fff',
        marginHorizontal:height<=600?15:20,
        marginVertical:5,
        fontSize:height<=600?12:textSize,
        fontWeight:'bold',
        textTransform:'capitalize'
    },
    songText:{
        textAlign:'right',
        color:'#b2b2b2',
        marginHorizontal:height<=600?15:20,
        fontSize:height<=600?10:smallTextSize,
        fontWeight:'bold',
        textTransform:'capitalize'
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
        fontSize:height<=600?12:textSize,
        textTransform:'uppercase'
    },
    otherSongs:{
        marginTop:0,
    },
    otherSongsText:{
        flexDirection:'row',
        color:'#fff',
        fontWeight:'bold',
        fontSize:height<=600?12:textSize,
        textTransform:'capitalize'
    },
    otherSongsImg:{
        width:height<=600?30:imageSize,
        height:height<=600?30:imageSize,
        marginRight:10
    },
    addSong:{
        width:height<=600?18:30,
        height:height<=600?18:30,
        
    },  
    icon:{
        color:'#fff',
        fontSize:height<=600?18:iconSize,
        justifyContent:'center',
        alignItems:'center'
    }
    
})