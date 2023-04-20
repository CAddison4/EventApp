import { getEvents } from "@packages/core/src/database";

export async function main(event) {

  try {
    const events = await getEvents();

    if (!events) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve event records' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ events: events }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}