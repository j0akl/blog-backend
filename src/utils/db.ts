import { createConnection } from "mysql";

export const sqlOptions = {
  host: "sql9.freemysqlhosting.net",
  user: "sql9379625",
  password: "Rk7WjKP5Kb",
  database: "sql9379625",
};

export const db = createConnection(sqlOptions);
