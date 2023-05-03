import React, { useState } from 'react';
import { Button, Platform } from 'react-native'; // Platformをインポート
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
      <Button title={buttonTitle} onPress={handlePress} />
      {show && mode === 'date' && (
        <DateTimePicker
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
