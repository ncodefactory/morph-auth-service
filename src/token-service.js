import { uuid4 } from 'fast-uuid';
import jwt from 'jsonwebtoken';

const SECRET = process.env.TOKEN_SECRET || 'secret_for_jwt';
const jwtSign = payload => jwt.sign(
  {
    data: payload,
    session: uuid4(),
    // exp in seconds
    exp: Math.floor(Date.now() / 1000) - 60 * 60, // 60 seconds * 60 minutes = 1 hour
  },
  SECRET,
);

export default jwtSign;
