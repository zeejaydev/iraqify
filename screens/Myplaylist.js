import React,{useEffect,useState} from "react";
import { Text, View,StyleSheet,ScrollView,TouchableOpacity,ImageBackground,Image,Dimensions} from 'react-native';
import {Icon} from 'native-base';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import FastImage from 'react-native-fast-image'

const {height}=Dimensions.get('window')

export default function MyPlaylist ({route}) {
    const user = firebase.auth().currentUser;
    const PlaylistName = route.params.item;
    const playbackState = usePlaybackState();
    const [tracks2,settracks2] = useState()
    const [docId,setDocId]=useState()
    const [editList,setEditList]=useState(false)

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
   

    const deletePressed = (item)=>{
        firebase.firestore().collection('Users').doc(user.uid).collection('Playlists').doc(docId).update({
            Tracks : firebase.firestore.FieldValue.arrayRemove(item)
        })
    }


    

    if(tracks2== undefined || tracks2== null || tracks2.Tracks.length == 0)return<View style={{
        flex:1, 
        backgroundColor:'#121212',
        justifyContent:'center',
        alignItems:'center'
    }}>
        <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center',lineHeight:20,marginVertical:10}}>قم باضافة اغاني لهذه القائمه عن طريق البحث او القائمه الرئيسيه
        ثم الضغط على 
        </Text>
        <Image source={require('../shared/icons8-add-list-60.png')} style={{width:18,height:18}}/>
        <Text style={{color:'#fff',fontWeight:'bold',textAlign:'center',lineHeight:20,marginVertical:10}}>
            سترى اسم هذه القائمة ثم اضغط على
        </Text>
        <Icon name='add' style={{color:'#fff',fontSize:20}} />
    </View>
    
    const playPressed = async(item)=>{
        
        const que = await TrackPlayer.getQueue();
        
        if(playbackState == null){
            
            await TrackPlayer.add([...tracks2.Tracks]);
            await TrackPlayer.skip(item.id).then(()=>TrackPlayer.play())

        }else if(que.length > 1){
            
            await TrackPlayer.skip(item.id).then(()=>TrackPlayer.play()).catch(async (e)=>{
                
                if(e.message ==='Given track ID was not found in queue'){
                    await TrackPlayer.reset();
                    await TrackPlayer.add([...tracks2.Tracks]);
                    await TrackPlayer.skip(item.id).then(()=>TrackPlayer.play())
                }else{
                    console.log(e)
                }

            } )
        }else{
            await TrackPlayer.reset();
            await TrackPlayer.add([...tracks2.Tracks]);
            await TrackPlayer.skip(item.id).then(()=>TrackPlayer.play())
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

    if(playbackState == null ){
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
        padding:height<=544?5:13,
        width:height<=544?100:150,
        borderRadius:50,
        height:height<=544?27:45,
        marginHorizontal:10,
        marginTop:10,
    },
    button2:{
        backgroundColor:!editList?'#3b3b3b':'#f94144',
        padding:height<=544?5:13,
        width:height<=544?100:150,
        height:height<=544?27:45,
        marginTop:10,
        borderRadius:50,
        marginHorizontal:10,
    },
    buttonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:15,
        textTransform:'uppercase',
        fontSize:height<=544?10:15
    },
    imgBack:{
        width:height<=544?35:50,
        height:height<=544?35:50,
        marginRight:10
    },
    titleText:{
        fontSize:height<=544?10:15,
        color:'#fff',
        marginVertical:3,
        fontWeight:'bold'
      },
      artistText:{
        fontSize:height<=544?10:13,
        color:'#b2b2b2',
        marginVertical:3,
        fontWeight:'bold'
      },
      addSong:{
        width:18,
        height:18,
        
    }, 
})

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../shared/icons8-video-playlist-100.png')} style={{width:height<=544?70:100,height:height<=544?70:100}} />
            </View>
            
            <View style={{marginVertical:10,flexDirection:'row'}}>
                <TouchableOpacity style={styles.button} onPress={playTheListPressed}>
                    <Text style={styles.buttonText}>تشغيل القائمه</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={editListPressed}>
                    <Text style={styles.buttonText}>{!editList ? 'تعديل' : 'انهاء'}</Text>
                </TouchableOpacity>
            </View>

            <View style={{flex:1}}>

            
            <ScrollView >

               {
                   tracks2.Tracks.map((item,index)=>{
                       
                    
                    const Track = item
                    return(
                          
                        <View style={{flex:1,minWidth:'100%',flexDirection:'row',marginVertical:8}} key={index}>
                            <View style={{marginLeft:20,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity 
                                onPress={()=>playPressed(item)}
                                >
                                    <Icon name='play' style={{color:'#fff',fontSize:height<=544?20:30}} />
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                            
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
                                      <Icon name='trash-outline' style={{fontSize:height<=544?12:18,color:'#f94144'}} />
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

