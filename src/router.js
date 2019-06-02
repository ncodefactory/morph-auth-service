import dotenv from 'dotenv';
import Router from 'koa-router';
import serve from 'koa2-static-middleware';
import path from 'path';
import { moduleName, moduleVersion } from './app-info';
import { getInfoHandler } from './info-controller';
import { userLoginHandler, userRegisterHandler } from './users-controller';

dotenv.config();

const router = new Router();
const apiVersion = 'v1';
const baseUrl = `/api/${apiVersion}`;

const urlForInfo = `${baseUrl}/info`;
const urlForSwaggerDocs = '/docs';

const urlForUserRegister = `${baseUrl}/user/register`;
const urlForUserLogin = `${baseUrl}/user/login`;

router.post(urlForUserLogin, userLoginHandler);
router.post(urlForUserRegister, userRegisterHandler);

router.get(urlForInfo, getInfoHandler);

router.get(
  '/swagger.json',
  serve(path.join(__dirname, 'static/swagger'), {
    index: `swagger.${apiVersion}.json`,
  }),
);

router.get(baseUrl, async (ctx) => {
  ctx.body = `Hello ${ctx.state.user.data.name}`;
});

router.get('/', async (ctx) => {
  ctx.body = {
    moduleName,
    moduleVersion,
    latestApiVersion: apiVersion,
    urlForInfo,
    urlForSwaggerDocs,
  };
});

export { urlForInfo, urlForSwaggerDocs, apiVersion };
export default router;
