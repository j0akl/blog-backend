import { Request, Response } from "express";

export type MyContext = {
  req: Request & { session: Express.Session }; // & joins two types
  res: Response;
};
