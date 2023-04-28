import EventsListHost from "../../partials/hostPartials/EventsListHost";

/**
 * Component for displaying upcoming events for host
 * @component
 * @returns view of upcoming events for host
 */

export default function UpcomingEvents() {
	return <EventsListHost eventView={"upcoming"} />;
}
