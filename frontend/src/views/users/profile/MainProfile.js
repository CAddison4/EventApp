import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";
import { handleSignOut } from "../../../components/AuthComponents";

const MainProfile = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {
    handleSignOut();
  };

  const showLoyaltyCalculation = () => {
    console.log("showLoyaltyCalculation");
    Alert.alert(
      "Loyalty Calculation",
      "Your loyalty level is calculated based on the number of events you have attended. Any event you attend will increase your loyalty level by 1. Events that are cancelled or that you do not attend will not affect your loyalty level.",
      [{ text: "OK" }]
    );
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const { user_id, ...userData } = user; // Destructure user_id and spread the remaining user data into userData

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Profile</Text>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{userData.first_name}</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{userData.last_name}</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.label}>Membership Status:</Text>
          <Text style={styles.value}>{userData.membership_status_id}</Text>
        </View>

        <View style={styles.userInfoItem}>
          <TouchableOpacity onPress={showLoyaltyCalculation}>
            <Text style={[styles.label, styles.underline]}>Loyalty:</Text>
          </TouchableOpacity>
          <Text style={styles.value}>
            {userData.eventCount}
          </Text>
        </View>

        <Button title="Sign Out" onPress={handleSubmit} />
      </View>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfoContainer: {
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 20,
  },
  userInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {},
  underline: {
    textDecorationLine: "underline",
  },
});
