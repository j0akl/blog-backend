import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { FieldError } from "../utils/fieldError";
import { MyContext } from "../types";
import { validateCreatePost } from "../utils/validateCreatePost";

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@InputType()
export class CreatePostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@Resolver()
export class PostResolver {
  @Query(() => Post)
  async post(@Arg("id") id: number) {
    return await Post.findOne(id);
  }
  @Mutation(() => PostResponse)
  async createPost(
    @Arg("input") input: CreatePostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    const errors = validateCreatePost(input);
    if (errors) {
      return { errors };
    }
    const post = await Post.create({
      ...input,
      userId: req.session.userId,
    }).save();
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
  }
}
