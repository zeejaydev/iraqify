import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Welcome } from '../types';
import { language } from '../utils/langCheck';

const {height}=Dimensions.get('window');
const userSize = height > 1000 ? 60 : 45;
const userImageSize = height > 1000 ? 60 : 40 ;
const iconSize = height > 1000 ? 40 : 25;
const textSize = height > 1000 ? 18 : 15;

export default function HeaderLeft ({navigation}){
    const [username,setusername] = useState({})
    const user = auth().currentUser;
    const name = username.name ? username.name : '';
    
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
      return subscribe
    },[])

    return(
        <View style={styles.menuContainer}>
            <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                <Icon name='menu' size={iconSize} color='white' style={{marginHorizontal:10}}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row',alignItems:'center'}} >
                {user.photoURL ?
                <FastImage
                style={styles.userImg}
                source={{
                    uri: `${user.photoURL}?width=200`,
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
                : <Icon name='person-circle-outline' style={styles.userIcon}/>}
                <Text style={styles.userGreetings}>{language() === 'ar'?name:''} {Welcome[`${language()}-welcome`]} {language() === 'en'?name:''}</Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userImg:{
        width:height<=540?25:userSize,
        height:height<=540?25:userSize,
        borderRadius:50
        
    },
    userIcon:{
        fontSize:height<=540?25:userImageSize,
        color:'#fff'
    },
    userGreetings:{
        fontSize:height<=540?9:textSize,
        color:'#fff',
        marginLeft:5,
        textTransform:'capitalize',
        fontWeight:'bold'
    },
    menuContainer:{
        flexDirection:'row',
        alignItems:'center'
    }
})