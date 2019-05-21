import dotenv from 'dotenv';
import Router from 'koa-router';
import serve from 'koa2-static-middleware';
import path from 'path';
import { moduleName, moduleVersion } from './app-info';
import { getInfoHandler } from './info-controller';

dotenv.config();

const router = new Router();
const apiVersion = 'v1';
const baseUrl = `/api/${apiVersion}`;

const urlForInfo = `${baseUrl}/info`;

router.get(urlForInfo, getInfoHandler);

router.get(
  '/swagger.json',
  serve(path.join(__dirname, 'static/swagger'), {
    index: `swagger.${apiVersion}.json`,
  }),
);

router.get('/', async (ctx) => {
  ctx.body = {
    moduleName,
    moduleVersion,
    latestApiVersion: apiVersion,
    urlForInfo,
    urlForSwaggerDocs: '/docs',
  };
});

export { urlForInfo, apiVersion };
export default router;
