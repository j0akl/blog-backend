"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.sqlOptions = void 0;
const mysql_1 = require("mysql");
exports.sqlOptions = {
    host: "localhost",
    user: "root",
    password: "goober123",
    database: "blog",
};
exports.db = mysql_1.createConnection(exports.sqlOptions);
//# sourceMappingURL=db.js.map