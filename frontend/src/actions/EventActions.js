import axios from "axios";
import { API_END_POINT } from '@env';

export async function registerForEvent(eventObj, userId) {
    if (eventObj.attendee_status_id === "Invited") {
        try {
            const response = await axios.put(`${API_END_POINT}attendeestatus/${userId}/${eventObj.event_id}`, { status: "Registered"});
        } catch (error) {
            console.error(error); // log the error for debugging
            // handle the error here
        }
    }
    else
    {
        try {
            const response = await axios.post(`${API_END_POINT}attendee/${eventObj.event_id}/${userId}`, { status: "Registered"});
        } catch (error) {
            console.error(error); // log the error for debugging
            // handle the error here
        }
    }
    // update capacity for this event
    try {
        const response = await axios.put(`${API_END_POINT}event/capacity/${eventObj.event_id}`, { function_type: "add"});
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }	
}

export async function withdrawFromEvent(eventObj, userId) {
    if (eventObj.type_id === "Guest List") {
        try {
            const response = await axios.put(`${API_END_POINT}attendeestatus/${userId}/${eventObj.event_id}`, { status: "Invited"});
        } catch (error) {
            console.error(error); // log the error for debugging
            // handle the error here
        }
    }
    else {
        try {
            const response = await axios.delete(`${API_END_POINT}attendee/${eventObj.event_id}/${userId}`);
        } catch (error) {
            console.error(error); // log the error for debugging
            // handle the error here
        }
    }
    try {
        const response = await axios.put(`${API_END_POINT}event/capacity/${eventObj.event_id}`, { function_type: "subtract"});
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }		
}