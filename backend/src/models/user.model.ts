import sql from "../config/database";

export const findAll = async () => {
  return await sql`SELECT * FROM users`;
};

export const findById = async (id: number) => {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result[0];
};

export const create = async (data: any) => {
  const { name, email } = data;
  const result = await sql`
    INSERT INTO users (name, email)
    VALUES (${name}, ${email})
    RETURNING *`;
  return result[0];
};
