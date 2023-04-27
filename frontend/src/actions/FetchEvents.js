import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

import { API_END_POINT } from '@env';

import { registerForEvent, withdrawFromEvent } from "../../../actions/EventActions";
import { waitlistForEvent, removeFromEventWaitlist } from "../../../actions/WaitlistActions";

import EventListItem from "../../../components/EventListItem";

export async function fetchEvents(){
    const getEvents = async () => {
        let loyaltyCount = 0;
        if (type === "upcoming") {
            loyaltyCount = await getLoyaltyCount(userId);
        }
        const response = await axios.get(`${API_END_POINT}attendee/events/${userId}`);

        const data = response.data;
        let filteredEvents = data.filter(eventObj => new Date(eventObj.event_date) > today);
        
        await Promise.all(filteredEvents.map(async (eventObj) => {
            await determineEventFlags(eventObj, loyaltyCount);
        }));
        
        if (type === "myevents") {
            filteredEvents = filteredEvents.filter(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist);
        }
        setEvents(filteredEvents);
    };
    getEvents();
    setReRender(false);
}



const determineEventFlags = async (eventObj, loyaltyCount) => {

    const eligibility = [];

    switch (eventObj.type_id) {
        case ("Bronze Tier"):
            eligibility.push("Bronze");
        case ("Silver Tier"):
            eligibility.push("Silver");
        case ("Gold Tier"):
            eligibility.push("Gold");
        default:
            break;
    }
    // Check if there is any capacity available in the event
    let response = await axios.get(`${API_END_POINT}anycapacity/${eventObj.event_id}`);
    eventObj.hasRoom = response.data.anyCapacityAvailable;

    // User is already attending if status is "Registered"
    eventObj.isAttending = eventObj.attendee_status_id === "Registered"  ? true : false;

    // User is eligible if status is "Invited", or type is "Guest List" and user is
    // "Registered", or type is "Loyalty" and event count for this user exceeds the
    // count required for this event.
    // If none of these conditions are met, the user is eligible if their membership
    // status qualifies for this tier.
    if (eventObj.attendee_status_id === "Invited" ||
       (eventObj.type_id === "Guest List" && eventObj.attendee_status_id === "Registered") || (eventObj.type_id === "Loyalty" && loyaltyCount >= eventObj.loyalty_max)) {
        eventObj.isEligible = true;		
    }
    else {
        eventObj.isEligible = eligibility.includes(membership_status) ? true : false;
    }

    // Check if the user is already in the waitlist for this event
    response = await axios.get(`${API_END_POINT}waitlist/inwaitlist/${eventObj.event_id}/${userId}`);
    eventObj.isInWaitlist = response.data.waitlist > 0 ? true : false;
};