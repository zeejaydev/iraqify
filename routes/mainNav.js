import React,{useState,useEffect} from 'react';
import { Easing,ActivityIndicator} from 'react-native';
import BottomNav from "./bottomNav";
import PlayerWidget from '../shared/Playerwidget';
import { createStackNavigator,TransitionSpecs,CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayerScreen from '../screens/Playerscreen';
import Profile from '../screens/Profilescreen';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/Loginscreen';
import Signup from '../screens/signupComponent/signup';
import Signin from '../screens/signinComponent/signin';


const Stack = createStackNavigator();

function MainView({navigation}){
  return(
    <>
        <BottomNav/>
        {/* <PlayerWidget navigation={navigation}/> */}
    </>
  )
}


const closingConfig = {
    animation:'timing',
    config:{
        duration:400,
        easing:Easing.linear
    }
  
  }




export default function MainNav(){
  
  const [isSignedIn,setSignedIn]=useState(false);
  const [isLoading,setIsloading]=useState(false);
 
  
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user)=>{
      if(user != null){
        setSignedIn(true);
        setIsloading(false);
        // console.log(user)
      }else{
        setIsloading(false)
        setSignedIn(false);
        // console.log('no user')
        
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);



  if (isLoading) return <ActivityIndicator size='large' />;


return(
      <NavigationContainer>
  
    <Stack.Navigator
      screenOptions={{
          gestureEnabled:true,
          gestureDirection:'vertical',
          headerMode:'screen',
          transitionSpec: {
              open: TransitionSpecs.RevealFromBottomAndroidSpec,
              close: closingConfig,
          },
          cardStyleInterpolator:CardStyleInterpolators.forVerticalIOS
      }}
    >
      
      {
      
      isSignedIn ? (

          <>
            <Stack.Screen
              name='mainview'
              component={MainView}
              options={{
                headerShown:false
              }}
            />
  
            <Stack.Screen
              name='Playerscreen'
              component={PlayerScreen}
              
              options={{
                headerBackImage:()=>{return(<Icon name='chevron-down-outline' style={{marginLeft:10,color:'#fff'}} size={30} />)},
                headerBackTitleVisible:false,
                headerTitle:'Playing',
                headerTitleAlign:'center',
                headerTitleStyle:{
                  color:'#b3b3b3',
                  fontSize:15,
                  fontWeight:'bold'
                },
                headerStyle:{
                    backgroundColor:'#212121',
                    borderColor:'#212121',
                    borderBottomWidth:0,
                    shadowColor:'#212121'
                }
              }}
            />
            {/* <Stack.Screen
              name='Queuescreen'
              component={QueueScreen}
              options={{
                headerBackTitleVisible:false,
                headerTitle:'Queue',
                headerTitleAlign:'center',
                headerTintColor:'#fff',
                headerTitleStyle:{
                  color:'#b3b3b3',
                  fontSize:15,
                  fontWeight:'bold'
                },
                headerStyle:{
                    backgroundColor:'#121212',
                    shadowColor:'none',
                }
              }}
            /> */}
            <Stack.Screen
              name='Profile'
              component={Profile}
              options={{
                headerBackImage:()=>{return(<Icon name='chevron-down-outline' style={{marginLeft:10,color:'#fff'}} />)},
                headerBackTitleVisible:false,
                headerTitle:'My Profile',
                headerTitleAlign:'center',
                headerTintColor:'#fff',
                headerTitleStyle:{
                  color:'#b3b3b3',
                  fontSize:15,
                  fontWeight:'bold'
                },
                headerStyle:{
                    backgroundColor:'#121212',
                    shadowColor:'none',
                }
              }}
            />
          </>
      ):(

      <>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{
            // header:()=>{return(<Header/>)}
            headerShown:false
          }}
        />
        <Stack.Screen
          name='Signup'
          component={Signup}
          options={{
            headerBackImage:()=>{return(<Icon name='chevron-down-outline' style={{marginLeft:10,color:'#fff'}} size={30}/>)},
                headerBackTitleVisible:false,
                headerTitle:'Sign Up',
                headerTitleAlign:'center',
                headerTintColor:'#fff',
                headerTitleStyle:{
                  color:'#b3b3b3',
                  fontSize:15,
                  fontWeight:'bold'
                },
                headerStyle:{
                    backgroundColor:'#212121',
                    shadowColor:'none',
                }
          }}
        />
        <Stack.Screen
          name='Signin'
          component={Signin}
          options={{
            headerBackImage:()=>{return(<Icon name='chevron-down-outline' style={{marginLeft:10,color:'#fff'}} size={30}/>)},
                headerBackTitleVisible:false,
                headerTitle:'Log In',
                headerTitleAlign:'center',
                headerTintColor:'#fff',
                headerTitleStyle:{
                  color:'#b3b3b3',
                  fontSize:15,
                  fontWeight:'bold'
                },
                headerStyle:{
                    backgroundColor:'#212121',
                    shadowColor:'none',
                }
          }}
        />
      </>

      )
   }

      </Stack.Navigator>
    </NavigationContainer>
    )
  }

