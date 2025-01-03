import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { DocumentsService } from '../documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocumentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
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

      const expectedResult = {
        id: 1,
        title: 'Test Document',
        filePath: 'uploads/test-123.pdf',
      };

      mockDocumentsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(file, createDocumentDto);

      expect(service.create).toHaveBeenCalledWith(file, createDocumentDto);
      expect(result).toBe(expectedResult);
    });

    it('should handle errors during document creation', async () => {
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

      const error = new Error('Creation failed');
      mockDocumentsService.create.mockRejectedValue(error);

      await expect(controller.create(file, createDocumentDto))
        .rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return array of documents', async () => {
      const expectedResult = [
        { id: 1, title: 'Doc 1', filePath: 'path/1' },
        { id: 2, title: 'Doc 2', filePath: 'path/2' },
      ];

      mockDocumentsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });

    it('should handle errors when fetching documents', async () => {
      const error = new Error('Fetch failed');
      mockDocumentsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove document successfully', async () => {
      const documentId = '1';
      const expectedResult = { affected: 1 };

      mockDocumentsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(documentId);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(expectedResult);
    });

    it('should handle errors when removing document', async () => {
      const documentId = '1';
      const error = new Error('Removal failed');

      mockDocumentsService.remove.mockRejectedValue(error);

      await expect(controller.remove(documentId))
        .rejects.toThrow(error);
    });

    it('should convert string id to number when removing', async () => {
      const documentId = '123';
      await controller.remove(documentId);
      expect(service.remove).toHaveBeenCalledWith(123);
    });
  });
});