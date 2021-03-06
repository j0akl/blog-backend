import express from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import { COOKIE_NAME, PORT, __prod__ } from "./utils/constants";
import { sqlOptions } from "./utils/db";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import { Post } from "./entities/Post";
import { PostResolver } from "./resolvers/post";
const MySQLStore = require("express-mysql-session")(session);
import cors from "cors";

// main function
(async () => {
  const connection = createConnection({
    type: "mysql",
    host: "sql9.freemysqlhosting.net",
    username: "sql9379625",
    password: "Rk7WjKP5Kb",
    database: "sql9379625",
    logging: !__prod__,
    synchronize: true,
    entities: [User, Post],
  });

  const app = express();
  app.get("/", (_, res) => res.send("hello"));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new MySQLStore(sqlOptions),
      secret: "iwafjniowa", // make env variable in prod, hide
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https
      },
    })
  );
  app.use(
    cors({
      credentials: true,
      origin: "https://sad-stonebraker-951b79.netlify.app/",
    })
  );

  const apolloServer = new ApolloServer({
    playground: !__prod__,
    introspection: __prod__,
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => console.log("server running on port: ", PORT));
})().catch((err) => console.log(err));
