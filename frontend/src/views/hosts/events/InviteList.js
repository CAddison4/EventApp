import Checkbox from 'expo-checkbox';
import axios from "axios";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { API_END_POINT } from "@env";


export default function InviteList({ navigation, route }) {
	const eventId = route.params.eventId;
  // fetch user list from backend
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [originalChecked, setOriginalChecked] = useState([]);

  
// fetch all the users and also fetch the list of users that are already invited
// check if the userid is in the list of invited users
  useEffect(() => {
	const getUsers = async () => {
	  const apiURL = API_END_POINT;
	  const response = await axios.get(`${apiURL}/users`);
	  const data = response.data;
	  setUsers(data);
	};
	getUsers();

	const getInvitedUsers = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(`${apiURL}/attendee/users/${eventId}`);
		const data = response.data;
		// create a list of user_ids that are already invited
		const users = data.map((user) => user.user_id);
		if(users.length > 0){
			setChecked(users);
			setOriginalChecked(users);
		}
	};
	getInvitedUsers();

	}, []);


  const handleCheck = (user_id) => {
	setChecked((checked) => {
	  // if user_id is already in checked, remove it
	  if (checked.includes(user_id)) {
		return checked.filter((id) => id !== user_id);
	  }
	  // otherwise, add it to checked
	  return [...checked, user_id];
	});
  };
  
  const handleSubmit = async () => {
	const apiURL = API_END_POINT;
	// send checked to backend
	// filter out the users that are no longer checked
	const unchecked = originalChecked.filter((user_id) => !checked.includes(user_id));
	console.log("unchecked", unchecked);
	if(unchecked.length > 0){
		unchecked.map(async (user_id) => {
			await axios.delete(`${apiURL}/attendee/${eventId}/${user_id}`);
		  });
	}

	// filter out the users that are checked but not in the original checked list
	const invited = checked.filter((user_id) => !originalChecked.includes(user_id));
	console.log("invited",invited);
	if(invited.length > 0){
		invited.map(async (user_id) => {
			await axios.post(`${apiURL}/attendee/${eventId}/${user_id}`,{status:"Invited"});
		  });
	}
	// navigate back to the event details page
	navigation.navigate("EventDetailsHost", { eventId: eventId });

	};

  return (
    <View>
      <Text>All Users</Text>
	  <Text>Event - {eventId}</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text onPress={() => navigation.navigate("UserDetails", { user: item })}>
              {item.first_name} {item.last_name}
            </Text>
            <Checkbox
				value={checked.includes(item.user_id)}
				onValueChange={() => handleCheck(item.user_id)}

            />
          </View>
        )}
      />
	  <Button title = "Save" onPress={ handleSubmit } ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  },
});
