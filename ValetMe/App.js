import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TextInput } from 'react-native';

import Register from './Register';
import Home from './Home';
import Account from './Account';
import Qrcode from './Qrcode';
import Payment from './Payment';


import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect } from 'react';

const Stack = createStackNavigator();

//function to send name and password in node.js server
function SendLogin(name, pass) {
  console.log(name);
  console.log(pass);

  // Send the POST request with plain text body
  fetch('http://192.168.1.6:3000/login/data', {
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain', // Indicate the data is plain text
      },
      body: `name=${name}&password=${pass}`, // Send data as a simple string
  })
  .then(response => response.text()) // Parse the response as plain text
  .then(result => {
      console.log('Server Response:', result); // Log the response from the server
  })
  .catch(error => {
      console.error('Error sending data:', error); // Log errors
  });
}

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Function to retrieve the stored values from AsyncStorage
    const loadData = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem('username');
            const savedPassword = await AsyncStorage.getItem('password');

            if (savedUsername && savedPassword) {
              setUsername(savedUsername);
              setPassword(savedPassword);
              console.log("Saved user data exists");
              navigation.navigate('Home'); 
          }



        } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
        }
    };

    // Call the loadData function when the component mounts
    loadData();
}, []);

  return (
    <View style={styles.container}>
      {/* Title - Adjusted to be slightly lower */}
      <Text style={styles.title}>Welcome Again!</Text>
      
      {/* Input Fields - Absolutely centered */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username/Email"
          placeholderTextColor="#f3f3f4"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#f3f3f4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.loginbutton}
        onPress={ () =>SendLogin(username, password)}>
          Login
        </Text>
      </View>

      {/* Bottom Text Buttons - Positioned a bit higher than inputs */}
      <View style={styles.textButtonContainer}>
        <Text style={styles.textButton} onPress={() => navigation.navigate('Register')}>
          Don't have an account?
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator   
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Qrcode" component={Qrcode} />
        <Stack.Screen name="Account" component={Account} />


      </Stack.Navigator>
    </NavigationContainer>
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

  loginbutton:{
    fontSize:18,
    color:'#34312d',
  },
});
