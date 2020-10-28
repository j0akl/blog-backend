import { FieldError } from "../utils/fieldError";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../entities/User";
import { validateRegister } from "../utils/validateRegister";
import { MyContext } from "../types";
import { validateLogin } from "../utils/validateLogin";
import { COOKIE_NAME } from "../utils/constants";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
export class RegisterInput {
  @Field()
  username!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  password!: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // user viewing own account, permit viewing email
    if (user.id === req.session.userId) {
      return user.email;
    }
    // user is trying to access someone elses email
    return "";
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    const id = req.session.userId;
    if (!id) {
      return null;
    }
    const user = await User.findOne(id);
    if (!user) {
      return null;
    }
    return user;
  }
  @Query(() => UserResponse, { nullable: true })
  async userById(@Arg("id") id: number): Promise<UserResponse> {
    const user = await User.findOne(id);
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
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      })
    );
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(input);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(input.password);
    const queryArg = {
      username: input.username,
      email: input.email,
      password: hashedPassword,
    };
    let user;
    try {
      user = await User.create(queryArg).save();
    } catch (err) {
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
    } else {
      req.session.userId = user.id;
      return { user };
    }
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateLogin(input);
    if (errors) {
      return { errors };
    }
    const user = await User.findOne(
      input.usernameOrEmail.includes("@")
        ? { where: { email: input.usernameOrEmail } }
        : { where: { username: input.usernameOrEmail } }
    );
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
    const valid = await argon2.verify(user.password, input.password);
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
    } else {
      req.session.userId = user.id;
      return { user };
    }
  }
}
