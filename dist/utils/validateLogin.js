"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
exports.validateLogin = (input) => {
    if (!input.usernameOrEmail) {
        return [
            {
                field: "usernameOrEmail",
                message: "please enter a username or email",
            },
        ];
    }
    if (!input.password) {
        return [
            {
                field: "password",
                message: "please enter a password",
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateLogin.js.map