import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { config } from 'dotenv';
import { resolve } from 'path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

config({ path: resolve(__dirname, '../.env') });

describe('Notes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = 'password12';
  let email: string;
  let accessToken: string;
  let noteId: string;

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
    email = `notes-e2e-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(200);

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    accessToken = loginRes.body.accessToken as string;
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({ where: { email } });
    } catch {
      // Ignore cleanup when DB is unavailable in local test environment.
    }
    await app.close();
  });

  it('auth + notes CRUD flow', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'First note',
        content: 'Hello from e2e',
      })
      .expect(201);

    expect(createRes.body).toMatchObject({
      id: expect.any(String),
      title: 'First note',
      content: 'Hello from e2e',
    });

    noteId = createRes.body.id as string;

    const listRes = await request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.some((n: { id: string }) => n.id === noteId)).toBe(true);

    const detailRes = await request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(detailRes.body).toMatchObject({
      id: noteId,
      title: 'First note',
      content: 'Hello from e2e',
    });

    const updateRes = await request(app.getHttpServer())
      .patch(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated note',
        content: 'Updated content',
      })
      .expect(200);

    expect(updateRes.body).toMatchObject({
      id: noteId,
      title: 'Updated note',
      content: 'Updated content',
    });

    await request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect({ deleted: true });

    await request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
