import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";


const MainProfile = () => {
  const user = useSelector((state) => state.user);


  if (!user) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      {Object.keys(user).map((key) => (
        <View key={key}>
          <Text>
            {key}: {user[key]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MainProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
