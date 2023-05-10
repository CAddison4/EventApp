import axios from "axios";
import { API_END_POINT } from "@env";

export const getEventsWithAttendees = async () => {
	const apiURL = API_END_POINT;

	try {
		const eventsResponse = await axios.get(`${apiURL}events`);
		const events = eventsResponse.data;

		const eventsWithAttendees = await Promise.all(
			events.map(async (event) => {
				const waitlistResponse = await axios.get(
					`${apiURL}waitlist/users/${event.event_id}`
				);

				const waitlist = waitlistResponse.data;
				const today = new Date();
				const eventDate = new Date(event.event_date);
				const type = eventDate >= today ? "upcoming" : "past";
				return {
					...event,
					waitlist,
					type,
				};
			})
		);
		return eventsWithAttendees;
	} catch (error) {
		console.log(error);
	}
};
