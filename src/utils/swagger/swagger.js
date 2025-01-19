import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'backend-onboarding-NodeJS',
    description: ' nodeJs 백엔드 온보딩 과제 ',
  },
  servers: [
    {
      url: 'http://parkawstest.shop:3000',
      description: '',
    },
    // { ... }
  ],
  tags: [
    {
      name: '', // Tag name
      description: '', // Tag description
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['src/routers/signin.router.js', 'src/routers/signup.router.js'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, routes, doc);
