import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Register({ navigation }) {

  function SendRegister(name, mail, password, country, zipcode) {
    console.log(name, mail, password, country, zipcode);
  
    // Send the POST request with plain text body
    fetch('http://192.168.1.6:3000/register/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain', // Indicate the data is plain text
        },
        body: `name=${name}&mail=${mail}&password=${password}&country=${country}&zipcode=${zipcode}`, // Send data as a simple string
    })
    .then(response => response.text()) // Parse the response as plain text
    .then(result => {
        console.log('Server Response:', result); // Log the response from the server
        if (result == 100) {
          // Store the username, email, and password using AsyncStorage
          AsyncStorage.setItem('username', name)
              .then(() => console.log('Username saved successfully'))
              .catch(error => console.error('Error saving username:', error));

        

          AsyncStorage.setItem('password', password)
              .then(() => console.log('Password saved successfully'))
              .catch(error => console.error('Error saving password:', error));

              navigation.navigate('Login');
      }
    })
    .catch(error => {
        console.error('Error sending data:', error); // Log errors
    });
  }
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [Country, setCountry] = useState('');
    const [ZipCode, setZipCode] = useState('');

    return (
        <View style={styles.container}>
          {/* Title - Adjusted to be slightly lower */}
          <Text style={styles.title}>Welcome to ValetMe!</Text>
          
          {/* Input Fields - Absolutely centered */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#f3f3f4"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#f3f3f4"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#f3f3f4"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.rowinputContainer}>
          <TextInput
              style={styles.halfinput}
              placeholder="Country"
              placeholderTextColor="#f3f3f4"
              secureTextEntry
              value={Country}
              onChangeText={setCountry}
            />
            <TextInput
              style={styles.halfinput}
              placeholder="Zip-Code"
              placeholderTextColor="#f3f3f4"
              secureTextEntry
              value={ZipCode}
              onChangeText={setZipCode}
            />

         

          </View>
          </View>

          

        <View style={styles.registerContainer}>
            <Text style={styles.registerbutton}
                onPress={ () =>SendRegister(username, email, password, Country, ZipCode)}>
                Register
            </Text>
        </View>
          {/* Bottom Text Buttons - Positioned a bit higher than inputs */}
          <View style={styles.textButtonContainer}>
            <Text style={styles.textButton} onPress={() => navigation.navigate('Login')}>
            Already have an account?
            </Text>
            <Text style={styles.textButton} 
            onPress={() => {
                // Open the URL in the default browser
                Linking.openURL('https://your-link-here.com')
                  .catch((err) => console.error('Failed to open URL:', err));
              }}
            >Work with us</Text>
            <Text style={styles.textButton} 
            onPress={() => {
            // Open the URL in the default browser
            Linking.openURL('https://your-link-here.com')
            .catch((err) => console.error('Failed to open URL:', err));
            }}
            >FAQ</Text>
          </View>
        </View>
      );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#d9c5b2',
      alignItems: 'center',
      justifyContent: 'flex-start', 
      paddingHorizontal: 20,
      width: '100%', // Ensure full width
      flexDirection: 'column',  // Align children horizontally (row)
      justifyContent: 'space-between', // Optional: Adjust spacing between items
      alignItems: 'center', // Align items vertically centered within the row
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 70,
      marginBottom: 30,
      color: '#f3f3f4',
    },
    inputContainer: {
      width: '100%', // Ensure full width for the input container
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -150 }, { translateY: -100 }], // Center the inputs
    },
    rowinputContainer: {
        width: '100%',
     
        flexDirection: 'row',  // Align children horizontally (row)
        justifyContent: 'space-between', // Optional: Adjust spacing between items
        alignItems: 'center', // Align items vertically centered within the row
      },
    input: {
      width: '100%', // Input takes up the full width
      height: 40,
      borderColor: '#d9c5b2',
      borderWidth: 1,
      marginBottom: 15,
      paddingLeft: 10,
      borderRadius: 5,
      backgroundColor: '#34312d',
      color: '#f3f3f4',
      borderRadius:0,
    },
    halfinput: {
        width: '50%', 
        height: 40,
        borderColor: '#d9c5b2',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#34312d',
        color: '#f3f3f4',
        borderRadius:0,
      },
      registerContainer: {
        position: 'absolute',
        top: '85%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -30 }],
        alignItems: 'flex-start',
        width: '100%',
      },
      registerbutton:{
        fontSize:18,
        color:'#34312d',
      },
    textButtonContainer: {
      position: 'absolute',
      top: '90%',
      left: '50%',
      transform: [{ translateX: -150 }, { translateY: -30 }],
      alignItems: 'flex-start',
      width: '100%',
    },
    textButton: {
      fontSize: 18,
      color: '#eeeeee',
      marginBottom: 10,
      paddingLeft: 10,
    },
  });
