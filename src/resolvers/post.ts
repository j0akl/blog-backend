import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { FieldError } from "../utils/fieldError";
import { MyContext } from "../types";
import { validateCreatePost } from "../utils/validateCreatePost";
import { getConnection } from "typeorm";

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
  async post(@Arg("id", () => Int) id: number) {
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .where("p.id = :id", { id })
      .innerJoinAndSelect("p.user", "u", "u.id = p.userId");
    const post = await qb.getOne();
    return post;
  }
  @Query(() => [Post])
  async posts() {
    // right now, this returns all the posts in the database
    // fine for the personal blog, change this later though
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .innerJoinAndSelect("p.user", "u", "u.id = p.userId");
    const posts = qb.getMany();
    return posts;
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
