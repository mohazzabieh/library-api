import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(async () => {

    let configs = (): Record<string, any> => ({
      "port": 770,
      "mongo": {
        "url": "mongoUrl",
        "db": "test-db",
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configs],
        })
      ],
      providers: [EnvService],
    }).compile();

    service = module.get<EnvService>(EnvService);
  });

  it('should be return config values', () => {
    expect(service.port).toBe(770);

    expect(service.mongoConfig).toBeDefined();

    expect(service.mongoConfig.url).toBe("mongoUrl");

    expect(service.mongoConfig.database).toBe("test-db");
  });
});
