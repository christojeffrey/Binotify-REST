import { createUserService, getUserByUsernameService, getUserByUsernameEmailService, getAllSingerService, getUserByIdService } from "./user.service";
import { Request, Response } from "express";
import { registerDto, loginDto } from "./user.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { generateToken, verifyToken } from "../common/authorization";
import { errorFormatter } from "../common/errorFormatter";
import { hash } from "../common/hash";

export async function userInfo(req: Request, res: Response) {
  // check auth in header
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }
  // verify token
  let user;
  user = verifyToken(token);
  if (!user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  // if token valid, but username doesn't exist
  const user_info = await getUserByIdService(user.user_id);
  if (!user_info) {
    res.status(400).send(errorFormatter("user not found"));
    return;
  }
  // delte rpassword
  const { password, ...filtered_user_info } = user_info;

  res.status(200).send(filtered_user_info);
}

export async function getAllSinger(_: Request, res: Response) {
  try {
    const singers = await getAllSingerService();
    res.status(200).json({ singers });
  } catch (err) {
    res.status(500).json(errorFormatter(err));
  }
}

export async function register(req: Request, res: Response) {
  const register_body = plainToClass(registerDto, req.body);
  validate(register_body, { skipMissingProperties: false }).then((errors: any) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(errors));
      return;
    }
  });
  try {
    const user_with_same_username_email = await getUserByUsernameEmailService(register_body.username, register_body.email);

    if (user_with_same_username_email) {
      res.status(400).send(errorFormatter("Username or email already exists"));
    } else {
      register_body.password = hash(register_body.password);
      const newUser = await createUserService(register_body);
      const token_payload = {
        user_id: newUser.user_id,
        username: newUser.username,
        is_admin: newUser.is_admin,
      };

      const token = generateToken(token_payload);
      res.status(200).send({ token: token });
    }
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}

export async function login(req: Request, res: Response) {
  const login_body = plainToClass(loginDto, req.body);
  validate(login_body, { skipMissingProperties: false }).then((errors: any) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(errors));
      return;
    }
  });
  try {
    const user = await getUserByUsernameService(login_body.username);
    console.log("user", user);
    if (user && user.password == hash(login_body.password)) {
      const token_payload = {
        user_id: user.user_id,
        username: user.username,
        is_admin: user.is_admin,
      };
      const token = generateToken(token_payload);
      console.log("token", token);
      res.status(200).send({ token: token });
    } else {
      res.status(400).send(errorFormatter("Invalid username or password"));
    }
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}
// create register api and setup jwt
