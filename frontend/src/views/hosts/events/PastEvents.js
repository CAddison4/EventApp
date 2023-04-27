import { View, Text, Button, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import EventsListHost from "../../partials/hostPartials/EventsListHost";

export default function PastEvents() {
	return <EventsListHost eventView={"past"} />;
}
