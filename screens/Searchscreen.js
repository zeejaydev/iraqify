import React,{useState,useCallback,useEffect} from "react";
import { Text, 
  View, StyleSheet,TextInput,
  TouchableWithoutFeedback,Keyboard,TouchableOpacity,Image,
  ScrollView,ActivityIndicator,Platform,Dimensions} from 'react-native';
  import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { usePlaybackState }  from 'react-native-track-player';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image'
import analytics from '@react-native-firebase/analytics';
import { debounce } from "lodash";
import { Texts } from "../types";
import { language } from "../utils/langCheck";

const {height}=Dimensions.get('window');

const addImageSize = height > 1000 ? 33 : 25;
const textSize = height > 1000 ? 18 : 15;
const imageSize = height > 1000 ? 90 : 70;
const bgSize = height > 1000 ? 90 : 70 ;
const inpuTextSize = height > 1000 ? 20 : 15;

const en = language() === 'en' ? true : false;

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
            placeholder={Texts[`${language()}-search`]}
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
            <View style={styles.loading}>
              <ActivityIndicator size='large' color='#fff' />
            </View>
            :
              
              data.filter((item)=>{
                if(searchValue === ''){
                  return null
                }else if(item.songName.toLowerCase().includes(searchValue.toLocaleLowerCase()) || item.altSongName?.toLowerCase().includes(searchValue.toLocaleLowerCase())){
                  return item
                }else if (item.artistName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || item.altArtistName?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())){
                  return item
                }
              }).map((item)=>{
                //Futuer update
                // const artistName = item.altArtistName && en ? item.altArtistName : item.artistName;
                // const songName = item.altSongName && en ? item.altSongName : item.songName;
                const artistName = item.artistName;
                const songName = item.songName;

                const TrackObj = {
                  id:item.id,
                  title:songName,
                  artist:artistName,
                  artwork:item.imgUri,
                  url:item.songUrl,
                  duration:item.duration
                } 

                
                return(
                  
              
                <View onStartShouldSetResponder={() => true} key={item.id} style={styles.results}>
                
                    <View style={{marginLeft:Platform.OS === 'android' ? 0 : en ? 0 : 20,marginRight: Platform.OS === 'android' ? 20 : en ? 20 : 0}} >
                        <TouchableOpacity style={{width:'18%'}} onPress={()=>{navigation.navigate('AddToPlaylistScreen',{TrackObj})}} >
                          <Image source={require('../shared/icons8-add-list-60.png')} style={styles.addImg} />
                        </TouchableOpacity>
                    </View>   
                  

                  <TouchableOpacity 
                    style={{alignItems:'center',
                    flexDirection:Platform.OS === 'android' ? 'row-reverse' : en ?'row-reverse':'row',
                    flex:1,
                    justifyContent:'flex-end'}} 
                    onPress={()=>playSelectedSong(TrackObj)}>
                  <View style={{alignItems: Platform.OS === 'android' ? 'flex-start' : en ?'flex-start':'flex-end',marginHorizontal:8}}>
                    
                    <Text style={styles.titleText}>{songName}</Text>
                    <Text style={styles.artistText}>{artistName}</Text>
                    
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
    textAlign: Platform.OS === 'android' && en ? 'left' :'right' ,
    paddingHorizontal:15,
    fontSize:inpuTextSize
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
  loading:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    minWidth: '100%',
    minHeight: '100%'
  },
  results:{
    flex:1/2,
    minWidth:'100%',
    padding:5,
    marginVertical:2,
    borderWidth:1,
    borderColor:'#3b3b3b',
    backgroundColor:'#3b3b3b',
    flexDirection: Platform.OS === 'android' ? 'row-reverse' : en ?'row-reverse':'row',
    alignItems:'center',
    justifyContent:'flex-end',
  },
  resultsImg:{
    width:height<=544?40:imageSize,
    height:height<=544?40:imageSize,
  },
  iconBackground:{
    height:height<=544?40:bgSize,
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  icon:{
    color:'rgba(255,255,255,0.7)',
    fontSize:height<=544?15:30
  },
  addImg:{
    width:height<=544?15:addImageSize,
    height:height<=544?15:addImageSize
  },
  titleText:{
    fontSize:height<=544?10:textSize,
    color:'#fff',
    marginVertical:3,
    fontWeight:'bold',
    textTransform: 'capitalize'
  },
  artistText:{
    fontSize:height<=544?10:textSize,
    color:'#b2b2b2',
    marginVertical:3,
    fontWeight:'bold',
    textTransform: 'capitalize'
  }
  
})
