/* eslint-disable quotes */
const db = require('../helpers/db.helper');

const queue = 'patients_queue';

exports.insert = async (userId, doctorId, avgDur) => {
  const query = `
    INSERT INTO "${queue}" (
      "users_id", 
      "doctor_available_id",
      "waiting_time"
      )
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [userId, doctorId, avgDur];   
  const {rows} = await db.query(query, values);
  return rows[0];
};
//findall
//find by one doctor

//insert patients that register consultation , sekaligus buat rumus berkaitan dengan doctor available

