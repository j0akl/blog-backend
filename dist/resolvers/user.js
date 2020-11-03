"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = exports.LoginInput = exports.RegisterInput = exports.UserResponse = void 0;
const fieldError_1 = require("../utils/fieldError");
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const validateRegister_1 = require("../utils/validateRegister");
const validateLogin_1 = require("../utils/validateLogin");
const constants_1 = require("../utils/constants");
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
exports.UserResponse = UserResponse;
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
exports.RegisterInput = RegisterInput;
let LoginInput = class LoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "usernameOrEmail", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
exports.LoginInput = LoginInput;
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (user.id === req.session.userId) {
            return user.email;
        }
        return "";
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.session.userId;
            if (!id) {
                return null;
            }
            const user = yield User_1.User.findOne(id);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    userById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(id);
            if (!user) {
                return {
                    errors: [
                        {
                            field: "id",
                            message: "user not found",
                        },
                    ],
                };
            }
            return { user };
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => req.session.destroy((err) => {
                res.clearCookie(constants_1.COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                }
                resolve(true);
            }));
        });
    }
    register(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateRegister_1.validateRegister(input);
            if (errors) {
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(input.password);
            const queryArg = {
                username: input.username,
                email: input.email,
                password: hashedPassword,
            };
            let user;
            try {
                user = yield User_1.User.create(queryArg).save();
            }
            catch (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "that user already exists",
                            },
                        ],
                    };
                }
            }
            if (!user) {
                return {
                    errors: [
                        {
                            field: "unknown",
                            message: "an error occurred",
                        },
                    ],
                };
            }
            else {
                req.session.userId = user.id;
                return { user };
            }
        });
    }
    login(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateLogin_1.validateLogin(input);
            if (errors) {
                return { errors };
            }
            const user = yield User_1.User.findOne(input.usernameOrEmail.includes("@")
                ? { where: { email: input.usernameOrEmail } }
                : { where: { username: input.usernameOrEmail } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "user does not exist, try signing up",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, input.password);
            console.log(valid);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password",
                        },
                    ],
                };
            }
            else {
                req.session.userId = user.id;
                return { user };
            }
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => UserResponse, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userById", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map