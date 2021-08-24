import React from "react";
import { View,Text,StyleSheet,SafeAreaView,Image,TouchableOpacity,Platform,Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';


const {height}=Dimensions.get('screen')
export default function LoginScreen({navigation}){

const styles = StyleSheet.create({
  header:{
    width:'100%',
    alignItems:'center',
    flex: 1,
    justifyContent:'center',
    
  },
  body:{
    flex:1,
    width:'100%',
    alignItems:'center',
    
  },
  button:{
        minWidth:'80%',
        backgroundColor:'#1db954',
        padding: height<560?8:13,
        borderRadius:50
  },
  button2:{

        backgroundColor:'#6b6b6b',
        padding:height<560?8:13,
        // marginTop:5,
        borderRadius:50
  },
  button3:{
        minWidth:'80%',
        backgroundColor:'#1877F2',
        padding: height<560?8:13,
        flexDirection:'row',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center'
  },
img:{
  width: '30%' ,
  // height:'30%',
},
text:{
  color:'#fff',
  fontWeight:'700',
  textAlign:'center',
  fontSize: height<560?12:16,
},  
bodyText:{
  fontSize:height<560?15:20,
  fontWeight:'bold',
  color:'#fff',
  textAlign:'center',
  textTransform:'capitalize'
}

})


  const facebookSignin =async ()=>{
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      console.log('User cancelled the login process') ;
      return
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      console.log('Something went wrong obtaining access token');
      return
    }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential).then(cred=>{
    firestore().collection('Users').doc(cred.user.uid).set({
      name:cred.additionalUserInfo.profile.name,
      provider:cred.additionalUserInfo.providerId,
      
      }).catch((e)=>console.log(e))
  }).catch(error=>{
    if(error.code==='auth/account-exists-with-different-credential'){
      setOtherErrorMessage('Account already exists with the same email')
    }else{
      console.log(error)
    }
  });
  }

  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    
    const { identityToken, nonce } = appleAuthRequestResponse;


    // Ensure Apple returned a user identityToken
    if (identityToken) {
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      const userCredential = await auth().signInWithCredential(appleCredential).then(cred=>
            {
              firestore().collection('Users').doc(cred.user.uid).set({
              name:'Apple User',
              provider:cred.additionalUserInfo.providerId,
              
              }
              
              ).catch((e)=>console.log(e))
            }).catch(error=>console.log(error));

      return userCredential

    }else{
      console.log('try again')
    }
  
  

    
  }



    return(
    <SafeAreaView style={{flex:1,backgroundColor:'#212121',}}>
      
      <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop: 40,}}>
          

          <View style={styles.header}>
            <Image source={require('../shared/icon.png')} style={styles.img} resizeMethod='scale' resizeMode='contain' />
          
          </View>
  
          <View style={styles.body}>
            <View style={{width:'85%',alignItems:'center'}}>
              <Text style={styles.bodyText}>Best Iraqi Songs are waiting for your login...</Text>
            </View>
            <View style={{paddingVertical:10}}>

              
            {
                Platform.OS==='ios'?
                <View style={{marginBottom:8}}>
                  <AppleButton
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    cornerRadius={50}
                    style={{
                      minWidth:'80%',
                      height: 45,
                      borderRadius:50
                    }}
                    onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
                  />
                </View>
                :
                null
              }
              <View style={{marginBottom:8}}>
              <TouchableOpacity style={styles.button3} onPress={facebookSignin}>
                
                <Image source={require('../shared/f_logo_RGB-White_58.png')} style={{width:15,height:15,marginRight:10}} />   
                <Text style={styles.text}>Login with Facebook</Text>
           
              </TouchableOpacity>
              </View>
              
              <View style={{marginBottom:8}}>
                <Text style={{color:'#fff',textAlign:'center',fontWeight:'bold',fontSize:height<540?13:16,}} >OR</Text>
              </View>
              
              {/* SIGN IN BUTTON */}
                <TouchableOpacity onPress={()=>navigation.navigate('Signup')} style={styles.button}>
                     
                  <Text style={styles.text}>Sign up Free</Text>

                </TouchableOpacity>
              {/* END SIGN IN BUTTON */}

              {/* SIGNUP BUTTON */}

              <View style={{marginVertical:8}}>
              <TouchableOpacity style={styles.button2} onPress={()=>navigation.navigate('Signin')}>
                    
                <Text style={styles.text}>Log In</Text>

              </TouchableOpacity>
              </View>

              {/* END SIGNUP BUTTON */}


            </View>
            
            
            
       
            
            
              
              
              
          </View>
          
         
          </View>
      </SafeAreaView>
     
    )
  }

  