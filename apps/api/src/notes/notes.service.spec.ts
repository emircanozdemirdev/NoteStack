import { NotFoundException } from '@nestjs/common';
import type { Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  const prisma = {
    note: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotesService(prisma as unknown as PrismaService);
  });

  const userId = 'user-1';
  const noteId = 'note-1';

  const sampleNote: Note = {
    id: noteId,
    title: 'T',
    content: 'C',
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('create delegates to prisma with userId', async () => {
    prisma.note.create.mockResolvedValue(sampleNote);

    const dto = { title: 'Hello', content: 'Body' };
    const result = await service.create(userId, dto);

    expect(prisma.note.create).toHaveBeenCalledWith({
      data: { userId, title: 'Hello', content: 'Body' },
    });
    expect(result).toEqual(sampleNote);
  });

  it('create defaults empty content', async () => {
    prisma.note.create.mockResolvedValue(sampleNote);

    await service.create(userId, { title: 'Only title' });

    expect(prisma.note.create).toHaveBeenCalledWith({
      data: { userId, title: 'Only title', content: '' },
    });
  });

  it('findAll scopes by userId and passes query options', async () => {
    prisma.note.findMany.mockResolvedValue([sampleNote]);

    await service.findAll(userId, { q: 'foo', skip: 10, take: 5 });

    expect(prisma.note.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        OR: [
          { title: { contains: 'foo', mode: 'insensitive' } },
          { content: { contains: 'foo', mode: 'insensitive' } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      skip: 10,
      take: 5,
    });
  });

  it('findOne throws when note missing', async () => {
    prisma.note.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, noteId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update calls findOne then prisma.update', async () => {
    prisma.note.findFirst.mockResolvedValue(sampleNote);
    const updated = { ...sampleNote, title: 'New' };
    prisma.note.update.mockResolvedValue(updated);

    const result = await service.update(userId, noteId, { title: 'New' });

    expect(prisma.note.update).toHaveBeenCalledWith({
      where: { id: noteId },
      data: { title: 'New' },
    });
    expect(result).toEqual(updated);
  });

  it('remove calls delete after findOne', async () => {
    prisma.note.findFirst.mockResolvedValue(sampleNote);
    prisma.note.delete.mockResolvedValue(sampleNote);

    await service.remove(userId, noteId);

    expect(prisma.note.delete).toHaveBeenCalledWith({
      where: { id: noteId },
    });
  });
});
