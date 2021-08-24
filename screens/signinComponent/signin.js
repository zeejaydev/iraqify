import React,{useState} from 'react';
import {View,SafeAreaView,TouchableOpacity,Dimensions,TouchableWithoutFeedback,Keyboard,TextInput,Text,StyleSheet,ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';


const {height}=Dimensions.get('screen')
export default function SignIn(){

    const [emailError,setEmailError]=useState(false)
    const [emailErrorMessage,setEmailErrorMessage]=useState('')

    const [passError,setPassError]=useState(false)
    const [passErrorMessage,setPassErrorMessage]=useState('')

    const [errorMessage,setErrorMessage]=useState('')
    const [otherErrorMessage,setOtherErrorMessage]=useState('')

    const [email,setEmail]=useState('')
    const [pass,setPass]=useState('')
    const [loading,setLoading]=useState(false)

    const emailTextChanged = (text)=>{
        setOtherErrorMessage('')
        setEmailError(false)
        setEmailErrorMessage('')
        setEmail(text)
      }
    const passTextChanged = (text)=>{
    setOtherErrorMessage('')
    setPassError(false)
    setPassErrorMessage('')
    setPass(text)
    }
  
    
    const signInWithEmail = ()=>{
        setLoading(true)
        setErrorMessage('')
        setOtherErrorMessage('')
        if(email==='' && pass===''){
            setLoading(false)
            setEmailError(true)
            setPassError(true)
            setEmailErrorMessage('Email Field can not be empty')
            setPassErrorMessage('Password Field can not be empty')
        }else if(email===''){
          setEmailError(true)
          setEmailErrorMessage('Email is required')
          setLoading(false)
        }else if(pass===''){
          setLoading(false)
          setPassError(true)
          setPassErrorMessage('Password is required')
        }else{
            auth().signInWithEmailAndPassword(email,pass).then(() => {
              setLoading(false)
            }).catch(error => {
                if(error.code ===  'auth/invalid-email'){
                    setEmailError(true)
                    setEmailErrorMessage('Email is invalid')
                    setLoading(false)
                }else if (error.code === 'auth/wrong-password'){
                    setPassError(true)
                    setPassErrorMessage('Password is incorrect')
                    setLoading(false)
                }else if(error.code === 'auth/user-not-found'){
                  setEmailError(false)
                  setPassError(false)
                  setEmailErrorMessage('')
                  setPassErrorMessage('')
                  setErrorMessage('User not found')
                  setLoading(false)
                }else{
                  setOtherErrorMessage(error.nativeErrorMessage)
                  setLoading(false)
                }
                
            });
        }
        
    
        
      }

    return(
       <SafeAreaView style={{flex:1,backgroundColor:'#212121',}}>
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.Container}>
                    <View style={{width:'90%'}}>
                        <Text style={styles.lable}>Email</Text>
                        <TextInput
                        style={{...styles.input,
                            borderBottomColor:emailError?'#f94144':'#212121',
                            
                        }}
                        onChangeText={(text)=>emailTextChanged(text)}
                        value={email}
                        />

                        {emailError?<View ><Text style={{color:'#fff'}}>{emailErrorMessage}</Text></View>:null}
                    </View>

                    <View style={{width:'90%'}}>
                        <Text style={styles.lable}>Password</Text>
                        <TextInput
                        style={{...styles.input,
                            borderBottomColor:passError?'#f94144':'#212121',
                        }}
                        onChangeText={(text)=>passTextChanged(text)}
                        value={pass}
                        textContentType='password'
                        secureTextEntry={true}
                        />
            
                        {passError?<View ><Text style={{color:'#fff',marginVertical: 5,}}>{passErrorMessage}</Text></View>:null}
                        {errorMessage!=''?<View ><Text style={{color:'#fff',marginVertical: 5,}}>{errorMessage}</Text></View>:null}
                        {otherErrorMessage!=''?<View ><Text style={{color:'#fff',marginVertical:5,}}>{otherErrorMessage}</Text></View>:null}
                    </View>

                    <View style={{marginVertical:15,width:'60%'}}>
                        <TouchableOpacity disabled={loading} onPress={signInWithEmail} style={styles.button}>
                        {
                            loading?
                            <ActivityIndicator size='small' color='#fff' />
                                :
                                <Text style={styles.text}>Sign In</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
           </TouchableWithoutFeedback>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center'
    },
    input:{
        backgroundColor:'#404040',
        borderBottomWidth:2,
        padding:height<540?5:15,
        color:'#fff',
        fontSize:height<540?10:15,
        marginVertical:5
      },
    lable:{
        fontWeight:'bold',
        fontSize:height<540?12:20,
        color:'#fff',
        marginTop:height<540?5:10,
        textTransform:'capitalize'
    },
    button:{
        backgroundColor:'#1db954',
        padding:height<540?5:13,
        borderRadius:50
    },
    text:{
    color:'#fff',
    fontWeight:'bold',
    textAlign:'center',
    fontSize:height<540?12:17,
    },  
})