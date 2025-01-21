import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReservationPopup({ selectedParking, closeModal }) {
  const [startingDate, setStartingDate] = useState(new Date());
  const [startingTime, setStartingTime] = useState(new Date());
  const [finishingDate, setFinishingDate] = useState(new Date());
  const [finishingTime, setFinishingTime] = useState(new Date());
  const [totalCost, setTotalCost] = useState(null);
  const [hours, setHours] = useState(null);
  const [showPicker, setShowPicker] = useState({ field: null });
  const [username, setUsername] = useState('');

  // Function to calculate total cost and number of hours
  const calculateTotalCost = () => {
    const startDateTime = new Date(
      startingDate.getFullYear(),
      startingDate.getMonth(),
      startingDate.getDate(),
      startingTime.getHours(),
      startingTime.getMinutes()
    );

    const finishDateTime = new Date(
      finishingDate.getFullYear(),
      finishingDate.getMonth(),
      finishingDate.getDate(),
      finishingTime.getHours(),
      finishingTime.getMinutes()
    );

    if (finishDateTime <= startDateTime) {
      Alert.alert('Error', 'Finishing time must be later than starting time.');
      setTotalCost(null);
      setHours(null);
      return;
    }

    const durationInMilliseconds = finishDateTime - startDateTime;
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
    setHours(durationInHours); // Save the duration in hours

    const calculatedTotalCost = durationInHours * parseFloat(selectedParking.hrate);
    setTotalCost(calculatedTotalCost);
  };

  // Send data to the server
  const sendToNodeServer = async () => {
    const startDateTime = new Date(
      startingDate.getFullYear(),
      startingDate.getMonth(),
      startingDate.getDate(),
      startingTime.getHours(),
      startingTime.getMinutes()
    );
  
    const finishDateTime = new Date(
      finishingDate.getFullYear(),
      finishingDate.getMonth(),
      finishingDate.getDate(),
      finishingTime.getHours(),
      finishingTime.getMinutes()
    );
  
    // Get the username from AsyncStorage
    const savedUsername = await AsyncStorage.getItem('username');
    
    // Prepare the data to send
    const dataToSend = {
      parkingId: selectedParking.id,
      parkingName: selectedParking.name,
      startingDateTime: startDateTime.toISOString(),
      finishingDateTime: finishDateTime.toISOString(),
      totalCost,
      rate: selectedParking.hrate,
      username: savedUsername,
      hours
    };
  
    // Log the data to verify it
    console.log('Sending reservation data:', dataToSend);
  
    try {
      const response = await fetch('http://192.168.1.6:3000/reservations/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send reservation data');
      }
  
      const data = await response.json();
      console.log('Data successfully sent to the new server endpoint:', data);
      Alert.alert('Success', 'Reservation data sent to the server successfully!');
    } catch (error) {
      console.error('Error sending reservation data to the server:', error);
      Alert.alert('Error', 'Failed to send reservation data to the server.');
    }
  };

  const handleReserve = () => {
    if (totalCost === null || hours === null) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }

    sendToNodeServer();
  };

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reserve Parking</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ field: 'startingDate' })}
          >
            <Text>{`Starting Date: ${startingDate.toISOString().split('T')[0]}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ field: 'startingTime' })}
          >
            <Text>{`Starting Time: ${startingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ field: 'finishingDate' })}
          >
            <Text>{`Finishing Date: ${finishingDate.toISOString().split('T')[0]}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker({ field: 'finishingTime' })}
          >
            <Text>{`Finishing Time: ${finishingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
          </TouchableOpacity>

          {showPicker.field && (
            <DateTimePicker
              value={
                showPicker.field.includes('Date')
                  ? (showPicker.field === 'startingDate' ? startingDate : finishingDate)
                  : (showPicker.field === 'startingTime' ? startingTime : finishingTime)
              }
              mode={showPicker.field.includes('Date') ? 'date' : 'time'}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setShowPicker({ field: null });
                if (!date) return;

                if (showPicker.field === 'startingDate') setStartingDate(date);
                if (showPicker.field === 'startingTime') setStartingTime(date);
                if (showPicker.field === 'finishingDate') setFinishingDate(date);
                if (showPicker.field === 'finishingTime') setFinishingTime(date);

                calculateTotalCost();
              }}
            />
          )}

          {totalCost !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Total Cost: ${totalCost.toFixed(2)}</Text>
              <Text style={styles.resultText}>Total Hours: {hours.toFixed(2)} hours</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleReserve}>
            <Text style={styles.buttonText}>Confirm Reservation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
