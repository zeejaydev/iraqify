import React,{useState,useCallback,useEffect} from "react";
import { Text, 
  View, StyleSheet,TextInput,
  TouchableWithoutFeedback,Keyboard,TouchableOpacity,Image,ImageBackground,
  ScrollView,ActivityIndicator,Platform,Dimensions} from 'react-native';
import {Icon} from 'native-base';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
// import { TrackContext } from "../shared/Trackcontext";
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image'
import analytics from '@react-native-firebase/analytics';
import { debounce } from "lodash";

const {height}=Dimensions.get('window')

export default function SearchScreen ({navigation}) {
  const handler = useCallback(debounce(sendAnalytics, 500), [searchValue]);

  const [searchValue,setSearchValue]=useState('');

  const playbackState = usePlaybackState();
  const [data,setData]=useState(null)
  const [isLoading,setIsloading]=useState(true)

  useEffect(()=>{
     database().ref('/').once('value').then(snapshot => {
      setData(snapshot.val());
      setIsloading(false)
    }).catch((e)=>{
      console.log(e)
      setIsloading(false)
      setData(null)
    });
  },[])

  async function sendAnalytics (){
    analytics().logSearch({search_term:searchValue})
  }



  const playSelectedSong = async (trackOb)=>{

  
    if(playbackState === 'idle'){
      await TrackPlayer.add({
          id: trackOb.id,
          url: trackOb.url,
          title: trackOb.title,
          artist: trackOb.artist,
          artwork: trackOb.artwork,
          duration: trackOb.duration,
          pitchAlgorithm: 'PITCH_ALGORITHM_MUSIC'
          });
      await TrackPlayer.setVolume(0.5)
      await TrackPlayer.play()
  }else {
      await TrackPlayer.reset()
      await TrackPlayer.add({
        id: trackOb.id,
        url: trackOb.url,
        title: trackOb.title,
        artist: trackOb.artist,
        artwork: trackOb.artwork,
        duration: trackOb.duration,
        pitchAlgorithm: 'PITCH_ALGORITHM_MUSIC'
        });
      await TrackPlayer.setVolume(0.5)
      await TrackPlayer.play()
  }
  }

const handleSearch = (text)=>{
  setSearchValue(text)
  handler()
}

    
    return (
      <TouchableWithoutFeedback onPress={searchValue===''?Keyboard.dismiss:null}>
      <View style={styles.container}>


        <View style={styles.searchBarContainer}>
          <View style={{backgroundColor:'#3b3b3b',height:52,justifyContent:'center'}}>
            <TouchableOpacity>
              <Icon name='search' style={{color:'#fff',fontSize:height<=544?15:25,paddingHorizontal:10}}/>
            </TouchableOpacity>
            
          </View>
          <TextInput 
            style={styles.input} 
            placeholder='ابحث عن اسم اغنيه او فنان' 
            onChangeText={text=>handleSearch(text)}
            value={searchValue}
            placeholderTextColor='#fff'
            
            />
            <View style={{backgroundColor:'#3b3b3b',height:52,justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>setSearchValue('')} >
            <Icon 
              name='close'
              style={{color:'#fff',fontSize:height<=544?15:25,paddingRight:15}}
              />
            </TouchableOpacity>
            </View>
        </View>
        
        
        
        <View  style={styles.searchResaultsContainer}>

        
        <ScrollView
           
        >
          
          {
            isLoading?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size='large' color='#fff' />
            </View>
            :
              
              data.filter((item)=>{
                if(searchValue === ''){
                  return null
                }else if(item.songName.toLowerCase().includes(searchValue.toLocaleLowerCase())){
                  return item
                }else if (item.artistName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())){
                  return item
                }
              }).map((item)=>{

                const TrackObj = {
                  id:item.id,
                  title:item.songName,
                  artist:item.artistName,
                  artwork:item.imgUri,
                  url:item.songUrl,
                  duration:item.duration
                } 

                
                return(
                  
              
                <View onStartShouldSetResponder={() => true} key={item.id} style={styles.results}>
                
                    <View style={{flex:1,marginLeft:20}} >
                        <TouchableOpacity style={{width:'18%'}} onPress={()=>{navigation.navigate('AddToPlaylistScreen',{TrackObj})}} >
                          <Image source={require('../shared/icons8-add-list-60.png')} style={styles.addImg} />
                        </TouchableOpacity>
                    </View>   
                  

                  <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} onPress={()=>playSelectedSong(TrackObj)}>
                  <View style={{alignItems:'flex-end',marginHorizontal:8}}>
                    
                    <Text style={styles.titleText}>{item.songName}</Text>
                    <Text style={styles.artistText}>{item.artistName}</Text>
                    
                  </View>
                  {/* <ImageBackground source={{uri:item.imgUri}} style={styles.resultsImg}> */}
                  <FastImage
                      style={styles.resultsImg}
                      source={{
                          uri: item.imgUri,
                          priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                  >
                  <View style={styles.iconBackground}>
                    <Icon name='play' style={styles.icon} />
                  </View>
                  </FastImage>
                  {/* </ImageBackground> */}
                  </TouchableOpacity>
                    
                </View>
                
                )
                

              })
            
          }
          
           </ScrollView>
          
           </View>
        
      </View>
      </TouchableWithoutFeedback>
    );

  }
const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:Platform.OS==='android'?47:5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    color:'white', 
    backgroundColor:'#121212',
    
  },
  input:{
    color:'#fff',
    borderColor:'#3b3b3b',
    borderWidth:1,
    height:52,
    borderRightWidth:0,
    width:'80%',
    backgroundColor:'#3b3b3b',
    textAlign: 'right',
    paddingHorizontal:15
  },
  title:{
    color:'#fff',
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    textTransform:'uppercase'
  },
  searchBarContainer:{
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  searchResaultsContainer:{
    marginTop:5,
    flex:1,
  },
  results:{
    flex:1/2,
    minWidth:'100%',
    padding:5,
    marginVertical:2,
    borderWidth:1,
    borderColor:'#3b3b3b',
    backgroundColor:'#3b3b3b',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
  },
  resultsImg:{
    width:height<=544?40:70,
    height:height<=544?40:70
  },
  iconBackground:{
    height:height<=544?40:70,
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  icon:{
    color:'rgba(255,255,255,0.7)',
    fontSize:height<=544?15:30
  },
  addImg:{
    width:height<=544?15:25,
    height:height<=544?15:25
  },
  titleText:{
    fontSize:height<=544?10:15,
    color:'#fff',
    marginVertical:3,
    fontWeight:'bold'
  },
  artistText:{
    fontSize:height<=544?10:15,
    color:'#b2b2b2',
    marginVertical:3,
    fontWeight:'bold'
  }
  
})
