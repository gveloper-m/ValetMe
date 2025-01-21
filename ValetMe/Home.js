import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import ReservationPopup from './ReservationPopup'; // Import the popup component

export default function Home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); // Popup visibility

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    fetch('http://192.168.1.6:3000/parking/data')
      .then((response) => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched parking data:', data);
        setParkingData(data);
      })
      .catch((error) => {
        console.error('Error fetching parking data:', error);
      });
  }, []);

  const handleMarkerPress = (loc) => {
    setSelectedParking(loc);
  };

  const calculateDistance = (parking) => {
    if (location && parking) {
      const distance = getDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: parseFloat(parking.latitude), longitude: parseFloat(parking.longitude) }
      );
      return (distance / 1000).toFixed(2);
    }
    return 0;
  };

  const openDirections = (link) => {
    Linking.openURL(link);
  };

  const openReservationModal = () => {
    setModalVisible(true);
  };

  const closeReservationModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        {location ? (
          <MapView
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="purple"
            />

            {parkingData.map((loc) => (
              <Marker
                key={loc.id}
                coordinate={{
                  latitude: parseFloat(loc.latitude),
                  longitude: parseFloat(loc.longitude),
                }}
                title={`Parking ${loc.id}`}
                pinColor="green"
                onPress={() => handleMarkerPress(loc)}
              />
            ))}
          </MapView>
        ) : (
          <Text>{errorMsg || 'Loading your location...'}</Text>
        )}
      </View>

      <View style={styles.mapinfocontainer}>
        {selectedParking ? (
          <View>
            <Text style={styles.infoTitle}>{selectedParking.name}</Text>
            <Text style={styles.infoText}>Hourly Rate: {selectedParking.hrate}€</Text>
            <Text style={styles.infoText}>Empty Spots: {selectedParking.spots}</Text>
            <Text style={styles.infoText}>
              Stars: {selectedParking.stars} {Array(selectedParking.stars).fill('★')}
            </Text>
            <Text style={styles.infoText}>
              Distance: {calculateDistance(selectedParking)} km
            </Text>

            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => openDirections(selectedParking.link)}
            >
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>

                  <TouchableOpacity
        style={styles.directionsButton}
        onPress={() => openReservationModal(selectedParking.hrate, selectedParking.name)} // Pass as a function
      >
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>

          </View>
        ) : (
          <Text style={styles.infoText}>Select a parking location to view details</Text>
        )}
      </View>

      {isModalVisible && (
        <ReservationPopup
          selectedParking={selectedParking}
          closeModal={closeReservationModal}
        />
      )}

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
  mapcontainer: {
    backgroundColor: '#7e7f83',
    width: '90%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  mapinfocontainer: {
    backgroundColor: '#34312d',
    width: '90%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#7e7f83',
    borderRadius: 0,
    marginBottom: 20,
    padding: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  directionsButton: {
    backgroundColor: '#7e7f83',
    padding: 10,
    borderRadius: 0,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
});
