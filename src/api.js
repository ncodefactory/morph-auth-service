import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import cors from '@koa/cors';
import koaSwagger from 'koa2-swagger-ui';
import logger from 'koa-logger';
import router from './router';

const app = new Koa();
const PORT = process.env.PORT || 3001;

app.use(logger());
app.use(cors());
app.use(compress());
app.use(bodyParser());
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
