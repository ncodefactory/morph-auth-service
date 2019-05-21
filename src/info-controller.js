import { moduleDescription } from './app-info';

const getInfoHandler = async (ctx) => {
  try {
    ctx.body = {
      status: 'success',
      moduleDescription,
    };
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      message: error.message,
    };
  }
};


export { getInfoHandler }; // eslint-disable-line import/prefer-default-export
