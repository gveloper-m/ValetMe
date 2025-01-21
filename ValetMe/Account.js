import { useState, useEffect } from 'react';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';  // Updated import

export default function Account({ navigation }) {
  const [username, setUsername] = useState('');
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filter, setFilter] = useState('All'); // Default filter is "All"

  // Fetch username and reservations on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        setUsername(savedUsername);

        // Fetch reservations from the Node.js backend
        const response = await axios.get('http://192.168.1.6:3000/getreservations', {
          params: { username: savedUsername },
        });
        setReservations(response.data);
        setFilteredReservations(response.data); // Initially show all reservations
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to determine the status of the reservation
  const getReservationStatus = (startingDate) => {
    const now = new Date();
    const reservationDateObj = new Date(startingDate);

    if (reservationDateObj < now) {
      return 'Old'; // Past date
    } else if (reservationDateObj.toDateString() === now.toDateString()) {
      return 'Active'; // Current date
    } else {
      return 'Future'; // Future date
    }
  };

  // Filter reservations based on selected status
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'All') {
      setFilteredReservations(reservations); // Show all
    } else {
      const filtered = reservations.filter((reservation) => getReservationStatus(reservation.starting_date_time) === status);
      setFilteredReservations(filtered); // Filter by status
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Welcome, {username}</Text>

      {/* Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <Picker
          selectedValue={filter}
          style={styles.filterPicker}
          onValueChange={handleFilterChange}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Active" value="Active" />
          <Picker.Item label="Old" value="Old" />
          <Picker.Item label="Future" value="Future" />
        </Picker>
      </View>

      {/* Scrollable list of reservations */}
      <ScrollView style={styles.reservationList}>
        {filteredReservations.map((reservation, index) => {
          const status = getReservationStatus(reservation.starting_date_time);
          return (
            <View key={index} style={styles.reservationItem}>
              <Text style={styles.reservationText}>Cost: ${reservation.total_cost}</Text>
              <Text style={styles.reservationText}>When: {new Date(reservation.starting_date_time).toLocaleString()}</Text>
              <Text style={styles.reservationText}>Where: {reservation.parking_name}</Text>
              <Text style={[styles.reservationText, styles[status]]}>Status: {status}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottommenu}>
        <TouchableOpacity onPress={() => navigation.navigate('Qrcode')}>
          <Image source={require('./assets/bottommenu/qrcode.png')} style={{ width: 53, height: 50 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
          <Image source={require('./assets/bottommenu/payment.png')} style={{ width: 45, height: 50 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./assets/bottommenu/Home.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image source={require('./assets/bottommenu/account.png')} style={{ width: 55, height: 55 }} />
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
    paddingTop: 20,

  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  filterPicker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  reservationList: {
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 20,
  },
  reservationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  reservationText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  Old: {
    color: 'gray',
  },
  Active: {
    color: 'green',
  },
  Future: {
    color: 'blue',
  },
  bottommenu: {
    backgroundColor: '#34312d',
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
  },
});
