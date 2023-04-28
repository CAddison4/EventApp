import EventsListHost from "../../partials/hostPartials/EventsListHost";

/**
 * Component for displaying past events for host
 * @component
 * @returns view of past events for host
 */

export default function PastEvents() {
	return <EventsListHost eventView={"past"} />;
}
