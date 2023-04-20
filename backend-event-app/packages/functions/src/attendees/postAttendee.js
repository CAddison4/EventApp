import { createAttendee } from "@packages/core/src/database";

export async function main(event) {
  try {
    const body = JSON.parse(event.body);

    if (!body.eventId || !body.userId || !body.attendeeStatus) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required input parameters' })
      };
    }

    const attendee = await createAttendee(body.eventId, body.userId, body.attendeeStatus);

    if (res.rows.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create event attendee' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ attendee: attendee }),
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