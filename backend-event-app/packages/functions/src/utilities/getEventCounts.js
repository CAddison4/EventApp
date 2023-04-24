import { eventCounts } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const userId = event.pathParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const counts = await eventCounts(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(counts),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}