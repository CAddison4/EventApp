import { anyCapacity } from "@packages/core/src/database";

export async function main(event) {

  try {

    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const anyCapacityAvailable = await anyCapacity(eventId);
    return {
      statusCode: 200,
      body: JSON.stringify({ anyCapacityAvailable }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
