import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import { StatusBar,Platform, Alert,SafeAreaView,BackHandler,Linking} from 'react-native';
import {TrackInfoProvider} from './shared/Trackcontext';
import {PlaylistInfoProvider} from './shared/playlistContext';
import MainNav from "./routes/mainNav";
import SplashScreen from 'react-native-splash-screen';
import VersionCheck from 'react-native-version-check';

// import TrackPlayer from 'react-native-track-player';
const App = () => {

  useEffect(() => {
     setTimeout(() => {
      SplashScreen.hide();
     }, 150);
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
        <PlaylistInfoProvider>
        <MainNav/>
        </PlaylistInfoProvider>
      </TrackInfoProvider>

    </SafeAreaView>
  );
};


export default App;
