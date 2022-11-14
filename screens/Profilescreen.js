import React from 'react'
import { Text, View,Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function QueueScreen ({route}) {
    const user = auth().currentUser 
   

    return (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#121212'}}>
            <Text style={{color:'white'}}>MY Profile</Text>
            {user.photoURL?<Image source={{uri:`${user.photoURL}?width=400`}} style={{width:150,height:150}} />
            :
            <Icon name='person-circle-outline' style={{fontSize:40,color:'#fff'}}/>
            }
        </View>
    )

  }
