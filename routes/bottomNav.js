import React,{useState,useEffect} from 'react';
import { Dimensions,View } from "react-native";
// import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNav from './stackNav';
import SearchStack from './searchStack';
import PlaylistStack from "./playlistStack";
import {Icon} from 'native-base';
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
    
                if (route.name === 'الفائمه الرئيسيه') {
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
            })}

            tabBar={(props)=>(
              <View style={{position:'relative'}}>
                <Playerwidget {...props}/>
                <BottomTabBar {...props}/>
              </View>
            )}

            tabBarOptions={{
              labelStyle:{
                margin:0,
                padding:0,
                fontWeight:'bold'
              },
              activeTintColor: '#fff',
              inactiveTintColor: 'gray',
              style:{
                backgroundColor:'#212121',
                borderTopColor:'#212121',
                shadowColor:'none',
                height:60,
                
              },
            }}
            bar
          >
           
          <Tab.Screen name="الفائمه الرئيسيه" component={StackNav} />
          <Tab.Screen name="بحث" component={SearchStack} />
          <Tab.Screen name="المكتبه" component={PlaylistStack} />
        </Tab.Navigator>

      // </NavigationContainer>
    );
  }