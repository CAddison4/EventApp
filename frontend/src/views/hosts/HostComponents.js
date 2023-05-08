import axios from "axios";
import { API_END_POINT } from "@env";

export const getEventsWithAttendees = async () => {
	const apiURL = API_END_POINT;

	// Make request to get all events
	try {
		const eventsResponse = await axios.get(`${apiURL}events`);
		const events = eventsResponse.data;

		// Make separate request for attendees of each event
		const eventsWithAttendees = await Promise.all(
			events.map(async (event) => {
				// const attendeesResponse = await axios.get(
				// 	`${apiURL}attendee/users/${event.event_id}`
				// );
				const waitlistResponse = await axios.get(
					`${apiURL}waitlist/users/${event.event_id}`
				);
				// const attendees = attendeesResponse.data;
				const waitlist = waitlistResponse.data;
				const today = new Date();
				const eventDate = new Date(event.event_date);
				const type = eventDate >= today ? "upcoming" : "past";

				// eventObj.hasRoom = eventObj.number_of_attendees < eventObj.capacity ? true : false;
				// eventObj.capacityAvailable = eventObj.capacity - eventObj.number_of_attendees;
				return {
					...event,
					// attendees,
					waitlist,
					type,
				};
			})
		);
		return eventsWithAttendees;
	} catch (error) {
		//What do we want to do with this error?
		console.log(error);
	}
};
