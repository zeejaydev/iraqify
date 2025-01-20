import React,{useEffect,useState,useContext} from "react";
import { Text, View,StyleSheet,ScrollView,TouchableOpacity,Image,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import FastImage from 'react-native-fast-image'
import { QueueManagementContext } from "../shared/queueManagementContext";
import { Instructions, SongScreenText, Texts } from "../types";
import { language } from "../utils/langCheck";

const {height}=Dimensions.get('window');

const iconSize = height > 1000 ? 25 : 18;
const textSize = height > 1000 ? 18 : 15;
const smallTextSize = height > 1000 ? 15 : 12;
const headerImagesSize = height > 1000 ? 100 : 50;
const bigImageSize = height > 1000 ? 200 : 100;
const imageSize = height > 1000 ? 80 : 50;
const instructionIconSize = height > 1000 ? 60 : 35;
const buttonHeight = height > 1000 ? 50 : 45 ;

export default function MyPlaylist ({route}) {
    const [queManagement,setQueManagement]=useContext(QueueManagementContext);
    const user = firebase.auth().currentUser;
    const PlaylistName = route.params.item;
    const playbackState = usePlaybackState();
    const [tracks2,settracks2] = useState();
    const [docId,setDocId]=useState();
    const [editList,setEditList]=useState(false);

    useEffect(()=>{
        const user = firebase.auth().currentUser
        
        const subscribe = firestore().collection('Users').doc(user.uid).collection('Playlists').onSnapshot(function(querySnapshot) {
           
            try {
                querySnapshot.forEach( (doc) => doc.id===PlaylistName ? (settracks2( doc.data() ) ,setDocId(doc.id)) : doc.data() )
            } catch (error) {
                console.log(error)
            }
            
        });
   
      return ()=>subscribe()
    },[])
    const headerPic = tracks2 && tracks2.Tracks.slice(-4).map(item=>item.artwork);

    const deletePressed = (item)=>{
        firebase.firestore().collection('Users').doc(user.uid).collection('Playlists').doc(docId).update({
            Tracks : firebase.firestore.FieldValue.arrayRemove(item)
        })
    }


    

    if(tracks2== undefined || tracks2== null || tracks2.Tracks.length === 0)return<View style={{
        flex:1, 
        backgroundColor:'#121212',
        justifyContent:'center',
        alignItems:'center'
    }}>
        <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center',lineHeight:20,marginVertical:10,fontSize:textSize}}>
            {Instructions[`${language()}-inst`]}
        </Text>
        <Image source={require('../shared/icons8-add-list-60.png')} style={{width:instructionIconSize,height:instructionIconSize}}/>
        <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center',lineHeight:20,marginVertical:10,fontSize:textSize}}>
            {Instructions[`${language()}-inst2`]}
        </Text>
        <Icon name='add' style={{color:'#fff'}} size={instructionIconSize} />
    </View>
    
    const playPressed = async(item,i)=>{
        const que = await TrackPlayer.getQueue();
        const same = que.find((x,index)=>item.id===x.id && i ===index);
        if(playbackState === 'idle' ){
            await TrackPlayer.add([...tracks2.Tracks]);
            await TrackPlayer.skip(i).then(()=>TrackPlayer.play())

        }else if(que.length > 1){
            //que not shuffled
            if(queManagement.shuffled){
                //if the que is shuffled
                await TrackPlayer.reset();
                await TrackPlayer.add([...tracks2.Tracks]);
                await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
                setQueManagement({...queManagement,shuffled:false,shuffle:1})
            }else if (same){
                await TrackPlayer.skip(i).then(()=>TrackPlayer.play()).catch(async (e)=>{
                    if(e.message ==='Given track ID was not found in queue'){
                        await TrackPlayer.reset();
                        await TrackPlayer.add([...tracks2.Tracks]);
                        await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
                    }else{
                        console.log(e)
                    }
                })
            }
            else{
                await TrackPlayer.reset();
                await TrackPlayer.add([...tracks2.Tracks]);
                await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
                setQueManagement({...queManagement,shuffled:false,shuffle:1})
            }
           
        }else{
            await TrackPlayer.reset();
            await TrackPlayer.add([...tracks2.Tracks]);
            await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
        }
       
       
    }


const editListPressed = ()=>{
    if(editList){
        setEditList(false)
    }else{
        setEditList(true)
    }
}
const playTheListPressed =async ()=>{
    
    if(playbackState === 'idle' ){
        
        await TrackPlayer.add([...tracks2.Tracks])
        await TrackPlayer.play()
        
    }else {
        
        await TrackPlayer.reset()
        await TrackPlayer.add([...tracks2.Tracks])
        await TrackPlayer.play()
    }
    
}



const styles = StyleSheet.create({
    emptyPlaylistContainer:{
        flex:1, 
        backgroundColor:'#121212',
        justifyContent:'center',
        alignItems:'center'
    },
    container:{
        flex:1, 
        backgroundColor:'#121212',
        alignItems:'center',
        
    },
    playlistContainer:{
        flex:1,
       
    },
    playlistsContainer:{
        paddingVertical:15,
        marginTop:15,
        flexDirection:'row',
        backgroundColor:'#3b3b3b',
        
    },
    header:{
        justifyContent:'center',
        alignItems:'center',
        flex:1/4,

    },
    button:{
        backgroundColor:'#1db954',
        padding:height<=544?5:smallTextSize,
        width:height<=544?100:150,
        borderRadius:50,
        height:height<=544?27:buttonHeight,
        marginHorizontal:10,
        marginTop:10,
    },
    button2:{
        backgroundColor:!editList?'#3b3b3b':'#f94144',
        padding:height<=544?5:smallTextSize,
        width:height<=544?100:150,
        height:height<=544?27:buttonHeight,
        marginTop:10,
        borderRadius:50,
        marginHorizontal:10,
    },
    buttonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        fontSize:height<=544?10:textSize
    },
    imgBack:{
        width:height<=544?35:imageSize,
        height:height<=544?35:imageSize,
        marginHorizontal:10
    },
    titleText:{
        fontSize:height<=544?10:textSize,
        color:'#fff',
        marginVertical:3,
        fontWeight:'bold'
      },
    artistText:{
        fontSize:height<=544?10:smallTextSize,
        color:'#b2b2b2',
        marginVertical:3,
        fontWeight:'bold'
      },
    addSong:{
        width:18,
        height:18,
        
    },
    headerPic:{
        display: 'flex',
        maxWidth: bigImageSize,
        flexDirection: 'row',
        flexWrap:'wrap',
        margin:0,
        padding:0
    },
    images:{
        width:headerImagesSize,
        height:headerImagesSize
    } 
})

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                {headerPic ? 
                <View style={styles.headerPic}>
                    {headerPic.map((imgUrl,index)=>(
                        <FastImage
                        key={index}
                         style={styles.images}
                         source={{
                             uri: imgUrl,
                             priority: FastImage.priority.high,
                         }}
                         resizeMode={FastImage.resizeMode.contain}
                     ></FastImage>
                    ))}
                </View>
                :
                <Image source={require('../shared/icons8-video-playlist-100.png')} style={{width:height<=544?70:bigImageSize,height:height<=544?70:bigImageSize}} />
                }
            </View>
            
            <View style={{marginVertical:10,flexDirection:'row'}}>
                <TouchableOpacity style={styles.button} onPress={playTheListPressed}>
                    <Text style={styles.buttonText}>{SongScreenText[`${language()}-playall`]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={editListPressed}>
                    <Text style={styles.buttonText}>{!editList ? Texts[`${language()}-edit`] : Texts[`${language()}-done`]}</Text>
                </TouchableOpacity>
            </View>

            <View style={{flex:1}}>

            
            <ScrollView >

               {
                   tracks2.Tracks.map((item,index)=>{
                       
                    
                    const Track = item
                    return(
                          
                        <View style={{flex:1,minWidth:'100%',flexDirection:Platform.OS === 'android' && language() === 'en' ? 'row-reverse' :'row',marginVertical:8}} key={index}>
                            <View style={{marginHorizontal:20,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity 
                                onPress={()=>playPressed(item,index)}
                                >
                                    <Icon name='play' style={{color:'#fff',fontSize:height<=544?20:30}} />
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{flex:1,alignItems:Platform.OS === 'android' ? 'flex-start' :'flex-end'}}>
                            
                                <Text style={styles.titleText} >{Track.artist}</Text>
                                <Text style={styles.artistText} >{Track.title}</Text>
                            </View>
                            
                            
                          {
                              editList?

                            <FastImage
                                style={styles.imgBack}
                                source={{
                                    uri: Track.artwork,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            >
                              <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,.5)'}}>
                                  <TouchableOpacity onPress={()=>deletePressed(item)}>
                                      <Icon name='trash-outline' style={{fontSize:height<=544?12:iconSize,color:'#f94144'}} />
                                  </TouchableOpacity>
                                 
                              </View>
                            </FastImage>

                          :
                            <FastImage
                                style={styles.imgBack}
                                source={{
                                    uri: Track.artwork,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            ></FastImage>
                       
                          }
                            
                        </View>

                      
                       )
                   })
               }


            </ScrollView>


            </View>
        </View>

    )
}

