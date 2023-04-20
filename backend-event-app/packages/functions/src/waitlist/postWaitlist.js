import { createWaitlist } from "@backend-event-app/core/database";

export async function main(event) {
  
  try {

    const eventId = event.pathParameters.eventId;
    const userId = event.pathParameters.userId;

    if (!eventId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const waitlist = await createWaitlist(eventId, userId);

    if (waitlist.rows.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create waitlist record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ waitlist: waitlist }),
    }
  } catch (error) {
    // Error handling logic
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}