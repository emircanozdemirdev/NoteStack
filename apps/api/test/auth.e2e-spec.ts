import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { config } from 'dotenv';
import { resolve } from 'path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

config({ path: resolve(__dirname, '../.env') });

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = 'password12';
  let email: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    email = `auth-e2e-${Date.now()}@example.com`;
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({ where: { email } });
    } catch {
      // Ignore cleanup when DB was never reachable or suite aborted early.
    }
    await app.close();
  });

  it('register → login → me', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(200);

    expect(registerRes.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const accessToken = loginRes.body.accessToken as string;

    const meRes = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(meRes.body).toMatchObject({
      id: expect.any(String),
      email,
    });
  });
});
