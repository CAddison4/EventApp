import { View, Text, Button } from "react-native";
export default function EventDetailsHost({ navigation, route }) {
  const eventObj = route.params.eventObj;
  const eventId = eventObj.event_id;
  
  return (
    <View>
      {eventObj && 
        <>
          <Text>Event Details for event {eventId}</Text>
          <Button title="Set Invites" onPress={() => navigation.navigate("InviteList", { eventId: eventId })}></Button>
        </>
      }
    </View>
  );
}
