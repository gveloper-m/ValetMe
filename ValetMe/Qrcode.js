import { useState, useEffect } from 'react';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, Linking, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Qrcode({ navigation }) {
  // State to store the retrieved username
  const [savedUsername, setSavedUsername] = useState('');

  useEffect(() => {
    // Function to retrieve the stored value from AsyncStorage
    const loadData = async () => {
      const username = await AsyncStorage.getItem('username');
      if (username) {
        setSavedUsername(username); // Set the username if it exists
      }
    };

    // Call the loadData function when the component mounts
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.qrcodecontainer}>
        {/* Only render QRCode if savedUsername is available */}
        {savedUsername ? (
          <QRCode
            value={savedUsername}  // Use the saved username for the QR code
            size={240}  // Adjust size as needed
            color="black"  // Set the color of the QR code
            backgroundColor="#d9c5b2"  // Set background color
          />
        ) : (
          <Text>Loading...</Text>  // Display loading text while waiting for the username
        )}

        <Text  style={styles.qrname}>
        {savedUsername}
        </Text>
      </View>

      <View style={styles.bottommenu}>
        <TouchableOpacity onPress={() => navigation.navigate('Qrcode')}> 
          <Image
            source={require('./assets/bottommenu/qrcode.png')} 
            style={{ width: 53, height: 50 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Payment')}> 
          <Image
            source={require('./assets/bottommenu/payment.png')} 
            style={{ width: 45, height: 50 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>          
          <Image
            source={require('./assets/bottommenu/Home.png')} 
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Account')}>          
          <Image
            source={require('./assets/bottommenu/account.png')}
            style={{ width: 55, height: 55 }}
          />
        </TouchableOpacity>
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
        paddingHorizontal: 0,
        width: '100%', 
        paddingTop: '25%', 
    },
    qrcodecontainer:{
      height: '65%',
      backgroundColor: '#FFFFFF;',
      alignItems: 'center',
      justifyContent: 'space-around', 
      paddingHorizontal: 0,
      width: '90%', 
      borderWidth: 5,
      borderColor: '#7e7f83',
      borderRadius: 0,
      marginBottom: 20, 
   
    },
    bottommenu: {
        backgroundColor: '#34312d',
        width: '100%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-evenly', 
        position: 'absolute',
        bottom: 0, 
        paddingBottom: '10',
        paddingTop: '10',

    },
    qrname:{
      fontSize: 30,
      fontWeight: 500
    }
});




