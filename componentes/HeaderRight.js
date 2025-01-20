import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { LoginManager } from 'react-native-fbsdk';
import { Logout } from "../types";
import { language } from "../utils/langCheck";

const {height}=Dimensions.get('window')

const iconSize = height > 1000 ? 40 : 25;
const textSize = height > 1000 ? 18 : 15;

export default function HeaderRight (){
    return(
        <TouchableOpacity onPress={()=>{auth().signOut().then(()=>LoginManager.logOut())}} >
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.userSignOutText}>{ Logout[`${language()}-logout`] } </Text>
                <Icon name='log-out-outline' style={styles.userSignOutIcon}/>
            </View>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userSignOutIcon:{
        color:'#fff',
        fontSize:height<=540?17:iconSize,
        marginRight:5
    },
    userSignOutText:{
        color:'#fff',
        marginRight:5,
        textTransform:'capitalize',
        fontWeight:'bold',
        fontSize:height<=540?9:textSize,
    }
})