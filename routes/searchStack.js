import React from 'react';
import { Easing,StyleSheet} from "react-native";
import { createStackNavigator,TransitionSpecs,CardStyleInterpolators } from '@react-navigation/stack';
import SearchScreen from "../screens/Searchscreen";
import AddToPlaylist from '../screens/AddToPlaylistscreen';
import {Icon} from 'native-base';



const Stack = createStackNavigator();

const closingConfig = {
    animation:'timing',
    config:{
        duration:400,
        easing:Easing.linear
    }

}

export default function SearchStack(){
    return (
        <Stack.Navigator 
            headerMode='screen'
            screenOptions={{
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
            name="Search" 
            component={SearchScreen}
            options={{
                // header:()=>{return(<Header/>)}
                headerShown:false
              }}
        />
  
        <Stack.Screen 
            name="AddToPlaylistScreen" 
            component={AddToPlaylist}
            options={{
                // headerBackImage:()=>{return(<Icon name='chevron-down-outline' style={{marginLeft:10,color:'#fff'}} />)},
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

        
        </Stack.Navigator>
      );
}
const styles = StyleSheet.create({
    icon:{
        marginLeft:10,
        color:'#fff',    
    }
    })