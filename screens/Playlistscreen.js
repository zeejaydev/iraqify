import React,{useEffect,useState} from "react";
import { Text, View,StyleSheet,TouchableOpacity,Image,ScrollView,ActivityIndicator,Modal,Dimensions,TextInput,Keyboard} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { CreatePList, Texts } from "../types";
import { language } from "../utils/langCheck";


const {height}=Dimensions.get('window');

const textSize = height > 1000 ? 18 : 15;

export default function PlaylistScreen ({navigation}) {

    const [open,setOpen]=useState(false)  
    const [list2,setlist2]=useState()
    const [isLoading,setIsLoading]=useState(true);
    const user = firebase.auth().currentUser

    const [deletePlaylist,setDeletePlaylist]=useState()

    const [value,setValue]=useState('')
    const [emptyPlaylistNameError,setEmptyPlaylistNameError]=useState(false)
    const bs = React.createRef()
    const fall = new Animated.Value(1)

    useEffect(()=>{

      const subscribe = firestore().collection('Users').doc(user.uid).collection('Playlists').onSnapshot(function(querySnapshot) {
          const playlistsNames =[]
          try {
            querySnapshot.forEach( (doc) => playlistsNames.push(doc.id) )
            setlist2(playlistsNames)
          } catch (error) {
            console.log(error)
          }
          if(playlistsNames.length==0){
            setIsLoading(false)
          }else{
            setIsLoading(false)
          }
      });
      return ()=>subscribe()


      
  },[])
    
  
  const deleteList =()=>{
    firebase.firestore().collection('Users').doc(user.uid).collection('Playlists').doc(deletePlaylist).delete()
    setOpen(false)
  }
   
  const deletePressed = (id)=>{
    setOpen(true)
    setDeletePlaylist(id)
  }

  const addPlaylist = ()=>{
    bs.current.snapTo(0)
    setValue('')
}

const createPressed = ()=>{
       
  if(value!=''){
    firebase.firestore().collection('Users').doc(user.uid).collection('Playlists').doc(value).set({
      Tracks:[]
  }).catch((e)=>console.log(e))
  setEmptyPlaylistNameError(false)
  Keyboard.dismiss()
  bs.current.snapTo(1)
  }else{
    setEmptyPlaylistNameError(true)
  }
 
}

  if(isLoading)return<View style={{
      flex:1, 
      backgroundColor:'#121212',
      justifyContent:'center',
      alignItems:'center'
    }} >
    <ActivityIndicator size='large' color='#fff'/>
  </View>




    if(list2.length==0){


      const renderContent = () => (
        <View
          style={{
            backgroundColor: '#3b3b3b',
            padding: 16,
            height: '100%',
            
          }}
        >
         <View style={{alignItems:'center'}}>
             <TouchableOpacity onPress={() => {bs.current.snapTo(1),Keyboard.dismiss()}}>
                <Icon name='close' style={{color:'#fff',fontSize:height<=544?20:30}} />
             </TouchableOpacity>
            
         </View>
         
         <View style={{marginTop:height<=544?30:50,alignItems:'center'}}>
            <TextInput
                placeholderTextColor='gray'
                placeholder={Texts[`${language()}-plist-name`]}
                value={value}
                onChangeText={(text)=>setValue(text)}
                style={{
                    backgroundColor:'transparent',
                    borderBottomColor:'#fff',
                    borderBottomWidth:2,
                    width:'80%',
                    height:height<=544?40:50,
                    color:'#fff'
                }}
            />
            <Text style={{color:'red',marginVertical:5}}>{emptyPlaylistNameError?'نسيت اسم قائمة التشغيل':null}</Text>
         </View>
         <View style={{alignItems:'center',marginTop:20}}>
            <TouchableOpacity style={styles.addButton} onPress={createPressed}>
                        <Text style={{color:'#fff',fontWeight:'bold',fontSize:height<=544?11:15}}>{CreatePList[`${language()}-create`]}</Text>
                    </TouchableOpacity>
         </View>
        </View>
      );
      
      return(
        <View style={{
          flex:1, 
          backgroundColor:'#121212',
          // justifyContent:'center',
          // alignItems:'center'
      }} >
        
          <View
            style={{
              flexDirection:'row',
              alignItems:'flex-end'
            }}
          >
            <TouchableOpacity 
              style={{
                marginVertical:10,
                width:50,
                height:50,
                backgroundColor:'#212121',
                marginHorizontal:10,
                justifyContent:'center',
                alignItems:'center'
              }}

              onPress={addPlaylist}
            >
              <Icon name='add' style={{color:'#fff',fontSize:20}} />
            </TouchableOpacity>
            
            <Text
              style={{
                color:'#fff',
                marginBottom:10
              }}
            >
            {language() === 'ar' ? 'اضافه قائمه تشغيل جديده...': 'Add new playlist ... '}
            </Text>

          </View>
         

          <BottomSheet
            ref={bs}
            initialSnap={1}
            snapPoints={['70%','0%']}
            borderRadius={15}
            renderContent={renderContent}
            callbackNode={fall}
          />  
        </View>
      )
    
    }
    
    
    
    

  return(
    <View style={styles.container}>

      


      <Modal
        animationType="fade"
        transparent={true}
        visible={open} 
      >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                
                
                <Icon name='trash' style={{color:'#fff',margin:15,fontSize:height<=544?20:30}} />
                <Text style={styles.modalText}>{Texts[`${language()}-sure`] }</Text>
                
               <View style={{flexDirection:'row'}} >
               
                <TouchableOpacity onPress={()=>setOpen(false)}  style={styles.button2} >
                  <Text style={{color:'#fff',fontWeight:'bold',fontSize:height<=544?9:15}} >{Texts[`${language()}-no`]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteList}  style={styles.button} >
                  <Text style={{color:'#fff',fontWeight:'bold',fontSize:height<=544?9:15}} >{Texts[`${language()}-yes`]}</Text>
                </TouchableOpacity>
               </View>
            </View>
           
        </View>
      </Modal>
   <ScrollView >
     
     {
       list2.map((item,index)=>{

         return(
             <View  style={styles.playlistsContainer} key={index}>
                 

                     <TouchableOpacity 
                       onPress={()=>navigation.navigate('Playlist',{item})}
                       style={{flexDirection:'row',alignItems:'center'}}
                     >
                         <View style={{width:height<=544?25:50,height:height<=544?25:50}}>
                           <Image source={require('../shared/icons8-lounge-music-playlist-60.png')} style={{width:'100%',height:'100%'}} />
                           
                         </View>
                        
                       
                           <Text style={{color:'#fff',fontWeight:'bold',fontSize:textSize}}>{item}</Text>
                         
                         
                     </TouchableOpacity>

                     <TouchableOpacity style={{marginRight:10}} onPress={()=>deletePressed(item)}>
                        <Icon name='close-outline' style={{color:'#fff',fontSize:height<=544?20:30}}/>
                     </TouchableOpacity>
             </View>
         )


       })
     }
     
   </ScrollView>
   </View>
  )    


  
  }

  const styles = StyleSheet.create({
    container:{
        flex:1, 
        backgroundColor:'#121212',
       
    },
    playlistContainer:{
        flex:1,
    },
    playlistsContainer:{
        paddingLeft:15,
        marginTop:15,
        flexDirection:'row',
        // backgroundColor:'#3b3b3b',
        alignItems:'center',
        justifyContent:'space-between'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 10,
      backgroundColor: "rgba(59,59,59,0.5)",
      borderRadius: 10,
      // paddingVertical: 20,
      paddingHorizontal:10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    modalText: {
      margin: 15,
      textAlign: "center",
      color:'#fff',
      fontWeight:'bold',
      fontSize:height<=544?9:15
    },
    button:{
      padding:height<=544?5:10,
      backgroundColor:'#f94144',
      borderRadius:20,
      width:100,
      marginVertical:height<=544?9:15,
      marginHorizontal:5,
      justifyContent:'center',
      alignItems:'center'
    },
    button2:{
      padding:height<=544?5:10,
      backgroundColor:'#1db954',
      borderRadius:20,
      width:100,
      marginVertical:height<=544?9:15,
      marginHorizontal:5,
      justifyContent:'center',
      alignItems:'center'
    },
    addButton:{
      backgroundColor:'#1db954',
      padding:height<=544?5:13,
      width:height<=544?130:150,
      height:height<=544?30:45,
      marginVertical:10,
      borderRadius:50,
      alignItems:'center',
      justifyContent:'center'  
  },
})