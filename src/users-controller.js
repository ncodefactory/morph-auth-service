import bcrypt from 'bcrypt';
import jwtSign from './token-service';

const { TOKEN_BODY_NAME } = process.env;
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'NOT-XSRF-TOKEN';
const usersArray = [];

const getUserByUsername = (username, users) => {
  let user;
  for (let i = 0; i < users.length; i += 1) {
    user = users[i];
    if (user.username === username) {
      return user;
    }
  }
  return null;
};

const userRegisterHandler = async (ctx, next) => {
  if (
    !ctx.request.body.username
    || !ctx.request.body.password
    || !ctx.request.body.email
    || !ctx.request.body.name
  ) {
    ctx.status = 400;
    ctx.body = {
      error: `expected an object with username, password, email, name but got: ${ctx.request.body}`,
    };
    return;
  }

  ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 5);
  const user = getUserByUsername(ctx.request.body.username, usersArray);
  if (!user) {
    usersArray.push(ctx.request.body);
    ctx.status = 200;
    next();
  } else {
    ctx.status = 406;
    ctx.body = {
      error: 'User exists',
    };
  }
};

const userLoginHandler = async (ctx, next) => {
  const user = await getUserByUsername(ctx.request.body.username, usersArray);
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      error: 'bad username',
    };
    return;
  }
  const { password, ...userInfoWithoutPassword } = user;
  if (await bcrypt.compare(ctx.request.body.password, password)) {
    if (TOKEN_BODY_NAME == null) {
      ctx.cookies.set(TOKEN_COOKIE_NAME, jwtSign(userInfoWithoutPassword), { httpOnly: true });
      ctx.status = 200;
    } else {
      const body = {};
      body[TOKEN_BODY_NAME] = jwtSign(userInfoWithoutPassword);
      ctx.body = body;
    }
    next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 'bad password',
    };
  }
};

export { userRegisterHandler, userLoginHandler };
