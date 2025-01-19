import express from 'express';
import cookieParser from 'cookie-parser';
import signupRouter from './routers/signup.router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', signupRouter);
app.listen(PORT, () => {
  //console.log(PORT, '포트로 서버가 열렸어요!');
});

export default app;
