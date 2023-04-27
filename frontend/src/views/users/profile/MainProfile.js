import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";
import { handleSignOut } from "../../../components/AuthComponents";

const MainProfile = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {
    handleSignOut();
  };


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
      <Button title="Sign Out" onPress={handleSubmit} />
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
