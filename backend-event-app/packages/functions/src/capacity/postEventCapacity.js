import { createEventCapacity } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const capacity = await createEventCapacity(eventId);

    if (!capacity) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create event capacity record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ capacity: capacity }),
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