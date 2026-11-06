import { Test, TestingModule } from '@nestjs/testing';
import { LojaService } from './loja.service';

describe('LojaService', () => {
  let service: LojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LojaService],
    }).compile();

    service = module.get<LojaService>(LojaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
