import { getMembershipStatuses } from "@packages/core/src/database";

export async function main(event) {
  try {
    const membershipStatuses = await getMembershipStatuses()

    if (!membershipStatuses) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve membership statuses' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ membershipStatuses: membershipStatuses }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}