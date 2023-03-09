import React from 'react';
import { Dimensions,View } from "react-native";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNav from './stackNav';
import SearchStack from './searchStack';
import PlaylistStack from "./playlistStack";
import Icon from 'react-native-vector-icons/Ionicons';
import Playerwidget from '../shared/Playerwidget'
import { Routes } from '../types';
import { language } from '../utils/langCheck';


const {height}=Dimensions.get('window')
const Tab = createBottomTabNavigator();

const containerSize = height > 1000 ? 80 : 50;
const textSize = height > 1000 ? 18 : 12;

export default function BottomNav() {
  

    return (
      // <NavigationContainer>
 
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'القائمه الرئيسيه' || route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home';
                } else if (route.name === 'بحث' || route.name === 'Search') {
                  iconName = focused ? 'search' : 'search' ;
                } else if (route.name === 'المكتبه' || route.name === "Library") {
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
                  height:containerSize
              },
             tabBarLabelStyle:{
                margin:0,
                padding:0,
                fontWeight:'bold',
                fontSize: textSize
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
           
          <Tab.Screen name={Routes[`${language()}.home`]} component={StackNav} />
          <Tab.Screen name={Routes[`${language()}.search`]} component={SearchStack} />
          <Tab.Screen name={Routes[`${language()}.lib`]} component={PlaylistStack} />
        </Tab.Navigator>

      // </NavigationContainer>
    );
  }