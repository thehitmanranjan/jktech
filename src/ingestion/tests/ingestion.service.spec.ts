import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IngestionService } from '../ingestion.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('IngestionService', () => {
  let service: IngestionService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const PYTHON_BACKEND_URL = 'http://python-backend:5000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);

    mockConfigService.get.mockReturnValue(PYTHON_BACKEND_URL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trigger', () => {
    it('should successfully trigger ingestion process', async () => {
      const documentIds = [1, 2, 3];
      const expectedResponse: AxiosResponse = {
        data: { status: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(expectedResponse));

      const result = await service.trigger(documentIds);

      expect(configService.get).toHaveBeenCalledWith('PYTHON_BACKEND_URL');
      expect(httpService.post).toHaveBeenCalledWith(
        `${PYTHON_BACKEND_URL}/ingestion`,
        { documentIds }
      );
      expect(result).toBe(expectedResponse);
    });

    it('should handle HTTP errors during trigger', async () => {
      const documentIds = [1, 2, 3];
      const error = new Error('HTTP Error');

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.trigger(documentIds)).rejects.toThrow(error);
      expect(configService.get).toHaveBeenCalledWith('PYTHON_BACKEND_URL');
      expect(httpService.post).toHaveBeenCalledWith(
        `${PYTHON_BACKEND_URL}/ingestion`,
        { documentIds }
      );
    });
  });

  describe('getStatus', () => {
    it('should successfully retrieve ingestion status', async () => {
      const expectedResponse: AxiosResponse = {
        data: { status: 'processing', progress: 50 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(expectedResponse));

      const result = await service.getStatus();

      expect(configService.get).toHaveBeenCalledWith('PYTHON_BACKEND_URL');
      expect(httpService.get).toHaveBeenCalledWith(
        `${PYTHON_BACKEND_URL}/ingestion/status`
      );
      expect(result).toBe(expectedResponse);
    });

    it('should handle HTTP errors when getting status', async () => {
      const error = new Error('HTTP Error');

      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getStatus()).rejects.toThrow(error);
      expect(configService.get).toHaveBeenCalledWith('PYTHON_BACKEND_URL');
      expect(httpService.get).toHaveBeenCalledWith(
        `${PYTHON_BACKEND_URL}/ingestion/status`
      );
    });
  });
});