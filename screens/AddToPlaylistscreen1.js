import React,{useContext,useState,useEffect} from "react";
import { Text, View,ScrollView,StyleSheet,TouchableOpacity,Dimensions,TextInput,Keyboard,Modal} from 'react-native';
import {PlaylistInfoProvider,PlaylistContext } from "../shared/playlistContext";
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';


const {height}=Dimensions.get('window')


export default function PlaylistScreen1 ({route,navigation}) {
//Controlling the state
    const user = firebase.auth().currentUser;
    //Playlist context
    const [list,setList]=useContext(PlaylistContext)
    const [emptyPlaylistNameError,setEmptyPlaylistNameError]=useState(false)
    const [list2,setlist2]=useState()
    
    //Textinput for playlist name
    const [value,setValue]=useState('')
    
    // Modal to show after adding a song to playlist
   const [modalVisible, setModalVisible] = useState(false);

//End Controlling the state 


useEffect(()=>{
    const user = firebase.auth().currentUser
    const subscribe = firestore().collection('Users').doc(user.uid).collection('Playlists').onSnapshot(function(querySnapshot) {
        const playlistsNames =[]
        querySnapshot.forEach( (doc) => playlistsNames.push(doc.id) )
        setlist2(playlistsNames)
    });
 
    return subscribe

},[])


//Variable for the bottomSheet library
    const bs = React.createRef()
    const fall = new Animated.Value(1)
//End Variable for the bottomSheet library   
    
    
// creating a new playlist functions
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
//End creating a new playlist functions

// adding the selected song to a playlist
    const addToplaylistPressed = (id)=>{
        const Trackobj = route.params.TrackObj
        firebase.firestore().collection('Users').doc(user.uid).collection('Playlists').doc(id).update({
            Tracks : firebase.firestore.FieldValue.arrayUnion(Trackobj)
        }).catch(e=>console.log(e))

        songAddedConfimation()
    }
// End adding the selected song to a playlist 
   
//Render component for the bottom sheet lib
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
                placeholder='اسم قائمة التشغيل'
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
                        <Text style={{color:'#fff',fontWeight:'bold',fontSize:height<=544?11:15}}>انشاء</Text>
                    </TouchableOpacity>
         </View>
        </View>
      );
//End Render component for the bottom sheet lib

  
  const songAddedConfimation = ()=>{
    setModalVisible(true)
    setTimeout(()=>{setModalVisible(false),navigation.navigate({name:'SongScreen',merge:true})}, 1000)
  }


    return (
        <PlaylistInfoProvider>
            <View style={styles.container}>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Icon name="musical-notes-outline" style={{color:'#fff',fontSize:height<=544?50:100}} />
                            <Text style={styles.modalText}>تمت اضافه الاغنيه بنجاح</Text>
                        </View>
                       
                    </View>
                </Modal>


                <BottomSheet
                    ref={bs}
                    initialSnap={1}
                    snapPoints={['70%','0%']}
                    borderRadius={15}
                    renderContent={renderContent}
                    callbackNode={fall}
                />

                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={()=>addPlaylist()}>
                            <Text style={{color:'#fff',fontWeight:'bold',fontSize:height<=544?11:15}}>انشاء قائمة تشغيل</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.playlistContainer}>
                        <ScrollView>
                        
                            {
                                list2===null||list2===undefined||list2.length==0
                                ?
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
                                    <Text style={{color:'#fff',fontWeight:'bold'}}>No playlists</Text>
                                </View>
                                :
                                list2.map((item,index)=>{
                                    
                                    
                                    // console.log(item,index)
                                    return(
                                        <View key={index} style={styles.playlistsContainer}>
                                            
                                            
                                                <TouchableOpacity 
                                                // onPress={()=>{setList( () => list.playlists.map(x => x.playlistId === item.playlistId ? {...x,playlists:[...x.playlistTracks,obj]} :prevList )),navigation.navigate('Search')}}
                                                onPress={()=>{
                                                    addToplaylistPressed(item)
                                                    
                                                }}                    
                                                >
                                                     <Icon name='add' style={{color:'#fff',marginLeft:15,fontSize:height<=544?20:30}} />
                                                </TouchableOpacity>
                                                
                                           
                                            
                                                <Text style={{color:'#fff',fontWeight:'bold',marginRight:15,fontSize:height<=544?11:15}}>{item}</Text>
                                            
                                        </View>
                                    )
                                })
                            }

                        </ScrollView>
                    </View>
            </View>
      </PlaylistInfoProvider>
    );

}


const styles = StyleSheet.create({
    container:{
        flex:1, 
        backgroundColor:'#121212',
    },
    addButtonContainer:{
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
    createButton:{
        backgroundColor:'#1db954',
        padding:13,
        width:155,
        height:45,
        marginVertical:10,
        borderRadius:50,
        alignItems:'center',  
    },
    playlistContainer:{
        flex:.92,
    },
    playlistsContainer:{
        paddingVertical:height<=544?10:15,
        marginVertical:3,
        flexDirection:'row',
        backgroundColor:'#3b3b3b',
        justifyContent:'space-between',
        alignItems:'center'
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
        paddingVertical: 20,
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
        marginTop: 15,
        textAlign: "center",
        color:'#fff',
        fontWeight:'bold',
        fontSize:height<=544?12:15
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
})