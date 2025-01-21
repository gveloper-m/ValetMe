import { useState } from 'react';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, Linking , TouchableOpacity , Image} from 'react-native';



export default function Payment({ navigation }) {

            const handlePress = () => {
                console.log('Image Button Pressed!');
            };
    
        
            return (
              <View style={styles.container}>

    
                <View style={styles.bottommenu}>
    
                <TouchableOpacity onPress={handlePress}>
                <Image
                      source={require('./assets/bottommenu/qrcode.png')} 
                      style={{ width: 53, height: 50 }}
                    />
                  </TouchableOpacity>
    
                  <TouchableOpacity onPress={handlePress}>
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
    mapcontainer: {
        backgroundColor: '#7e7f83',
        width: '90%',
        height: '35%',
      
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10%', 
    },
    mapinfocontainer: {
        backgroundColor: '#34312d',
        width: '90%',
        height: '35%',
        alignItems: 'center',
        justifyContent: 'center',
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

    }
});




