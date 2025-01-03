import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @Roles('editor', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(file, createDocumentDto);
  }

  @Get()
  @Roles('viewer', 'editor', 'admin')
  async findAll() {
    return this.documentsService.findAll();
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
