import request from 'supertest';
import express from 'express';
import { prisma } from '../prisma/index.js';
import bcrypt from 'bcrypt';
import router from '../../routers/signup.router.js';

// Mock the necessary methods
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('../prisma/index.js', () => ({
  prisma: {
    users: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Initialize Express app
const app = express();
app.use(express.json());
app.use(router);

describe('POST /api/sign-up', () => {
  it('유저 회원가입', async () => {
    // Arrange: Mock database to simulate no user found
    prisma.users.findFirst.mockResolvedValue(null); // No user exists
    bcrypt.hash.mockResolvedValue('hashedPassword'); // Simulate password hashing

    prisma.users.create.mockResolvedValue({
      username: 'JIN HO',
      nickname: 'Mentos',
      authorityName: 'ROLE_USER',
    }); // Simulate user creation

    const response = await request(app).post('/sign-up').send({
      username: 'JIN HO',
      password: '12341234',
      nickname: 'Mentos',
    });

    // Assert: The response status and data
    expect(response.status).toBe(201);
    expect(response.body.username).toBe('JIN HO');
    expect(response.body.nickname).toBe('Mentos');
    expect(response.body.authorities).toEqual([{ authorityName: 'ROLE_USER' }]);
  });

  it('존재하는 유저일떄 409에러 체크크', async () => {
    const existingUser = {
      username: 'JIN HO',
      password: '12341234',
      nickname: 'Mentos',
    };
    prisma.users.findFirst.mockResolvedValue(existingUser);

    const response = await request(app).post('/sign-up').send({
      username: 'JIN HO',
      password: '12341234',
      nickname: 'Mentos',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('이미 존재하는 유저입니다.');
  });

  it('이름 없을때 400에러 체크', async () => {
    const response = await request(app).post('/sign-up').send({
      username: '',
      password: '12341234',
      nickname: 'Mentos',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('유저 이름은 필수 항목입니다.');
  });
});
