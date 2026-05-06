import { Injectable, NotFoundException } from '@nestjs/common';
import type { Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesDto } from './dto/list-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateNoteDto): Promise<Note> {
    return this.prisma.note.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content ?? '',
      },
    });
  }

  findAll(userId: string, query: ListNotesDto): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        userId,
        ...(query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: 'insensitive' } },
                { content: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      skip: query.skip,
      take: query.take ?? 20,
    });
  }

  async findOne(userId: string, noteId: string): Promise<Note> {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(userId: string, noteId: string, dto: UpdateNoteDto): Promise<Note> {
    await this.findOne(userId, noteId);
    return this.prisma.note.update({
      where: { id: noteId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
      },
    });
  }

  async remove(userId: string, noteId: string): Promise<void> {
    await this.findOne(userId, noteId);
    await this.prisma.note.delete({ where: { id: noteId } });
  }
}
