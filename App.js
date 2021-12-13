import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import { StatusBar,Platform, Alert,SafeAreaView,BackHandler,Linking} from 'react-native';
import {TrackInfoProvider} from './shared/Trackcontext';
import {QueueManagementProvider} from './shared/queueManagementContext';
import {PlaylistInfoProvider} from './shared/playlistContext';
import MainNav from "./routes/mainNav";
import SplashScreen from 'react-native-splash-screen';
import VersionCheck from 'react-native-version-check';
import TrackPlayer,{Capability} from 'react-native-track-player';


// import TrackPlayer from 'react-native-track-player';
const App = () => {
  const setupIfNecessary = async () => {
    // if app was relaunched and music was already playing, we don't setup again.
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      return;
    }
  
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play, 
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        
      ]
    });
  

  }


  useEffect(() => {
     setTimeout(() => {
      SplashScreen.hide();
     }, 150);
     setupIfNecessary();
 }, []);

 useEffect(()=>{ 
  VCheck()

 },[])

 const VCheck = async ()=>{
   try {
    let updateNeeded = await VersionCheck.needUpdate()

    let url = await VersionCheck.getStoreUrl({ appID: Platform.OS==='ios'?'1553219762':'com.iraqify' }).then(res=>{
      return res
    })

    if(updateNeeded && updateNeeded.isNeeded){
      
     Alert.alert(
        'Please Update',
        'You will need to update your app to get the latest features',
        [
          {
            text:'Ok',
            onPress: ()=>{
              BackHandler.exitApp()
              Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                  return Linking.openURL(url).catch(() => null);
                }
              });
            }
          }
        ],
      )
    }
   } catch (error) {
     return null
   }
 }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#212121'}}>
      <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content':null} backgroundColor='transparent' translucent/>

      <TrackInfoProvider>
        <QueueManagementProvider>
        <PlaylistInfoProvider>
        <MainNav/>
        </PlaylistInfoProvider>
        </QueueManagementProvider>
      </TrackInfoProvider>

    </SafeAreaView>
  );
};


export default App;
