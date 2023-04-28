import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";
import { handleSignOut } from "../../../components/AuthComponents";
import {showLoyaltyCalculation} from "../../../components/alerts/LoyaltyAlert"

const MainProfile = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {
    handleSignOut();
  };

  const handleLoyalty = () => {
    showLoyaltyCalculation();
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
          <TouchableOpacity onPress={handleLoyalty}>
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
