"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const express_session_1 = __importDefault(require("express-session"));
const constants_1 = require("./utils/constants");
const db_1 = require("./utils/db");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./entities/User");
const user_1 = require("./resolvers/user");
const Post_1 = require("./entities/Post");
const post_1 = require("./resolvers/post");
const MySQLStore = require("express-mysql-session")(express_session_1.default);
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.createConnection({
        type: "mysql",
        host: "localhost",
        username: "root",
        password: "goober123",
        database: "blog",
        logging: true,
        synchronize: true,
        entities: [User_1.User, Post_1.Post],
    });
    const app = express_1.default();
    app.get("/", (_, res) => res.send("hello"));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new MySQLStore(db_1.sqlOptions),
        secret: "iwafjniowa",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
    }));
    app.use(cors_1.default({ credentials: true, origin: "http://localhost:5000" }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        playground: true,
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver, post_1.PostResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(constants_1.PORT, () => console.log("server running on port: ", constants_1.PORT));
}))().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map