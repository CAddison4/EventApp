
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";
import { Auth } from "aws-amplify/lib-esm";
import {handleSignOut} from '../../../components/AuthComponents'

const PendingMembership = () => {
    
    const user = useSelector((state) => state.user);

    const handleSubmit = () => {
        console.warn("Sign out In Pending Membership")
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

export default PendingMembership;