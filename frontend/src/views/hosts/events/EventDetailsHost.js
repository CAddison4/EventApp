import { View, Text, Button } from "react-native";
export default function EventDetailsHost({ navigation, route }) {
  const eventObj = route.params.eventObj;
  const eventId = eventObj.event_id;

  return (
    <View>
      {eventObj && 
        <>
          <Text>Event Details for event {eventId}</Text>
          <Text>Name: {eventObj.event_name}</Text>
          <Text>Date: {eventObj.event_date}</Text>
          <Text>Location: {eventObj.event_location}</Text>
          <Text>Capacity: {eventObj.capacity}</Text>

          {eventObj.type_id ==="Guest List" &&
            <Button title="Set Invites" onPress={() => navigation.navigate("InviteList", { eventObj: eventObj })}></Button>
          }

        </>
      }
    </View>
  );
}
