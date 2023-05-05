import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const YearPicker = ({ onSelect }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState([]);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      years.push({ label: `${i}`, value: i });
    }
    return years;
  };

  useEffect(() => {
    setYears(generateYears());
    setOpen(true);
  }, []);

  return (
    <View>
      <Text>Select Year:</Text>
      <DropDownPicker
        open={open}
        value={selectedYear}
        items={years}
        setOpen={setOpen}
        setValue={setSelectedYear}
        onChangeValue={(value) => {
          setSelectedYear(value);
          onSelect(value); // pass the selected year to the parent component
        }}
      />
    </View>
  );
};

export default YearPicker;
