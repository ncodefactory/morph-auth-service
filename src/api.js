import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import cors from '@koa/cors';
import koaSwagger from 'koa2-swagger-ui';
import jwt from 'koa-jwt';
import logger from 'koa-logger';
import router, { apiVersion, urlForInfo, urlForSwaggerDocs } from './router';

const app = new Koa();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || 'secret_fot_jwt';

app.use(logger());
app.use(cors());
app.use(compress());
app.use(bodyParser());

// Custom 401 handling (koa errors not exposed to users)
app.use(async (ctx, next) => next().catch((err) => {
  if (err.status === 401) {
    ctx.status = 401;
    const errMessage = err.originalError ? err.originalError.message : err.message;
    ctx.body = {
      error: errMessage,
    };
    ctx.set('X-Status-Reason', errMessage);
  } else {
    throw err;
  }
}));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(
  jwt({
    secret: SECRET,
  }).unless({
    path: [
      `/api/${apiVersion}/user/login`,
      `/api/${apiVersion}/user/register`,
      '/swagger.json',
      urlForInfo,
      urlForSwaggerDocs,
      '/',
    ],
  }),
);
app.use(router.routes());
app.use(
  koaSwagger({
    swaggerOptions: {
      url: `http://localhost:${PORT}/swagger.json`,
    },
  }),
);
app.use(router.allowedMethods());

const api = app.listen(PORT, () => {
  console.log(`api listening on port: ${PORT}`); // eslint-disable-line no-console
});

export default api;
