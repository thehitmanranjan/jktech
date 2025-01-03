import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../ingestion.controller';
import { IngestionService } from '../ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    trigger: jest.fn(),
    getStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerIngestion', () => {
    it('should call ingestionService.trigger with provided document IDs', async () => {
      const documentIds = [1, 2, 3];
      const expectedResponse = { status: 'success' };
      mockIngestionService.trigger.mockResolvedValue(expectedResponse);

      const result = await controller.triggerIngestion(documentIds);

      expect(service.trigger).toHaveBeenCalledWith(documentIds);
      expect(service.trigger).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResponse);
    });

    it('should handle errors from ingestionService.trigger', async () => {
      const documentIds = [1, 2, 3];
      const error = new Error('Ingestion failed');
      mockIngestionService.trigger.mockRejectedValue(error);

      await expect(controller.triggerIngestion(documentIds)).rejects.toThrow(error);
      expect(service.trigger).toHaveBeenCalledWith(documentIds);
      expect(service.trigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStatus', () => {
    it('should call ingestionService.getStatus and return the result', async () => {
      const expectedStatus = { status: 'processing', progress: 50 };
      mockIngestionService.getStatus.mockResolvedValue(expectedStatus);

      const result = await controller.getStatus();

      expect(service.getStatus).toHaveBeenCalled();
      expect(service.getStatus).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedStatus);
    });

    it('should handle errors from ingestionService.getStatus', async () => {
      const error = new Error('Failed to get status');
      mockIngestionService.getStatus.mockRejectedValue(error);

      await expect(controller.getStatus()).rejects.toThrow(error);
      expect(service.getStatus).toHaveBeenCalledTimes(1);
    });
  });
});