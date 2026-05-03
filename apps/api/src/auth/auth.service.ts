import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

type RefreshJwtPayload = {
  sub?: string;
  typ?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.users.create(dto.email, passwordHash);
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshDto): Promise<{ accessToken: string }> {
    let payload: RefreshJwtPayload;
    try {
      payload = await this.jwt.verifyAsync<RefreshJwtPayload>(
        dto.refreshToken,
        {
          secret: this.getRefreshSecret(),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.typ !== 'refresh' || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.signAccessToken(user);
    return { accessToken };
  }

  private getRefreshSecret(): string {
    return (
      process.env['JWT_REFRESH_SECRET'] ?? 'dev_jwt_refresh_secret_change_me'
    );
  }

  private getRefreshExpiresIn(): StringValue {
    return (process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d') as StringValue;
  }

  private signAccessToken(user: { id: string; email: string }): Promise<string> {
    return this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
  }

  private signRefreshToken(user: { id: string }): Promise<string> {
    return this.jwt.signAsync(
      { sub: user.id, typ: 'refresh' },
      {
        secret: this.getRefreshSecret(),
        expiresIn: this.getRefreshExpiresIn(),
      },
    );
  }
}
