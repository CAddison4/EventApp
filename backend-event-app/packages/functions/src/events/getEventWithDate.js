import { getEventWithDate } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const eventDate = event.pathParameters.date;

    console.log(eventDate)

    if (!eventDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const res = await getEventWithDate(eventDate);

    if (!res) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve event record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
