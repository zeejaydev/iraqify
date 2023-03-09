import React,{useEffect,useState,useContext} from "react";
import { Text, View, StyleSheet,TouchableOpacity,ScrollView,Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import FastImage from 'react-native-fast-image';
import { QueueManagementContext } from "../shared/queueManagementContext";
import { language } from "../utils/langCheck";
import { SongScreenText } from "../types";

const {height,width}=Dimensions.get('window');

const bigImageSize = height > 1000 ? 200 : 150;
const imageSize = height > 1000 ? 80 : 50;
const iconSize = height > 1000 ? 50 : 30;
const textSize = height > 1000 ? 17 : 12;
const titleSize = height > 1000 ? 20 : 17;

export default function AlbumScreen ({route}) {
  const [data,setData]=useState([])
  const playbackState = usePlaybackState();
  const [queManagement,setQueManagement]=useContext(QueueManagementContext);

  useEffect(()=>{
    firestore().collection(route.params.name).get().then((querSnapshot)=>{
      querSnapshot.forEach((doc)=>{
        setData(doc.data())
      })
    });
  },[])
    
  const playTheListPressed =async ()=>{

    if(playbackState === 'idle' ){
        await TrackPlayer.add([...data.Tracks])
        await TrackPlayer.play()
        
    }else {
        await TrackPlayer.reset()
        await TrackPlayer.add([...data.Tracks])
        await TrackPlayer.play()
    }
    
}


const playPressed = async(item,i)=>{
        
  const que = await TrackPlayer.getQueue();
  const same = que.find((x,index)=>item.id===x.id && i ===index);
  if(playbackState === 'idle'){
      
      await TrackPlayer.add([...data.Tracks]);
      await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
      

  }else if(que.length > 1){
      //que not shuffled
      if(queManagement.shuffled){
        //if the que is shuffled
        await TrackPlayer.reset();
        await TrackPlayer.add([...data.Tracks]);
        await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
        setQueManagement({...queManagement,shuffled:false,shuffle:1})
      }else if (same){
          await TrackPlayer.skip(i).then(()=>TrackPlayer.play()).catch(async (e)=>{
              if(e.message ==='Given track ID was not found in queue'){
                  await TrackPlayer.reset();
                  await TrackPlayer.add([...data.Tracks]);
                  await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
              }else{
                  console.log(e)
              }
          })
      }else{
        await TrackPlayer.reset();
        await TrackPlayer.add([...data.Tracks]);
        await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
        setQueManagement({...queManagement,shuffled:false,shuffle:1})
    }
  }else{
      await TrackPlayer.reset();
      await TrackPlayer.add([...data.Tracks]);
      await TrackPlayer.skip(i).then(()=>TrackPlayer.play())
  }
 
 
}
    return (
      <ScrollView style={{backgroundColor:'#121212'}}>
      <View style={styles.container}>

        <View>
          {/* <Image source={{uri:route.params.img}} style={{width:150,height:150}}/> */}
          <FastImage
            style={{width:bigImageSize,height:bigImageSize}}
            source={{
                uri: route.params.img,
                priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        
        <View style={{marginVertical:10,flexDirection:'row'}}>
                <TouchableOpacity style={styles.button} 
                onPress={playTheListPressed}
                >
                    <Text style={styles.buttonText}>{SongScreenText[`${language()}-playall`]}</Text>
                </TouchableOpacity>
        </View>

        <View style={{marginTop:10,flex:1}}>
          
          {
            data.length==0?null
            :
            data.Tracks.map((item,index)=>{

              return(
                <View key={index} style={styles.item}>
                    
                    <View style={{flex:1,minWidth:'100%',flexDirection:'row'}} key={index}>
                            <View style={{marginLeft:20}}>
                                <TouchableOpacity 
                                onPress={()=>playPressed(item,index)}
                                >
                                    <Icon name='play' style={{color:'#fff'}} size={height<=540?20:iconSize} />
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                            
                                <Text style={{color:'#fff',fontWeight:'bold',fontSize:titleSize}} >{item.title}</Text>
                                <Text style={{color:'#6d6d6d',fontWeight:'bold',fontSize:textSize}} >{item.artist}</Text>
                            </View>
                            
                            <FastImage
                              style={{width:imageSize,height:imageSize,marginRight:10}}
                              source={{
                                  uri: item.artwork,
                                  priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>

                </View>
              )
            })
          }
          
        </View>


      </View>
      </ScrollView>
    );

  }

  const styles = StyleSheet.create({
    container:{
      flex:1,
      alignItems: 'center',
      color:'white', 
      backgroundColor:'#121212',
    },
    title:{
      color:'#1db954',
      textAlign:'center',
      paddingBottom:15,
      fontSize:20,
      fontWeight:'bold',
      textTransform:'uppercase'
    },
    item:{
      flex:1,
      minWidth:'100%',
      flexDirection:'row',
      marginVertical:8,
      justifyContent:'flex-end'
    },
    button:{
      backgroundColor:'#1db954',
      padding:13,
      width:180,
      marginTop:10,
      borderRadius:50,
      marginHorizontal:10
  },
buttonText:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize:titleSize,
      textTransform:'uppercase'
  }
  })
  