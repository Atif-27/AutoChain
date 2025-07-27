import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
interface TokenPayLoad {
  id: string;
  name?: string;
  email?: string;
}

const generateAccessToken = (user: TokenPayLoad) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.name,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY  as StringValue
  });
};

const generateRefreshToken = (user: TokenPayLoad) => {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as StringValue
  });
};

export { generateAccessToken, generateRefreshToken };