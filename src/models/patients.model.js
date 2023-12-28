/* eslint-disable quotes */
const db = require('../helpers/db.helper');

const patients = 'patients';

exports.findAll = async (page, limit, search, sort, sortBy) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  search = search || "";
  sort = sort || "id";
  sortBy = sortBy || "ASC";

  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      "p"."id",
      "p"."users_id",
      "u"."name" as "name",
      "ptstat"."name" as "status",
      "p"."createdAt",
      "p"."updatedAt"
    FROM "${patients}" "p"
    JOIN "users" "u" ON "u"."id" = "p"."users_id"
    JOIN "patient_status" "ptstat" ON "ptstat"."id" = "p"."patient_status_id" 
    WHERE LOWER("u"."name") LIKE LOWER($3)
    GROUP BY "p"."id", "p"."users_id", "u"."name", "ptstat"."name", "p"."createdAt", "p"."updatedAt"
    ORDER BY "p"."${sort}" ${sortBy} 
    LIMIT $1 OFFSET $2

  `;
  const values = [limit, offset, `%${search}%`];
  const {rows} = await db.query(query, values);
  return rows;
};

exports.insert = async (data) => {
  const query = `
    INSERT INTO "${patients}" (
      "users_id", 
      "patient_status_id"
      )
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [data.users_id, data.patient_status_id];   
  const {rows} = await db.query(query, values);
  return rows[0];
};

exports.update = async (users_id, status) => {
  const query = `
  UPDATE "${patients}"
  SET
    "patient_status_id"=COALESCE(NULLIF($2::INTEGER, NULL), "patient_status_id"), 
    "updatedAt"=CURRENT_TIMESTAMP
  WHERE "users_id"= $1
  RETURNING *
  `;
  const values = [users_id, status];   
  const {rows} = await db.query(query, values);
  return rows[0];
};