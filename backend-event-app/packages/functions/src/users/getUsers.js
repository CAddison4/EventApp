import { getUsers } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const users = await getUsers();

    if (!users) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve user records' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ users: users }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}