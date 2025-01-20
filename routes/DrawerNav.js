import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from  '../screens/SettingsScreen';
import BottomNav from './bottomNav';
import { language } from '../utils/langCheck';


const Drawer = createDrawerNavigator();

export default function DrawerNav () {

    return (
        <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={{
            drawerType: 'back',
            drawerStyle: { backgroundColor:'#212121' },
            drawerActiveTintColor: 'white',
            drawerInactiveTintColor: 'white'
            }}>
            <Drawer.Screen 
                name="DrawerHome" 
                component={BottomNav} 
                options={{
                    headerShown:false,
                    title:language() === 'ar' ? 'الصفحه الرئيسيه' : 'Home',
                    }}/>
            <Drawer.Screen 
                name="DrawerSettings" 
                component={SettingsScreen}
                options={{
                    headerTintColor:'#fff',
                    headerBackTitleVisible:false,
                    headerTitle:language() === 'ar' ? 'الاعدادت' : 'Settings',
                    title:language() === 'ar' ? 'الاعدادت' : 'Settings',
                    headerTitleAlign:'center',
                    headerStyle:{
                        backgroundColor:'#212121',
                    },
                    headerTitleStyle:{
                        color:'#b3b3b3',
                        fontSize:15,
                        fontWeight:'bold',
                    },
                }} 
               />
        </Drawer.Navigator>
    )
}