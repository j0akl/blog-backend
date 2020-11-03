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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = exports.CreatePostInput = exports.PostResponse = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const fieldError_1 = require("../utils/fieldError");
const validateCreatePost_1 = require("../utils/validateCreatePost");
const typeorm_1 = require("typeorm");
let PostResponse = class PostResponse {
};
__decorate([
    type_graphql_1.Field(() => [fieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], PostResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    type_graphql_1.ObjectType()
], PostResponse);
exports.PostResponse = PostResponse;
let CreatePostInput = class CreatePostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreatePostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreatePostInput.prototype, "text", void 0);
CreatePostInput = __decorate([
    type_graphql_1.InputType()
], CreatePostInput);
exports.CreatePostInput = CreatePostInput;
let PostResolver = class PostResolver {
    post(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = typeorm_1.getConnection()
                .getRepository(Post_1.Post)
                .createQueryBuilder("p")
                .where("p.id = :id", { id })
                .innerJoinAndSelect("p.user", "u", "u.id = p.userId");
            const post = yield qb.getOne();
            return post;
        });
    }
    posts() {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = typeorm_1.getConnection()
                .getRepository(Post_1.Post)
                .createQueryBuilder("p")
                .innerJoinAndSelect("p.user", "u", "u.id = p.userId")
                .orderBy("p.createdAt", "DESC");
            const posts = yield qb.getMany();
            return posts;
        });
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateCreatePost_1.validateCreatePost(input);
            if (errors) {
                return { errors };
            }
            const post = yield Post_1.Post.create(Object.assign(Object.assign({}, input), { userId: req.session.userId })).save();
            if (!post) {
                return {
                    errors: [
                        {
                            field: "unknown",
                            message: "an error occurred",
                        },
                    ],
                };
            }
            return { post };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => Post_1.Post),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Query(() => [Post_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Mutation(() => PostResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map