import React, { useState, useRef, useContext } from 'react'
import { View, Button, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import { language } from '../utils/langCheck';
import Animated from 'react-native-reanimated';

export default function SettingsScreen () {
    const user = auth().currentUser;
    const bs = useRef(null);
    const fall = new Animated.Value(1);

    const handleDeleteAccount = ()=>{
        user.delete()
    }

    const renderContent = ()=>{

        // const saveLang = async(e)=>{
        //     try {
        //        await AsyncStorage.setItem('lang', e);
        //        setLang(e)
        //        bs.current.snapTo(1)
        //       } catch (error) {
        //         // Error retrieving data
        //         console.log(error)
        //       }
        // }
    
        return(
            <View style={{
                backgroundColor: '#3b3b3b',
                padding: 16,
                height: '100%'}}>
                <Text style={{color:'white',fontSize:20,marginVertical:10}} onPress={saveLang.bind(this,'ar')}>Arabic</Text>
                <Text style={{color:'white',fontSize:20}} onPress={saveLang.bind(this,'en')}>English</Text>
            </View>
        )
    }

    return (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#121212'}}>
            {/* <TouchableOpacity onPress={()=>bs.current.snapTo(0)}>
                <Text style={{color:'white'}}>Select</Text>
            </TouchableOpacity> */}
           {/* <BottomSheet
                    ref={bs}
                    initialSnap={1}
                    snapPoints={["37%",'0%']}
                    borderRadius={15}
                    renderContent={renderContent}
                    callbackNode={fall}
                /> */}
            <Button 
                title={language() === 'ar' ? 'الغاء الحساب' :'Delete Account'} 
                color={'red'} 
                onPress={handleDeleteAccount}/>
        </View>
    )
}

const styles = StyleSheet.create({
    dropdownView:{
        backgroundColor:'white',
        height:200,
        width:200
    }
});
