import React,{useState,useEffect} from 'react';
import { Dimensions,View } from "react-native";
// import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNav from './stackNav';
import SearchStack from './searchStack';
import PlaylistStack from "./playlistStack";
import Icon from 'react-native-vector-icons/Ionicons';
import Playerwidget from '../shared/Playerwidget'


const {height}=Dimensions.get('window')
const Tab = createBottomTabNavigator();

export default function BottomNav() {
  

    return (
      // <NavigationContainer>
 
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'القائمه الرئيسيه') {
                  iconName = focused
                    ? 'home'
                    : 'home';
                } else if (route.name === 'بحث') {
                  iconName = focused ? 'search' : 'search' ;
                } else if (route.name === 'المكتبه') {
                  iconName = focused ? 'list' : 'list' ;
                }
    
                // You can return any component that you like here!
                return <Icon name={iconName} style={{color:'#b3b3b3',fontSize:height<=600?20:30}} />;
              },
              tabBarActiveTintColor: 'white',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle:{
                  backgroundColor:'#212121',
                  borderTopColor:'#212121',
                  shadowColor:'none',
              },
             tabBarLabelStyle:{
                margin:0,
                padding:0,
                fontWeight:'bold'
             },
             headerShown:false
            })}

            tabBar={(props)=>(
              <View style={{position:'relative'}}>
                <Playerwidget {...props}/>
                <BottomTabBar {...props}/>
              </View>
            )}

            
            
          >
           
          <Tab.Screen name="القائمه الرئيسيه" component={StackNav} />
          <Tab.Screen name="بحث" component={SearchStack} />
          <Tab.Screen name="المكتبه" component={PlaylistStack} />
        </Tab.Navigator>

      // </NavigationContainer>
    );
  }