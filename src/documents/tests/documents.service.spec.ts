import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentsService } from '../documents.service';
import { Document } from '../entitites/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new document successfully', async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: './uploads',
        filename: 'test-123.pdf',
        path: 'uploads/test-123.pdf',
        size: 12345,
        buffer: Buffer.from('test'),
        stream: null,
      };

      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
      };

      const mockCreatedDocument = {
        id: 1,
        title: 'Test Document',
        filePath: 'uploads/test-123.pdf',
      };

      mockRepository.create.mockReturnValue(mockCreatedDocument);
      mockRepository.save.mockResolvedValue(mockCreatedDocument);

      const result = await service.create(file, createDocumentDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        filePath: file.path,
      });
      expect(repository.save).toHaveBeenCalledWith(mockCreatedDocument);
      expect(result).toEqual(mockCreatedDocument);
    });
  });

  describe('findAll', () => {
    it('should return array of documents', async () => {
      const mockDocuments = [
        { id: 1, title: 'Doc 1', filePath: 'path/1' },
        { id: 2, title: 'Doc 2', filePath: 'path/2' },
      ];

      mockRepository.find.mockResolvedValue(mockDocuments);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });

    it('should return empty array when no documents exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a document when found', async () => {
      const mockDocument = {
        id: 1,
        title: 'Test Document',
        filePath: 'path/1',
      };

      mockRepository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockDocument);
    });

    it('should return null when document not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove document successfully', async () => {
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it('should handle non-existent document removal', async () => {
      const deleteResult = { affected: 0 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(999);

      expect(repository.delete).toHaveBeenCalledWith(999);
      expect(result).toEqual(deleteResult);
    });
  });
});