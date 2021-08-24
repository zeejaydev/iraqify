import React,{useState} from 'react';
import {View,StyleSheet,Text,SafeAreaView,TextInput,TouchableOpacity,Dimensions,ActivityIndicator,TouchableWithoutFeedback,Keyboard} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {height}=Dimensions.get('screen')
export default function Signup(){

    const [alreadyInUseError,setAlreadyInUseError] = useState(false)
    const [alreadtInUseErrorMessage,setAlreadyInUseErrorMessage] = useState('')
    const [nameError,setNameError]=useState(false)
    const [nameErrorMessage,setNameErrorMessage] = useState('')
    const [email1Error,setEmail1Error]=useState(false)
    const [email1ErrorMessage,setEmail1ErrorMessage] = useState('')
    const [pass1Error,setPass1Error]=useState(false)
    const [pass1ErrorMessage,setPass1ErrorMessage] = useState('')   
    const [emailSent,setEmailSent] = useState(false)
    const [emailSentMessage,setEmailSentMessage] = useState('')
    const [isLoading,setIsLoading]=useState(false)
    const [disable,setDisable]=useState(false)
    const [name,setName]=useState('')
    const [email1,setEmail1]=useState('')
    const [pass1,setPass1]=useState('')
    const [otherErrorMessage,setOtherErrorMessage]=useState('')


    const singUpWithEmail = ()=>{
        setIsLoading(true)
      
        if(name==='' && email1==='' && pass1===''){
          setNameError(true)
          setEmail1Error(true)
          setPass1Error(true)
          setNameErrorMessage('Name field can not be empty')
          setEmail1ErrorMessage('Email field can not be empty')
          setPass1ErrorMessage('Password field can not be empty')
          setIsLoading(false)
      
      }else if(name===''){
        setNameError(true)
        setNameErrorMessage('Name is required')
        setIsLoading(false)
      }else if(email1===''){
        setEmail1Error(true)
        setEmail1ErrorMessage('Email is required')
        setIsLoading(false)
      }else if(pass1===''){
        setPass1Error(true)
        setPass1ErrorMessage('Password is required')
        setIsLoading(false)
      }else{
        if(name.length<2){
          setNameError(true)
          setNameErrorMessage('Name needs to be more than 1 letter')
          setIsLoading(false)
        }else if(pass1.length<6){
          setPass1Error(true)
          setPass1ErrorMessage('Password needs to be at least 6 charectars')
          setIsLoading(false)
        }
        else{
          auth().createUserWithEmailAndPassword(email1,pass1).then((u)=>{
            firestore().collection('Users').doc(u.user.uid).set({
              name:name,
              provider:'Firebase Auth'
          }).catch((e)=>console.log(e))
            setIsLoading(false)
          }).catch((e)=>{
            if(e.code==='auth/invalid-email'){
              setEmail1Error(true)
              setEmail1ErrorMessage('Email is invalid')
              setIsLoading(false)
            }else if(e.code==='auth/email-already-in-use'){
              setAlreadyInUseError(true)
              setAlreadyInUseErrorMessage('The email address is already in use by another account')
              setIsLoading(false)
              setDisable(true)
            }
            console.log(e)
            setIsLoading(false)
          })
        }
      }
        
          
      }



      const styles = StyleSheet.create({
        inputView:{
            justifyContent:'center',
            alignItems:'center',
            marginVertical:height<540?10:20,
        },
        lable:{
            fontWeight:'bold',
            fontSize:height<540?12:20,
            color:'#fff',
            marginTop:height<540?5:10,
            textTransform:'capitalize'
        },
        addButton:{
            backgroundColor:disable?'#6b6b6b':'#1db954',
            padding:height<540?5:13,
            width:'60%',
            borderRadius:50,
            alignItems:'center',  
        },
        text:{
            color:'#fff',
            fontWeight:'bold',
            textAlign:'center',
            fontSize: height<540?12:17,
          },  
    })


    const nameTextChanged = (text)=>{
        setOtherErrorMessage('')
        setAlreadyInUseError(false)
        setEmailSent(false)
        setDisable(false)
        setNameError(false)
        setAlreadyInUseErrorMessage('')
        setEmailSentMessage('')
        setNameErrorMessage('')
        setName(text)
      }
      const email1TextChanged = (text)=>{
        setOtherErrorMessage('')
        setAlreadyInUseError(false)
        setEmailSent(false)
        setDisable(false)
        setEmail1Error(false)
        setEmailSentMessage('')
        setAlreadyInUseErrorMessage('')
        setEmail1ErrorMessage('')
        setEmail1(text)
      }
      const pass1TextChanged = (text)=>{
        setOtherErrorMessage('')
        setAlreadyInUseError(false)
        setEmailSent(false)
        setDisable(false)
        setPass1Error(false)
        setEmailSentMessage('')
        setAlreadyInUseErrorMessage('')
        setPass1ErrorMessage('')
        setPass1(text)
      }
      const sendPassResetEmail = ()=>{
        auth().sendPasswordResetEmail(email1).then(()=>{
          setOtherErrorMessage('')
          setAlreadyInUseError(false)
          setAlreadyInUseErrorMessage('')
          setEmailSent(true)
          setEmailSentMessage('Check your inbox to rest your password')
        }).catch(e=>console.log(e))
      }



    return(
        <SafeAreaView style={{flex:1,backgroundColor:'#212121'}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex:1}}>
            <View style={styles.inputView}>
               <View style={{width:'90%'}}>
                    <Text style={styles.lable}> Name</Text>
                    <TextInput
                        placeholderTextColor='#9d9d9d'
                        placeholder='Name'
                        value={name}
                        error={true}
                        onChangeText={(text)=>nameTextChanged(text)}
                        style={{
                            backgroundColor:'#404040',
                            borderBottomColor:nameError?'#f94144':'#212121',
                            borderBottomWidth:2,
                            padding:height<540?5:15,
                            color:'#fff',
                            fontSize:height<540?10:15,

                        }}
                    />
                    {nameError?<View ><Text style={{color:'#fff'}}>{nameErrorMessage}</Text></View>:null}
               </View>
               <View style={{width:'90%'}}>
                    <Text style={styles.lable}> Email</Text>
                        <TextInput
                            placeholderTextColor='#9d9d9d'
                            placeholder='Email'
                            value={email1}
                            onChangeText={(text)=>email1TextChanged(text)}
                            style={{
                                backgroundColor:'#404040',
                                borderBottomColor:email1Error?'#f94144':'#212121',
                                borderBottomWidth:2,
                                padding:height<540?5:15,
                                color:'#fff',
                                fontSize:height<540?10:15,
                            }}
                        />
                        {email1Error?<View ><Text style={{color:'#fff'}}>{email1ErrorMessage}</Text></View>:null}
               </View>
               <View style={{width:'90%'}}>
                    <Text style={styles.lable}> password</Text>
                        <TextInput
                            placeholderTextColor='#9d9d9d'
                            placeholder='Password'
                            value={pass1}
                            secureTextEntry
                            onChangeText={(text)=>pass1TextChanged(text)}
                            style={{
                                backgroundColor:'#404040',
                                borderBottomColor:pass1Error?'#f94144':'#212121',
                                borderBottomWidth:2,
                                color:'#fff',
                                fontSize:height<540?10:15,
                                padding:height<540?5:15,
                            }}
                        />
                        {pass1Error?<View ><Text style={{color:'#fff'}}>{pass1ErrorMessage}</Text></View>:null}

               </View>


            </View>

            <View style={{alignItems:'center'}} >
                {alreadyInUseError
                ?  <React.Fragment >
                        <Text style={{color:'#f27059',marginVertical:5}}>{alreadtInUseErrorMessage}</Text>

                        <TouchableOpacity onPress={sendPassResetEmail} style={{marginVertical:20}}><Text style={{color:'#4895ef'}}>Reset my password</Text></TouchableOpacity>
                    </React.Fragment>
                    :null}

                    {
                    emailSent?<Text style={{color:'#fff',marginVertical:15}}>{emailSentMessage}</Text>:null
                    }
            </View>

            <View style={{alignItems:'center'}}>
                <TouchableOpacity style={styles.addButton} onPress={singUpWithEmail} disabled={disable} >
                    {
                        isLoading?
                        <ActivityIndicator size='small' color='#fff' />
                        :
                        <Text style={styles.text}>Create</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

