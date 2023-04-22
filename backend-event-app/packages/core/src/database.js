import pg from 'pg'
const { Pool } = pg

let pool
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}

// Get all membership statuses
export async function getMembershipStatuses() {
  const res = await getPool().query(`
  SELECT * FROM membershipstatuses
  ORDER BY membership_status_id
  `)
  return res.rows
}

// Get all eligibility types
export async function getEligibilityTypes() {
  const res = await getPool().query(`
  SELECT * FROM eligibilitytypes
  ORDER BY type_id
  `)
  return res.rows
}

// Get all attendee statuses
export async function getAttendeeStatuses() {
  const res = await getPool().query(`
  SELECT * FROM attendeestatuses
  ORDER BY attendee_status_id
  `)
  return res.rows
}

// Get all attendance statuses
export async function getAttendanceStatuses() {
  const res = await getPool().query(`
  SELECT * FROM attendancestatuses
  ORDER BY attendance_status_id
  `)
  return res.rows
}

// Create a new user
export async function createUser(email, firstName, lastName, roleId, membershipStatusId) {
  const res = await getPool().query(`
  INSERT INTO users (email, first_name, last_name, role_id, membership_status_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING user_id`, [email, firstName, lastName, roleId, membershipStatusId])
  return res.rows[0]
}

// Update an existing user
export async function editUser(userId, firstName, lastName, membershipStatusId) {
  const res = await getPool().query(`
  UPDATE users SET (first_name, last_name, membership_status_id) =
                                   ($2, $3, $4)
  WHERE user_id = $1
  RETURNING *
  `, [userId, firstName, lastName, membershipStatusId])
  return res.rows[0]
}

// Get user by userid
export async function getUser(userId) {
  const res = await getPool().query(`
  SELECT * FROM users
  WHERE user_id = $1
  `, [userId])
  return res.rows[0]
}

// Get user by email
export async function getUserByEmail(email) {
  const res = await getPool().query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
  return res.rows[0]
}

// Get all users
export async function getUsers() {
  const res = await getPool().query(`
  SELECT * FROM users
  ORDER BY last_name`)
  return res.rows
}

// Create a new event
export async function createEvent(eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, typeId, loyaltyMax) {
  const res = await getPool().query(`
  INSERT INTO events (event_name, event_date, event_start, event_end, event_location, capacity, type_id, loyalty_max, cancelled, reason )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING event_id`, [eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, typeId, loyaltyMax, false, ""])
  return res.rows[0]
}

// Update an existing event
export async function editEvent(eventId, eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, eligibilityType, loyaltyMax, cancelled, reasonCancelled) {
  const res = await getPool().query(`
  UPDATE events SET (event_name, event_date, event_start, event_end, event_location, capacity, type_id, loyalty_max, cancelled, reason) =
                                   ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  WHERE event_id = $1
  RETURNING *
  `, [eventId, eventName, eventDate, eventStart, eventEnd, eventLocation, capacity, eligibilityType, loyaltyMax, cancelled, reasonCancelled])
  return res.rows[0]
}

// Get event by eventid
export async function getEvent(eventId) {
  const res = await getPool().query(`
  SELECT * FROM events
  WHERE event_id = $1
  `, [eventId])
  return res.rows[0]
}

// Get all events
export async function getEvents() {
  const res = await getPool().query(`
  SELECT * FROM events
  ORDER BY event_date`)
  return res.rows
}

// Create an attendee record for a particular event and user
export async function createAttendee(eventId, userId, attendeeStatusId) {
  const res = await getPool().query(`
  INSERT INTO eventattendees (event_id, user_id, attendee_status_id, attendance_status_id)
  VALUES ($1, $2, $3, $4)
  RETURNING event_id, user_id`, [eventId, userId, attendeeStatusId, 'Unknown'])
  return res.rows[0]
}

// Get attendee records for all events for a specific user 
export async function getAttendeesByUser(userId) {
  const res = await getPool().query(`
  SELECT ea.*, e.* FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1
  ORDER BY e.event_date
  `, [userId])
  return res.rows
}

// Get attendee records for a specific event
export async function getAttendeesByEvent(eventId) {
  const res = await getPool().query(`
  SELECT ea.*, e.*, u.* FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  JOIN users u ON ea.user_id = u.user_id
  WHERE ea.event_id = $1
  ORDER BY u.last_name
  `, [eventId])
  return res.rows
}

// Get attendee record for a specific event and user
export async function getAttendee(userId, eventId) {
  const res = await getPool().query(`
  SELECT * FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1 AND ea.event_id = $2
  ORDER BY e.event_date
  `, [userId, eventId])
  return res.rows
}

// Update attendee status for a specific event and user
export async function editAttendeeStatus(eventId, userId, attendeeStatusId) {
  const res = await getPool().query(`
  UPDATE eventattendees SET (attendee_status_id) = ($3)
  WHERE event_id = $1 AND user_id = $2
  RETURNING *
  `, [eventId, userId, attendeeStatusId])
  return res.rows[0]
}

// Update attendance status for a specific event and user
export async function editAttendanceStatus(eventId, userId, attendanceStatusId) {
  const res = await getPool().query(`
  UPDATE eventattendees SET (attendance_status_id) = ($3)
  WHERE event_id = $1 AND user_id = $2
  RETURNING *
  `, [eventId, userId, attendanceStatusId])
  return res.rows[0]
}

// Create a waitlist record for a specific event and user
export async function createWaitlist(eventId, userId) {
  const res = await getPool().query(`
  INSERT INTO eventwaitlist (event_id, user_id)
  VALUES ($1, $2)
  RETURNING event_id, user_id`, [eventId, userId])
  return res.rows[0]
}

// Delete a waitlist record for a specific event and user
export async function deleteWaitlist(eventId, userId) {
  const res = await getPool().query(`
  DELETE FROM eventwaitlist
  WHERE event_id = $1
  AND user_id = $2
  RETURNING *
  `, [eventId, userId])
  return res.rows[0]
}

// Get all users waitlisted for a specific event
export async function getEventWaitlist(eventId) {
  const res = await getPool().query(`
  SELECT ew.*, e.*, u.* FROM eventwaitlist ew
  JOIN events e ON ew.event_id = e.event_id
  JOIN users u ON ew.user_id = u.user_id
  WHERE ew.event_id = $1
  ORDER BY e.event_date, u.last_name
  `, [eventId])
  return res.rows
}

// Get all events for which a specific user is waitlisted
export async function getUserWaitlist(userId) {
  const res = await getPool().query(`
  SELECT ew.*, e.*, u.* FROM eventwaitlist ew
  JOIN events e ON ew.event_id = e.event_id
  JOIN users u ON ew.user_id = u.user_id
  WHERE ew.user_id = $1
  ORDER BY e.event_date
  `, [userId])
  return res.rows
}

// Get position in waitlist of a specific user for a specific event
export async function getWaitlistPosition(eventId, userId) {
  const res = await getPool().query(`
  SELECT COUNT(*) + 1 AS waitlist_position
  FROM eventwaitlist
  WHERE event_id = $1
  AND waitlist_date < (SELECT waitlist_date FROM eventwaitlist WHERE event_id = $1 AND user_id = $2)
  `, [eventId, userId])
  return res.rows[0].waitlist_position
}

// Check if any capacity remains for a specific event, returns true or false
export async function anyCapacity(eventId) {
  const res = await getPool().query(`
  SELECT e.capacity > (
     SELECT COUNT(*) FROM eventattendees WHERE event_id = $1
   ) AS any_capacity_available
   FROM events e
   WHERE e.event_id = $1
 `, [eventId])
 return res.rows[0].any_capacity_available
}

// Check how many events a specific user has attended prior to today
export async function loyaltyCount(userId) {
  const res = await getPool().query(`
  SELECT COUNT(*) FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1 AND ea.attendance_status_id = 'Attended' AND e.event_date < now()
  `, [userId])
  return res.rows[0].count
}

// Count how many events a specific user has of each status
export async function eventCounts(userId) {
  const res = await getPool().query(`
  SELECT ea.attendee_status_id, COUNT(*) as count FROM eventattendees ea
  JOIN events e ON ea.event_id = e.event_id
  WHERE ea.user_id = $1 AND e.event_date > now()
  GROUP BY ea.attendee_status_id
  `, [userId])
  return res.rows
}

