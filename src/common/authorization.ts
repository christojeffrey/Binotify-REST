import { getUserByIdService } from "../user/user.service";

const jwt = require("jsonwebtoken");

export type token_payload = {
  user_id: number;
  username: string;
  is_admin: boolean;
};

export function generateToken(payload: token_payload) {
  let jwt_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, jwt_secret_key);
  return token;
}

export function verifyToken(token: string) {
  // will return the payload if token is valid. will return null if token is invalid. remember that this just verify the validity of the token.
  let jwt_secret_key = process.env.JWT_SECRET_KEY;
  let verified_user: token_payload;
  try {
    verified_user = jwt.verify(token, jwt_secret_key);
  } catch (err) {
    return null;
  }
  return verified_user;
}
