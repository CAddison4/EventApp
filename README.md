# BCIT 2022-2023 Agilitek 3 ISSP

- [Getting Started](#getting-started)
- [Set up CockroachDB](#set-up-cockroachdb)
- [Set up AWS](#set-up-aws)
- [Set up the Front End](#set-up-the-front-end)
- [Set up the Back End](#set-up-the-back-end)
- [Set up the Authorization](#set-up-the-authorization)
- [Create a Host Account](#create-a-host-account)
- [Functional Features](#functional-features)
- [Wireframes](#wireframes)
- [Use Case Diagram](#use-case-diagram)
- [Daily Standups](#daily-standups)

## Getting Started

Before getting started, make sure you have the following dependencies installed:

- Node.js: https://nodejs.org/en/
- Amplify CLI: https://docs.amplify.aws/cli/start/install
- AWS CLI: https://aws.amazon.com/cli/

You will also need a CockroachDB account to get the app up and running right away. Create a cluster and save your credentials. The database script syntax may not work for other PostgreSQL or MySQL databases.

### Set up CockroachDB

1. Create a CockroachDB account and a cluster. Save the username and password that are generated.
2. Create a database and select connect.
3. Save the general connection string for later to point the SST to this database.
4. Run the Download CA Cert script in the same page as the General connection string.
5. Change the "Select option/language" to CockroachDB Client.
6. Download the latest CockroachDB Client for your OS and run it in the terminal.
7. Run the DB connection string that starts with `cockroach sql -url`.
8. Run the database script in the terminal. It can be found in the root directory of the backend.

### Set up AWS

1. Create an IAM user and give it an AWS CLI Access Key if you do not have one already. Save the keys as you will use them a few times in this setup.
2. Attach the Administrator access policy to your IAM user.
3. Login to the AWS CLI with `aws configure`.

### Set up the front end

1. Change into the front end directory and run `npm install` to install the package dependencies.
2. Run `amplify init` and configure the environment name and region of the deployment. You will need the Access keys and Secret Access keys of the IAM user in this step.
3. Run `amplify push`.
4. Create a `.env` file and include the following:

  API_END_POINT="SST END POINT"
  
  SECRET_KEY="SECRET"

Replace the secret with any string that you will use to verify a JWT request later with the backend. The API_END_POINT will be obtained later when the SST is set up.

### Set up the back end

1. Change into the backend directory and run `npm install`.
2. Create a `.env` file and include the following:

  AWS_ACCESS_KEY_ID=AccessKey
  
  AWS_SECRET_ACCESS_KEY=SecretAccessKey
  
  DATABASE_URL=""
  
  COGNITO_USER_POOL_ID="USER POOL ID"
  
  COGNITO_USER_POOL_CLIENT_ID="APP CLIENT ID"
  
  DEFAULT_REGION="REGION"
  
  COGNITO_USER_POOL_ARN="ARN"
  
  SECRET_KEY=secret

The DATABASE_URL is the general connection string we saved earlier when making the CockroachDB. The COGNITO_USER_POOL_ID, COGNITO_USER_POOL_ARN, and DEFAULT_REGION should be found in the User pool overview. The COGNITO_USER_POOL_CLIENT_ID can be found in the App Integration of the user pool. There might be multiple values, but use the app_client one for COGNITO_USER_POOL_CLIENT_ID. The SECRET_KEY must be the same string as was put into the front end as it will compare the strings for a match when creating a user.

3. Run `npx sst dev` to get them initially deployed. This may take some time.
4. When `npx sst dev` is complete, it will return a number of items, but one of importance is the `ApiEndpoint`. Replace the `API_END_POINT` value in the front end `.env` file with this generated value.


## Set up the authorization

1. Open API Gateway in the AWS services and navigate to the newly created API.
2. Go to the authorization view and manage authorizers. There should be 3 authorizers, with 2 being the ones that were deployed with SST.
3. Open the Cognito authorizer and click edit.
4. Add the 2 client IDs we got from the Cognito user pool.

### Create a host account

1. Create an account in the app.
2. Use the CockroachDB client that we used to input the database script to run the command `select * from users;` to see all the users.
3. Once you have found your user, run the command `UPDATE users SET membership_status_id = 'Gold', role_id = 'Host' WHERE user_id = 'UUID';`, and replace `UUID` with your user's `user_id` found in the database.
4. Now that you have a host account, you can change the membership statuses of other accounts to allow them access to the app. Remember, if you want to make other host accounts for now, you will have to use the database script to do so.

That's it! You should now be able to run the app with CockroachDB as the database and AWS as the backend.

### Functional Features
Essential Features
1.	Events are divided by type into guest list or “tier” events.
       - Guest list events open eligibility for invited attendees. 
       - Tier events are divided into bronze, silver, and gold tiers. They open eligibility for attendees with a membership status that is greater than or equal to the event’s tier.

Attendees can:
1.	Self-register for the app with a name and email.
      - Upon registration, an attendee cannot use the app until a host account updates their membership status to bronze, silver, or gold.
      - If an attendee’s registration is rejected, they cannot use the app.
2.	View and filter all events upon registration acceptance.
3.	Register for events if they meet the eligibility criteria. 
4.	View (but not register for) events if they do not meet the eligibility criteria.
5.	Withdraw from the event prior to the event start date if they are registered for an event.
6.	Access a QR code to present upon arrival at the event upon registration.

Hosts can:
1.	Create events with a name, date and time, location, and type.
2.	Set a list of attendees for guest list events and set the membership status minimums for tier events.
3.	View reports of attendees for upcoming and past events.

IMPORTANT FEATURES:
1.	Events are displayed in both list format and a calendar format.
2.	Can be set to a third “loyalty” type, so an attendee who has already attended at least X number of prior events is eligible.

Attendees can:
1.	Register for eligible events if the event has capacity.
2.	Join the waitlist if an event does not have capacity.
      - Waitlisted attendees will be automatically registered for an event in the order they were added to the waitlist if spots become available.
3.	Remove themselves from the waitlist prior to the event’s start date. 

Hosts can:
1.	Set a maximum capacity for events.
2.	Set the number of events an attendee must have attended to be eligible for a loyalty event.

NICE-TO-HAVE FEATURES:
1.	An attendee’s event QR code is scannable. 
2.	Upon QR code scan, an attendee’s status could automatically be updated to “Attended”. 
3.	If an attendee’s QR code was not scanned by the end of the event, their status could automatically be updated to “No Show”. 
4.	The app could have a logo and thoughtful styling to improve the user experience (e.g., removing unnecessary labels, adjusting button sizing and placement based on expected usage). 

### Wireframes
Link to Wireframes: https://drive.google.com/file/d/1Om_bSPtu6KGgHMFjRXsULl4HYKBHqFYc/view?usp=sharing

### Use Case Diagram
Link to Use Case Diagram: https://drive.google.com/file/d/1zFK2RYxU4hDRnwFMCjM5usZ0njqkoGO8/view?usp=sharing

### Daily Standups
Link to Daily Standup Log: https://docs.google.com/spreadsheets/d/1Z55A8hLo0H3X5AhpeViiq_23zo8IqnnnN-reYlHl_i0/edit?usp=sharing
