"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.__prod__ = exports.COOKIE_NAME = void 0;
exports.COOKIE_NAME = "qid";
exports.__prod__ = process.env.NODE_ENV === "production";
exports.PORT = process.env.PORT || 8000;
//# sourceMappingURL=constants.js.map