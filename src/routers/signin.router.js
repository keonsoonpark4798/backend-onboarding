import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

/** 사용자 로그인 API **/
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

    // 4. Return the token
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
