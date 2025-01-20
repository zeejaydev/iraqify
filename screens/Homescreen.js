import React,{useEffect,useState} from "react";
import { Text, View,ScrollView,SafeAreaView,
        StyleSheet,TouchableOpacity,ActivityIndicator,
        Dimensions } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import TextTicker from 'react-native-text-ticker';
import FastImage from 'react-native-fast-image';
import { HomePageTitles } from "../types";
import { language } from "../utils/langCheck";

const {height,width}=Dimensions.get('window');

const imageSize = height > 1000 ? 200 : 135;
const textSize = height > 1000 ? 18 : 13;
const titleSize = height > 1000 ? 27 : 20;
const tuckedTitle = height > 1000 ? 210 : 135;

export default function HomeScreen ({navigation}) {

  const [isLoading,setIsLoading]=useState(true);
  const [networkError,setNetworkError]=useState(false);
  const [allData,setAllData]=useState([]);

  const PageRefresh = ()=>{
    setNetworkError(false);
    setIsLoading(true);
     
    axios.get('https://iraqify-backend.com/api/getdoc',{timeout:30000}).then(
      (allData)=>{
        console.log('gotdata');
        setAllData(allData.data);
        setIsLoading(false);
      }
    ).catch((e)=>{
      if(e.message==='Network Error'){
        console.log('network error');
        setIsLoading(false);
        setNetworkError(true);
        setAllData([]);
      }else if(e.message==='timeout of 30000ms exceeded') {
        console.log('timeout of 30sec exceeded');
        setIsLoading(false);
        setNetworkError(true);
        setAllData([]);
      }else{
        console.log(e);
        setIsLoading(false);
      }
    });
  };



  useEffect(()=>{
    axios.get('https://iraqify-backend.com/api/getdoc',{timeout:30000}).then(
      (allData)=>{
        console.log('gotdata');
        setAllData(allData.data);
        setIsLoading(false);
      }
    ).catch((e)=>{
      if(e.message==='Network Error'){
        console.log('network error');
        setIsLoading(false);
        setNetworkError(true);
        setAllData([]);
      }else if(e.message==='timeout of 30000ms exceeded') {
        console.log('timeout of 30sec exceeded');
        setIsLoading(false);
        setNetworkError(true);
        setAllData([]);
      }else{
        console.log(e);
        setIsLoading(false);
      }
    });
    requestUserPermission();
  },[]);



  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      const token = await messaging().getToken();
      console.log(token);
    }
  }

 

  if(isLoading)return<View style={styles.container}><ActivityIndicator color='#fff' size='large' style={{textAlign:'center'}} /></View>;
  if(networkError){
    return(
    <View style={{...styles.container}}>
      <View style={{justifyContent:'center',alignItems:'center',paddingBottom:15}}>
      <Icon name='wifi' style={{color:'#fff',fontSize:60}} />
      <Text style={{color:'#fff'}} >No Connection</Text>
      </View>
     
      <TouchableOpacity onPress={PageRefresh} style={{backgroundColor:'#3b3b3b',padding:12,borderRadius:8}}>
        <Text style={{color:'#fff'}} >Try Again</Text>
      </TouchableOpacity>
    </View>
    );
  }
    return (
          <View style={styles.container}>
            <SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
              >
              {
                allData.map((cat,index)=>{                
                  if(cat.playlists.length > 0){
                    return( 
                      <View style={{flex:1/3}} key={index}>
                        <Text style={styles.title}>{HomePageTitles[`${language()}-${cat.name}`]}</Text>
                        <ScrollView style={{flex:1}} horizontal showsHorizontalScrollIndicator={false}>
                          {
                            cat.playlists.map( (item,i)=>{
                              const img=item.artwork;
                              const name = item.playlist_name;
                              const altName = item.altName || '';
                              return(
                                <TouchableOpacity onPress={()=>{navigation.navigate('AlbumScreen',{name,img});}} key={i}>
                                  <FastImage
                                      style={styles.img}
                                      source={{
                                          uri: img,
                                          priority: FastImage.priority.high,
                                      }}
                                      resizeMode={FastImage.resizeMode.contain}
                                  />
                                  {/* Future update
                                    <Text style={styles.text}>{altName && language() === 'en' ? altName : name}</Text> 
                                   */}
                                  <Text style={styles.text}>{name}</Text>
                                </TouchableOpacity>
                              );
                            }).reverse()
                          }
                        </ScrollView>
                      </View>
                    );
                  }
                  return(
                        <View style={{flex:1/3}} key={index}>
                          <Text style={styles.title}>{HomePageTitles[`${language()}-${cat.name}`]}</Text>
                          <ScrollView style={{flex:1}} horizontal showsHorizontalScrollIndicator={false}>
                            {
                              cat.tracks.map( (item,i)=>{
                                const song = item.title;
                                const img = item.artwotk;
                                const artist = item.artist_name;
                                const url = item.song_url;
                                const id=item.id;
                                const duration = item.duration;
                                const altArtistName = item.altArtistName || ""
                                const altSongTitle = item.altSongTitle || ""
                                return(
                                  <TouchableOpacity onPress={()=>{navigation.navigate('SongScreen',{song,img,artist,url,duration,id,altArtistName,altSongTitle});}} key={i}>
                                    <FastImage
                                      style={styles.img}
                                      source={{
                                          uri: img,
                                          priority: FastImage.priority.high,
                                      }}
                                      resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <View style={{width:height<=667?90:tuckedTitle,alignItems:'center'}}>
                                      <TextTicker
                                        style={styles.text}
                                        duration={4000}
                                        animationType='bounce'
                                        loop
                                        scroll={false}
                                        isRTL
                                        bounce
                                        repeatSpacer={10}
                                        marqueeDelay={3000}
                                      >
                                      {/* {altArtistName && language() === 'en' ? altArtistName : artist} */}
                                      {artist}
                                      </TextTicker>
                                      {/* <Text style={styles.text}>{altSongTitle && language() === 'en' ? altSongTitle : song}</Text> */}
                                      <Text style={styles.text}>{song}</Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              }).reverse()
                            }
                          </ScrollView>
                        </View>  
                    );
                }).reverse()
              }
              </ScrollView>
            </SafeAreaView>
          </View>
    );

  }

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
     alignItems: 'center',
     backgroundColor:'#121212',
  },
  title:{
    color:'white',
    fontSize:height<=667?15:titleSize,
    fontWeight:'bold',
    textTransform:'capitalize',
    marginVertical:height<=667?10:15,
    textAlign:'center'
  },
  img:{
    width:height<=667?90:imageSize,
    height:height<=667?90:imageSize,
    marginHorizontal:height<540?5:10,
    marginVertical:2
  },
  text:{
    fontSize:height<=667?10:textSize,
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
    textTransform:'capitalize'
  }
});