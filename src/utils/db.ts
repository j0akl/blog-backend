import { createConnection } from "mysql";

export const sqlOptions = {
  host: "localhost",
  user: "root",
  password: "goober123",
  database: "blog",
};

export const db = createConnection(sqlOptions);
