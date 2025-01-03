import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entitites/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Express } from 'express';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto) {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      filePath: file.path,
    });
    return this.documentsRepository.save(document);
  }

  async findAll() {
    return this.documentsRepository.find();
  }

  async findOne(id: number) {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.documentsRepository.delete(id);
  }
}