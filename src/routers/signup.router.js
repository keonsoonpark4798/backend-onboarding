import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import { signUpValidator } from '../middlewares/validators/user.validator.middleware.js';

const router = express.Router();

/** 사용자 회원가입 API **/
router.post('/signup', signUpValidator, async (req, res, next) => {
  try {
    const { username, password, nickname } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 유저입니다.' });
    }

    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        nickname,
        authorityName: 'ROLE_USER',
      },
    });

    return res.status(201).json({
      username: user.username,
      nickname: user.nickname,
      authorities: [{ authorityName: 'ROLE_USER' }],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
