import { RegisterInput } from "src/resolvers/user";

export const validateRegister = (input: RegisterInput) => {
  if (!input.email.includes("@")) {
    return [
      {
        field: "email",
        message: "please enter a valid email",
      },
    ];
  }
  if (input.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include @",
      },
    ];
  }
  if (input.username.length < 3) {
    return [
      {
        field: "username",
        message: "username must be longer than 2 characters",
      },
    ];
  }
  if (input.password.length < 6) {
    return [
      {
        field: "password",
        message: "password must be longer than 5 characters",
      },
    ];
  }
  return null;
};
