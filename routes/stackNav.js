import React from 'react';
import { StyleSheet,Dimensions} from "react-native";
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import SongScreen from '../screens/Songscreen';
import HomeScreen from "../screens/Homescreen";
import AlbumScreen from '../screens/Albumscreen';
import AddToPlaylist1 from '../screens/AddToPlaylistscreen1';
import Icon from 'react-native-vector-icons/Ionicons';
import { Texts } from '../types';
import HeaderLeft from '../componentes/LeftHeader';
import HeaderRight from '../componentes/HeaderRight';
import { language } from '../utils/langCheck';

const Stack = createStackNavigator();
const {height}=Dimensions.get('window')



export default function StackNav({navigation}){

    return (
        <Stack.Navigator
            screenOptions={{
                headerMode:'screen',
                gestureEnabled:true,
                gestureDirection:'horizontal',
                cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
            }}>
            <Stack.Screen 
            name="Home Screen" 
            component={HomeScreen}
            options={{
                headerShown:true,
                headerTintColor:'#fff',
                headerLeft:()=>{return(<HeaderLeft navigation={navigation}/>)},
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
                headerBackImage:()=>{return(<Icon name='chevron-back-outline' style={styles.icon} size={height<=540?25:30} />)},
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
                headerTitle:Texts[`${language()}-playlists`],
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
    }   
})