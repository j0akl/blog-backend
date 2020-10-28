import { LoginInput } from "src/resolvers/user";

export const validateLogin = (input: LoginInput) => {
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
