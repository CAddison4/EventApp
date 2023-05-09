import React, { useState } from 'react';
import { Button, Platform, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MyDateTimePicker({ mode, date, onDateChange, buttonTitle }) {
  const [show, setShow] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate !== undefined) {
      onDateChange(selectedDate);
    }
  };

  const handlePress = () => {
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress}
        style={styles.button}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
      {show && mode === 'date' && (
        <DateTimePicker
          style={{ backgroundColor: "green" }}
          mode="date"
          value={date}
          onChange={handleDateChange}
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
        />
      )}
      {show && mode === 'time' && (
        <DateTimePicker
          mode="time"
          value={date}
          onChange={handleDateChange}
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
        />
      )}
    </>
  );
}
styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: '#159E31',
    height: 35,
    width:130,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },

});
