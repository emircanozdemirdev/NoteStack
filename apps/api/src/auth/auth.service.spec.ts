import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };
  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      users as unknown as UsersService,
      jwt as unknown as JwtService,
    );
  });

  const user: User = {
    id: 'u1',
    email: 'a@b.com',
    passwordHash: 'hash',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('register', () => {
    it('throws when email exists', async () => {
      users.findByEmail.mockResolvedValue(user);

      await expect(
        service.register({ email: user.email, password: 'password12' }),
      ).rejects.toThrow(ConflictException);

      expect(users.create).not.toHaveBeenCalled();
    });

    it('creates user and returns tokens', async () => {
      users.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      users.create.mockResolvedValue(user);
      jwt.signAsync
        .mockResolvedValueOnce('access')
        .mockResolvedValueOnce('refresh');

      const result = await service.register({
        email: user.email,
        password: 'password12',
      });

      expect(users.create).toHaveBeenCalledWith(user.email, 'hashed');
      expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    });
  });

  describe('login', () => {
    it('throws when user missing', async () => {
      users.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@y.com', password: 'password12' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws when password invalid', async () => {
      users.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens on success', async () => {
      users.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.signAsync
        .mockResolvedValueOnce('access')
        .mockResolvedValueOnce('refresh');

      const result = await service.login({
        email: user.email,
        password: 'password12',
      });

      expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    });
  });

  describe('refresh', () => {
    it('throws when verify fails', async () => {
      jwt.verifyAsync.mockRejectedValue(new Error('bad'));

      await expect(
        service.refresh({ refreshToken: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws when payload is not refresh type', async () => {
      jwt.verifyAsync.mockResolvedValue({ sub: 'u1', typ: 'access' });

      await expect(
        service.refresh({ refreshToken: 'tok' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws when user missing', async () => {
      jwt.verifyAsync.mockResolvedValue({ sub: 'u1', typ: 'refresh' });
      users.findById.mockResolvedValue(null);

      await expect(
        service.refresh({ refreshToken: 'tok' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns new access token', async () => {
      jwt.verifyAsync.mockResolvedValue({ sub: user.id, typ: 'refresh' });
      users.findById.mockResolvedValue(user);
      jwt.signAsync.mockResolvedValue('new-access');

      const result = await service.refresh({ refreshToken: 'tok' });

      expect(result).toEqual({ accessToken: 'new-access' });
    });
  });
});
