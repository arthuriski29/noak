const db = require('../helpers/db.helper');

const table = 'users';

exports.findAll = async function(page, limit, search, role, sort, sortBy) {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  search = search || '';
  sort = sort || 'id';
  sortBy = sortBy || 'ASC';

  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM "${table}"
    WHERE "name" LIKE $3 AND "role_id" = $4
      ORDER BY "${sort}" ${sortBy} 
      LIMIT $1  OFFSET $2

  `;
  const values = [limit, offset, `%${search}%`, role];
  const {rows} = await db.query(query, values);
  return rows;
};

exports.findOneByEmail = async function(email) {
  const query = `
    SELECT
      "u"."id",
      "u"."name",
      "u"."email",
      "u"."password",
      "r"."id" as "role_id",
      "u"."createdAt",
      "u"."updatedAt"
    FROM "${table}" "u"
    JOIN "role" "r" ON "r"."id" = "u"."role_id"
    WHERE "u"."email"=$1
  `;
  const values = [email];
  const {rows} = await db.query(query, values);
  return rows[0];
};

exports.findOneById = async function(id) {
  const query = `
    SELECT
      "u"."id",
      "u"."name",
      "u"."email",
      "u"."password",
      "r"."id" as "role_id",
      "u"."createdAt",
      "u"."updatedAt"
    FROM "${table}" "u"
    JOIN "role" "r" ON "r"."id" = "u"."role_id"
    WHERE "u"."id"=$1
  `;
  const values = [id];
  const {rows} = await db.query(query, values);
  return rows[0];
};
exports.findOneByIdProfile = async function(id) {
  const query = `
    SELECT
      "u"."id",
      "u"."name",
      "u"."email",
      "r"."name" as "accountType",
      "u"."createdAt",
      "u"."updatedAt"
    FROM "${table}" "u"
    JOIN "role" "r" ON "r"."id" = "u"."role_id"
    WHERE "u"."id"=$1
  `;
  const values = [id];
  const {rows} = await db.query(query, values);
  return rows[0];
};

exports.findByIdAndRole = async (id, role_id) => {
  const query = `
    SELECT *
    FROM "${table}"
    WHERE "id" = $1 AND "role_id" = $2
  `;

  const values = [id, role_id];
  const {rows} = await db.query(query, values);
  return rows;
};

// exports.insert = async function(data) {
//   const query = `
//     INSERT INTO "${table}" ("name", "email", "password", "role_id")
//     VALUES ($1, $2, $3, '3')
//     RETURNING *
//   `;
//   const values = [data.name, data.email, data.password];
//   const {rows} = await db.query(query, values);
//   return rows[0];
// };


//>>ADMIN
exports.insert = async function(data) {
  const query = `
    INSERT INTO "${table}" ("name", "email", "password", "role_id")
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [data.name, data.email, data.password, data.role_id];
  const {rows} = await db.query(query, values);
  return rows[0];
};