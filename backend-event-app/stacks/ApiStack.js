import { Api } from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

export function API({ stack }) {

  const api = new Api(stack, "api", {
    routes: {
      // Routes for getting records from status type tables
      "GET /membership": "packages/functions/src/general/getMembership.main",
      "GET /eligibility": "packages/functions/src/general/getEligibility.main",
      "GET /attendeestatus": "packages/functions/src/general/getAttendeeStatus.main",
      "GET /attendancestatus": "packages/functions/src/general/getAttendanceStatus.main",
      // Routes for getting single/all users, creating and updating users
      "GET /users": "packages/functions/src/users/getUsers.main",
      "GET /user/{userId}": "packages/functions/src/users/getUser.main",
      "POST /user": "packages/functions/src/users/postUser.main",
      "PUT /user/{userId}": "packages/functions/src/users/putUser.main",
      // Routes for getting single/all events, creating and updating events
      "GET /events": "packages/functions/src/events/getEvents.main",
      "GET /event/{eventId}": "packages/functions/src/events/getEvent.main",
      "POST /event": "packages/functions/src/events/postEvent.main",
      "PUT /event/{eventId}": "packages/functions/src/events/putEvent.main",
      // Routes for creating an attendee, getting attendees for an event, getting events for a specific attendee, getting a specific attendee
      "POST /attendee": "packages/functions/src/attendees/postAttendee.main",
      "GET /attendee/events/{userId}": "packages/functions/src/attendees/getAttendeeEvents.main",
      "GET /attendee/users/{eventId}": "packages/functions/src/attendees/getAttendeeUsers.main",
      "GET /attendee/{userId}/{eventId}": "packages/functions/src/attendees/getAttendee.main",
      // Routes for updating an attendee status or attendance status
      "PUT /attendeestatus/{userId}/{eventId}": "packages/functions/src/attendees/putAttendeeStatus.main",
      "PUT /attendancestatus/{userId}/{eventId}": "packages/functions/src/attendees/putAttendanceStatus.main",
      // Routes for creating and deleting waitlist entries
      "POST /waitlist/{eventId}/{userId}": "packages/functions/src/waitlist/postWaitlist.main",
      "DELETE /waitlist/{eventId}/{userId}": "packages/functions/src/waitlist/deleteWaitlist.main",
      // Routes for getting users waitlisted for an event, getting events a user is waitlisted for
      "GET /waitlist/{eventId}": "packages/functions/src/waitlist/getEventWaitlist.main",
      "GET /waitlist/{userId}": "packages/functions/src/waitlist/getUserWaitlist.main",
      // Routes for finding a user's position in a waitlist, checking if any capacity remains in an event, getting the count of events a user has attended previously
      "GET /waitlistposition/{eventId}/{userId}": "packages/functions/src/waitlist/getWaitlistPosition.main",
      "GET /anycapacity/{eventId}": "packages/functions/src/waitlist/getAnyCapacity.main",
      "GET /loyalty/{userId}": "packages/functions/src/waitlist/getLoyaltyCount.main",
    },
    authorizer: {
      name: "none"
    }
    
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    api, auth
  };
}
