import React from 'react';
import { Easing,StyleSheet,View,Text,Platform } from "react-native";
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import PlaylistScreen from "../screens/Playlistscreen";
import MyPlaylist from '../screens/Myplaylist';
import { Texts } from '../types';
import { language } from '../utils/langCheck';




const Stack = createStackNavigator();

// const closingConfig = {
//     animation:'timing',
//     config:{
//         duration:400,
//         easing:Easing.linear
//     }

// }

const Header = ()=>{
   return(
       <View style={{height:Platform.OS==='android'?80:60,backgroundColor:'#121212',justifyContent:'flex-end',alignItems:'center'}}>
           <Text style={{color:'#fff',fontWeight:'bold',fontSize:20,textTransform:'capitalize'}}>{Texts[`${language()}-library`]}</Text>
       </View>
   ) 
}

export default function PlaylistStack(){
    return (
        <Stack.Navigator 
            
            screenOptions={{
                headerMode:'screen',
                gestureEnabled:true,
                gestureDirection:'horizontal',
                // transitionSpec: {
                //     open: TransitionSpecs.RevealFromBottomAndroidSpec,
                //     close: closingConfig,
                // },
                cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
            }}
            
        >
          <Stack.Screen 
            name="My Library"
             
            component={PlaylistScreen}
            options={{
                header:()=>{return(<Header/>)}
              }}
        />
  
        <Stack.Screen 
            name="Playlist" 
            component={MyPlaylist}
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
    }
    })