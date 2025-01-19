import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/index.js';
import router from '../../routers/signin.router.js';

jest.mock('../prisma/index.js', () => ({
  prisma: {
    users: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('POST /login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('로그인 성공 체크', async () => {
    const mockUser = {
      username: 'testUser',
      password: 'hashedPassword',
    };
    prisma.users.findFirst.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockedToken');

    // Act
    const response = await request(app).post('/login').send({
      username: 'testUser',
      password: 'validPassword',
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.token).toBe('mockedToken');
    expect(prisma.users.findFirst).toHaveBeenCalledWith({ where: { username: 'testUser' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('validPassword', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith({ username: 'testUser' }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  });

  it('유저가 없을때 404 에러', async () => {
    prisma.users.findFirst.mockResolvedValue(null);

    const response = await request(app).post('/login').send({
      username: 'notExistUser',
      password: 'test123',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('유저를 찾을 수 없습니다.');
    expect(prisma.users.findFirst).toHaveBeenCalledWith({ where: { username: 'notExistUser' } });
  });

  it('비밀번호가 유효하지 않을때', async () => {
    const mockUser = {
      username: 'testUser',
      password: 'hashedPassword',
    };
    prisma.users.findFirst.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post('/login').send({
      username: 'testUser',
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('비밀번호가 올바르지 않습니다.');
    expect(prisma.users.findFirst).toHaveBeenCalledWith({ where: { username: 'testUser' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });
});
