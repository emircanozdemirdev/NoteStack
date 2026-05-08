import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/jwt.strategy';
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesDto } from './dto/list-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request & { user: AuthUser }, @Body() dto: CreateNoteDto) {
    return this.notes.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: Request & { user: AuthUser }, @Query() query: ListNotesDto) {
    return this.notes.findAll(req.user.userId, query);
  }

  @Get(':id')
  findOne(@Req() req: Request & { user: AuthUser }, @Param('id') id: string) {
    return this.notes.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: AuthUser },
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notes.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request & { user: AuthUser }, @Param('id') id: string) {
    await this.notes.remove(req.user.userId, id);
    return { deleted: true };
  }
}
