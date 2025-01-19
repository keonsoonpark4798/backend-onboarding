import express from 'express';
import cookieParser from 'cookie-parser';
import signupRouter from './routers/signup.router.js';
import signinRouter from './routers/signin.router.js';
import dotenv from 'dotenv';
import swaggerFile from './utils/swagger/swagger-output.json' assert { type: 'json' };
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [signupRouter, signinRouter]);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

export default app;
