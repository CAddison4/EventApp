import React, { useState, useEffect } from "react";
import { CalendarList } from "react-native-calendars";

export default function Calendar({ markedDates, current}) {
  const [selected, setSelected] = useState("");

//   useEffect(() => {
//     setSelected(current);
//   }, [current]);

  return (
    <CalendarList
      key = {current}
      current={current}
      pastScrollRange={50}
      futureScrollRange={50}
      scrollEnabled={true}
      showScrollIndicator={true}
      markedDates={markedDates}
      disabledByDefault={true}
      disableAllTouchEventsForDisabledDays={true}
      disabledOpacity={0.4}
      calendarHeight={250}
      markingType={"multi-dot"}
      onDayPress={(day) => {
        setSelected(day.dateString);
      }}
      theme={{
        textDayFontSize: 18,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
        monthTextColor: "black",
        arrowColor: "black",
        textMonthFontWeight: "bold",
        todayTextColor: "lightblue",
        dotColor: "#7EC8E3",
        textDayStyle: { fontWeight: "bold" },
        // Add the following style to increase row height
        calendar: { height: "auto" },
      }}
    />
  );
}
