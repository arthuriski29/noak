/* eslint-disable quotes */
const db = require('../helpers/db.helper');

const consult = 'consultation_activity';

exports.findAllConsult = async () => {
 
  const query = `
  SELECT 
    ROW_NUMBER() OVER () AS "id",
    "u"."name" as "doctor",
    "d"."duration",
    ARRAY_AGG("con"."patients_id") as "patients",
    COUNT ("patients_id") as "num_patient",
    (ROUND (EXTRACT(EPOCH FROM "d"."duration") / 60)) * (COUNT ("patients_id")) as "waiting_time"
  FROM
    "${consult}" "con" 
    JOIN "doctors" "d" ON "d"."users_id" = "con"."doctor_id"
    JOIN "users" "u" ON "u"."id" = "con"."doctor_id"
  GROUP BY
    "con"."doctor_id", "u"."name", "d"."duration"
  `;
  // const values = [];
  const {rows} = await db.query(query);
  return rows[0];
};

exports.insert = async (data) => {
  const query = `
    INSERT INTO "${consult}" (
      "doctor_id",
      "patients_id",
      "registration_time"
      )
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const values = [data.doctor_id, data.patients_id];   
  const {rows} = await db.query(query, values);
  return rows[0];
};