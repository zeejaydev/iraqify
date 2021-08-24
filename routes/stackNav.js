import React,{useState,useEffect} from 'react';
import { Easing,StyleSheet,View,Text,Image,TouchableOpacity,Dimensions} from "react-native";
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import SongScreen from '../screens/Songscreen';
import HomeScreen from "../screens/Homescreen";
import AlbumScreen from '../screens/Albumscreen';
import AddToPlaylist1 from '../screens/AddToPlaylistscreen1';
import {Icon} from 'native-base';
import TrackPlayer  from 'react-native-track-player';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LoginManager } from 'react-native-fbsdk';
import FastImage from 'react-native-fast-image';

const Stack = createStackNavigator();
const {height}=Dimensions.get('window')



export default function StackNav({navigation}){

    const [username,setusername] = useState({})
    const user = auth().currentUser


    useEffect(()=>{
        
        const subscribe = firestore().collection('Users').doc(user.uid).onSnapshot((querySnapshot)=> {
           
            try {
                if(querySnapshot.data()){
                    setusername(querySnapshot.data())
                    
                }else{
                    setusername('')
                    
                }
            } catch (error) {
                console.log(error)
            }
            
        });
        

      return ()=>subscribe()
    },[])

    function HeaderLeft (){
        return(
            <View
            // onPress={()=>navigation.navigate('Profile')} 
            style={{marginLeft:10}}
            >
         

                <View style={{flexDirection:'row',alignItems:'center'}} >
                    {user.photoURL?
                     <FastImage
                     style={styles.userImg}
                     source={{
                         uri: `${user.photoURL}?width=200`,
                         priority: FastImage.priority.high,
                     }}
                     resizeMode={FastImage.resizeMode.contain}
                 />
                    :<Icon name='person-circle-outline' style={styles.userIcon}/>}
                    <Text style={styles.userGreetings}>hello {username.name}</Text>
                </View>
        
            </View>
        )
    }

    const StopSongs = ()=>{
        TrackPlayer.stop()
        TrackPlayer.destroy()
    }


    function HeaderRight (){
        return(
            <TouchableOpacity onPress={()=>{auth().signOut().then(()=>StopSongs(),LoginManager.logOut() )}} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    
                    <Text style={styles.userSignOutText}>خروج</Text>
                    <Icon name='log-out-outline' style={styles.userSignOutIcon}/>
                </View>
                
            </TouchableOpacity>
        )
    }



    return (
        <Stack.Navigator 
            
            screenOptions={{
                headerMode:'screen',
                gestureEnabled:true,
                gestureDirection:'horizontal',
                cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
            }}
            
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
                headerShown:true,
                headerTintColor:'#fff',
                headerLeft:()=>{return(<HeaderLeft/>)},
                headerRight:()=>{return(<HeaderRight/>)},
                headerTitle:'',
                headerStyle: {
                    height:height<=667?70:85,
                    backgroundColor:'#212121',
                    borderWidth:0,
                    borderColor:'#121212',
                    shadowColor:'none'
                  }
              }}
        />
          <Stack.Screen 
            name="SongScreen" 
            component={SongScreen}
            options={{
                headerBackImage:()=>{return(<Icon name='chevron-back-outline' style={styles.icon} />)},
                headerBackTitleVisible:false,
                headerTitle:'',
                headerStyle:{
                    backgroundColor:'#121212',
                    shadowColor:'none',
                    borderBottomColor:'#121212'
                }
              }}
        />
        
        <Stack.Screen 
            name="AddToPlaylistScreen1" 
            component={AddToPlaylist1}
            options={{
                headerTintColor:'#fff',
                headerBackTitleVisible:false,
                headerTitle:'قوائم التشغيل',
                headerTitleAlign:'center',
                headerTitleStyle:{
                    color:'#b3b3b3',
                    fontSize:15,
                    fontWeight:'bold'
                },
              headerStyle:{
                  backgroundColor:'#121212',
                  shadowColor:'none',
              }
              }}
        />
        <Stack.Screen 
            name="AlbumScreen" 
            component={AlbumScreen}
            options={{
                headerTintColor:'#fff',
                headerBackTitleVisible:false,
                headerTitle:'',
                headerTitleAlign:'center',
                headerTitleStyle:{
                    color:'#b3b3b3',
                    fontSize:15,
                    fontWeight:'bold'
                },
              headerStyle:{
                  backgroundColor:'#121212',
                  shadowColor:'none',
                  borderBottomColor:'none',
                  borderBottomWidth:0,
              }
              }} 
        />
        
        </Stack.Navigator>
      );
}
const styles = StyleSheet.create({
    icon:{
        marginLeft:10,
        color:'#fff',    
    },
    userImg:{
        width:height<=540?25:45,
        height:height<=540?25:45,
        borderRadius:50
        
    },
    userIcon:{
        fontSize:height<=540?25:40,
        color:'#fff'
    },
    userSignOutIcon:{
        color:'#fff',
        fontSize:height<=540?17:25,
        marginRight:5
    },
    userSignOutText:{
        color:'#fff',
        marginRight:5,
        textTransform:'capitalize',
        fontWeight:'bold',
        fontSize:height<=540?9:15,
    },
    userGreetings:{
        fontSize:height<=540?9:15,
        color:'#fff',
        marginLeft:5,
        textTransform:'capitalize',
        fontWeight:'bold'
    }
    })