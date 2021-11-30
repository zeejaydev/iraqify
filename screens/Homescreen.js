import React,{useEffect,useState} from "react";
import { Text, View,ScrollView,SafeAreaView,StyleSheet,TouchableOpacity,ActivityIndicator,Dimensions} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { Icon } from "native-base";
import TextTicker from 'react-native-text-ticker';
import FastImage from 'react-native-fast-image'

const {height,width}=Dimensions.get('window')

export default function HomeScreen ({navigation}) {

  const [catName,setCatName]=useState([])
  const [section1,setSection1]=useState([])
  const [section2,setSection2]=useState([])
  const [section3,setSection3]=useState([])
  const [section4,setSection4]=useState([])
  const [isLoading,setIsLoading]=useState(true)
  const [networkError,setNetworkError]=useState(false)
  const [premadeList,setPreMadeList]=useState([])

  const PageRefresh = ()=>{
    setNetworkError(false)
    setIsLoading(true)
    const firstSection = 'https://iraqify-music.com/wp-json/wp/v2/posts?categories=2';
    const secSection ='https://iraqify-music.com/wp-json/wp/v2/posts?categories=1';
    const thirdSection ='https://iraqify-music.com/wp-json/wp/v2/posts?categories=7';
    const forthSection = 'https://iraqify-music.com/wp-json/wp/v2/posts?categories=8';
    const catNames = 'https://iraqify-music.com/wp-json/wp/v2/categories?orderby=id';
    const premade = 'https://iraqify-music.com/wp-json/wp/v2/top_songs?orderby=id';

    const getSection1=axios.get(firstSection)
    const getSection2=axios.get(secSection)
    const getSection3=axios.get(thirdSection)
    const getSection4=axios.get(forthSection)
    const getCatNames=axios.get(catNames)
    const getPreMade=axios.get(premade)
     

    axios.all([getSection1,getSection2,getSection3,getSection4,getCatNames,getPreMade]).then(
      axios.spread((...allData)=>{

        const s1 = allData[0].data
        const s2 = allData[1].data
        const s3 = allData[2].data
        const s4 = allData[3].data
        const cat = allData[4].data
        const pre = allData[5].data

        setSection1(s1)
        setSection2(s2)
        setSection3(s3)
        setSection4(s4)
        setCatName(cat)
        setPreMadeList(pre)
        setIsLoading(false)
      })
    ).catch((e)=>{
      if(e.message==='Network Error'){
        console.log('network error')
        setIsLoading(false)
        setNetworkError(true)
      }else{
        console.log(e)
        setIsLoading(false)
      }
    })
  }



  useEffect(()=>{

    requestUserPermission()

    const firstSection = 'https://iraqify-music.com/wp-json/wp/v2/posts?categories=2';
    const secSection ='https://iraqify-music.com/wp-json/wp/v2/posts?categories=1';
    const thirdSection ='https://iraqify-music.com/wp-json/wp/v2/posts?categories=7';
    const forthSection = 'https://iraqify-music.com/wp-json/wp/v2/posts?categories=8';
    const catNames = 'https://iraqify-music.com/wp-json/wp/v2/categories?orderby=id';
    const premade = 'https://iraqify-music.com/wp-json/wp/v2/top_songs?orderby=id';

    const getSection1=axios.get(firstSection)
    const getSection2=axios.get(secSection)
    const getSection3=axios.get(thirdSection)
    const getSection4=axios.get(forthSection)
    const getCatNames=axios.get(catNames)
    const getPreMade=axios.get(premade)
     

    axios.all([getSection1,getSection2,getSection3,getSection4,getCatNames,getPreMade]).then(
      axios.spread((...allData)=>{

        const s1 = allData[0].data
        const s2 = allData[1].data
        const s3 = allData[2].data
        const s4 = allData[3].data
        const cat = allData[4].data
        const pre = allData[5].data

        setSection1(s1)
        setSection2(s2)
        setSection3(s3)
        setSection4(s4)
        setCatName(cat)
        setPreMadeList(pre)
        setIsLoading(false)
      })
    ).catch((e)=>{
      if(e.message==='Network Error'){
        console.log('network error')
        setIsLoading(false)
        setNetworkError(true)
      }else{
        console.log(e)
        setIsLoading(false)
      }
    })

  },[])



  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      // const token = await messaging().getToken()
      
      // console.log(token)
    }
  }



  if(isLoading)return<View style={styles.container}><ActivityIndicator color='#fff' size='large' style={{textAlign:'center'}} /></View>
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
    )
  }
    return (
          <View style={styles.container}>

            <SafeAreaView>
              <ScrollView
                showsVerticalScrollIndicator={false}
              >
            <View style={{flex:1/3}}>
              <Text style={styles.title}>قوائم تشغيل جاهزه</Text>
              
              <ScrollView 
              style={{flex:1}}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                
                {
                 
                  premadeList.map((item)=>{
                    const name = item.name
                    const img = item.description
                    return(
                      <TouchableOpacity onPress={()=>{navigation.navigate('AlbumScreen',{name,img})}} key={item.id}>
                        
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: img,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.text}>{name}</Text>
                        
                      </TouchableOpacity>
                    )
                  })
                }
                
              </ScrollView>


            </View>
            <View style={{flex:1/3,alignItems:'center'}}>
              <Text style={styles.title}> {catName.length==0?'':catName[1].name} </Text>
              
              <ScrollView 
              style={{flex:1}}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                
                {
                 
                  section1.map((item)=>{
                    const song = item.title.rendered;
                    const img = item.acf.artwotk;
                    const artist = item.acf.artist_name;
                    const url = item.acf.song_url;
                    const id=item.acf.id;
                    const duration = parseInt(item.acf.duration);

                    return(
                      <TouchableOpacity onPress={()=>{navigation.navigate('SongScreen',{song,img,artist,url,duration,id})}} key={item.id}>
                        {/* <Image source={{uri:img}} style={styles.img} /> */}
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: img,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <View style={{width:height<=667?90:130,alignItems:'center'}}>
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
                        {artist}
                      </TextTicker>
                      <Text style={styles.text}>{song}</Text>
                      </View>
                        
                        {/* <Text style={styles.text}>{artist}</Text> */}
                        
                      </TouchableOpacity>
                    )
                  })
                }
                
              </ScrollView>


            </View>
            <View style={{flex:1/3,alignItems:'center'}}>
              <Text style={styles.title}>{catName.length==0?'':catName[0].name}</Text>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                >
              {
 
                section2.map((item)=>{
                    const song = item.title.rendered;
                    const img = item.acf.artwotk;
                    const artist = item.acf.artist_name;
                    const url = item.acf.song_url;
                    const id=item.acf.id;
                    const duration = parseInt(item.acf.duration);
                    return(
                      <TouchableOpacity onPress={()=>{navigation.navigate('SongScreen',{img,artist,song,url,duration,id})}} key={item.id}>
                        {/* <Image source={{uri:img}} style={styles.img} /> */}
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: img,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.text}>{artist} </Text>
                        <Text style={styles.text}>{song}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </ScrollView>
            </View>
            <View style={{flex:1/3}}>
            <Text style={styles.title}>{catName.length==0?'':catName[2].name}</Text>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
              >
              {
                  section3.map((item)=>{
                    const song = item.title.rendered;
                    const img = item.acf.artwotk;
                    const artist = item.acf.artist_name;
                    const url = item.acf.song_url;
                    const id=item.acf.id;
                    const duration = parseInt(item.acf.duration);
                    return(
                      <TouchableOpacity onPress={()=>{navigation.navigate('SongScreen',{img,artist,song,url,duration,id})}} key={item.id}>
                        {/* <Image source={{uri:img}} style={styles.img} /> */}
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: img,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.text}>{artist}</Text>
                        <Text style={styles.text}>{song}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </ScrollView>
            </View>
            <View style={{flex:1/3}}>
              <Text style={styles.title}>{catName.length==0?'':catName[3].name}</Text>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
              >
              {
                  section4.map((item)=>{
                    const song = item.title.rendered;
                    const img = item.acf.artwotk;
                    const artist = item.acf.artist_name;
                    const url = item.acf.song_url;
                    const id=item.acf.id;
                    const duration = parseInt(item.acf.duration);
                    return(
                      <TouchableOpacity onPress={()=>{navigation.navigate('SongScreen',{img,artist,song,url,duration,id})}} key={item.id}>
                        {/* <Image source={{uri:img}} style={styles.img} /> */}
                        <FastImage
                            style={styles.img}
                            source={{
                                uri: img,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.text}>{artist}</Text>
                        <Text style={styles.text}>{song}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </ScrollView>
            </View>
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
    fontSize:height<=667?15:20,
    fontWeight:'bold',
    textTransform:'capitalize',
    marginVertical:height<=667?10:15,
    textAlign:'center'
  },
  img:{
    width:height<=667?90:135,
    height:height<=667?90:135,
    marginHorizontal:height<540?5:10,
    marginVertical:2
  },
  text:{
    fontSize:height<=667?10:13,
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
  }
})