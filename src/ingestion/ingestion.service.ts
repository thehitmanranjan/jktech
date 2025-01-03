import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async trigger(documentIds: number[]) {
    const pythonBackendUrl = this.configService.get('PYTHON_BACKEND_URL');
    return firstValueFrom(
      this.httpService.post(`${pythonBackendUrl}/ingestion`, { documentIds })
    );
  }

  async getStatus() {
    const pythonBackendUrl = this.configService.get('PYTHON_BACKEND_URL');
    return firstValueFrom(
      this.httpService.get(`${pythonBackendUrl}/ingestion/status`)
    );
  }
}