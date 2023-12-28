/* eslint-disable quotes */
const db = require('../helpers/db.helper');

const doctors = 'doctors';
// const available = 'doctor_available';
// const duration = 'doctor_duration';

exports.findAll = async (page, limit, search, sort, sortBy) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  search = search || "";
  sort = sort || "id";
  sortBy = sortBy || "ASC";

  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      "d"."id",
      "d"."users_id",
      "u"."name" as "name",
      "d"."duration" as "averageDuration",
      "drstat"."name" as "status",
      "d"."createdAt",
      "d"."updatedAt"
    FROM "${doctors}" "d"
    JOIN "users" "u" ON "u"."id" = "d"."users_id"
    JOIN "doctor_status" "drstat" ON "drstat"."id" = "d"."doctor_status_id" 
    WHERE LOWER("u"."name") LIKE LOWER($3)
    GROUP BY "d"."id", "d"."users_id", "u"."name", "d"."duration", "drstat"."name", "d"."createdAt", "d"."updatedAt"
    ORDER BY "d"."${sort}" ${sortBy} 
    LIMIT $1 OFFSET $2

  `;
  const values = [limit, offset, `%${search}%`];
  const {rows} = await db.query(query, values);
  return rows;
};

exports.findAllAvailable = async (page, limit, search, sort, sortBy) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  search = search || "";
  sort = sort || "id";
  sortBy = sortBy || "ASC";

  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      "d"."id",
      "d"."users_id",
      "u"."name" as "name",
      "d"."duration" as "averageDuration",
      "d"."createdAt",
      "d"."updatedAt"
    FROM "${doctors}" "d"
    JOIN "users" "u" ON "d"."users_id" = "u"."id"
    JOIN "doctor_status" "drstat" ON "drstat"."id" = "d"."doctor_status_id" 
    WHERE "drstat"."id"='1' AND LOWER("u"."name") LIKE LOWER($3) 
    GROUP BY "d"."id", "d"."users_id", "u"."name", "d"."duration", "drstat"."name", "d"."createdAt", "d"."updatedAt"
    ORDER BY "d"."${sort}" ${sortBy} 
    LIMIT $1 OFFSET $2

  `;
  const values = [limit, offset, `%${search}%`];
  const {rows} = await db.query(query, values);
  return rows;
};

exports.findAllNoQuery = async (status) => {

  const query = `
    SELECT 
      "d"."id",
      "d"."users_id",
      "u"."name" as "name",
      "d"."duration" as "averageDuration",
      "d"."createdAt",
      "d"."updatedAt"
    FROM "${doctors}" "d"
    JOIN "users" "u" ON "d"."users_id" = "u"."id"
    JOIN "doctor_status" "drstat" ON "drstat"."id" = "d"."doctor_status_id" 
    WHERE "drstat"."id"=$1 
    GROUP BY "d"."id", "d"."users_id", "u"."name", "d"."duration", "drstat"."name", "d"."createdAt", "d"."updatedAt"
  `;
  const values = [status];
  const {rows} = await db.query(query, values);
  return rows;
};

exports.findOneByUserId = async (id) => {
  const query = `
    SELECT 
      "d"."id",
      "d"."users_id",
      "u"."name" as "name",
      "d"."duration" as "averageDuration",
      "drstat"."name" as "status",
      "d"."createdAt",
      "d"."updatedAt"
    FROM "${doctors}" "d"
    JOIN "users" "u" ON "u"."id" = "d"."users_id"
    JOIN "doctor_status" "drstat" ON "drstat"."id" = "d"."doctor_status_id" 
    WHERE "d"."users_id"= $1
    GROUP BY "d"."id", "d"."users_id", "u"."name", "d"."duration", "drstat"."name", "d"."createdAt", "d"."updatedAt"

  `;
  const values = [id];
  const {rows} = await db.query(query, values);
  return rows[0];
};


exports.insertDefault = async (data) => {
  const query = `
    INSERT INTO "${doctors}" (
      "users_id", 
      "duration", 
      "doctor_status_id"
      )
    VALUES ($1, INTERVAL '0 minutes', $2)
    RETURNING *
  `;
  const values = [data.users_id, data.doctor_status_id];   
  const {rows} = await db.query(query, values);
  return rows[0];
};

// exports.insertIdToDuration = async (id) => {
//   const query = `
//   INSERT INTO "${doctors}" (
//     "users_id",
//     "duration"
//     )
//   VALUES ($1, INTERVAL('0 minutes'))
//   RETURNING *
//   `;

//   const values = [id];   
//   const {rows} = await db.query(query, values);
//   return rows[0];
// };

// exports.updateDuration = async (id, durationValue) => {
//   const query = `
//     UPDATE "${duration}" (
//       SET
//         "users_id"=COALESCE(NULLIF($1::INTEGER, NULL), "users_id", 
//         "duration"=COALESCE(NULLIF(INTERVAL '$2 minutes'::INTERVAL, NULL), "duration", 
//         "updatedAt" = TIMESTAMP NOW()
//       )
//     VALUES ($1, $2,)
//     RETURNING *
//   `;
//   const values = [id, durationValue];   
//   const {rows} = await db.query(query, values);
//   return rows[0];
// };

// exports.updateStatus = async (id, durationValue) => {
//   const query = `
//     UPDATE "${doctors}" (
//       SET
//         "users_id"=COALESCE(NULLIF($1::INTEGER, NULL), "users_id", 
//         "doctor_status_id"=COALESCE(NULLIF($2::INTEGER, NULL), "doctor_status_id", 
//         "updatedAt" = TIMESTAMP(NOW())
//       )
//     VALUES ($1, $2,)
//     RETURNING *
//   `;
//   const values = [id, durationValue];   
//   const {rows} = await db.query(query, values);
//   return rows[0];
// };
exports.update = async (id, duration, status) => {
  const query = `
  UPDATE "doctors"
  SET
  "duration"=COALESCE(NULLIF($2::INTERVAL, NULL), "duration"), 
  "doctor_status_id"=COALESCE(NULLIF($3::INTEGER, NULL), "doctor_status_id"), 
  "updatedAt"=NOW() AT TIME ZONE 'Asia/Jakarta'
  WHERE "users_id"= $1
  RETURNING *
  `;
  const values = [id, duration, status];   
  const {rows} = await db.query(query, values);
  return rows[0];
};

