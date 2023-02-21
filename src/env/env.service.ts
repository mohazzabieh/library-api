import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MongoConfig {
  readonly url: string;
  readonly database: string;
}

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  readonly port: number = parseInt(this.configService.get<string>('port'));

  readonly mongoConfig: MongoConfig = {
    url: this.configService.get<string>('mongo.url'),
    database: this.configService.get<string>('mongo.db'),
  };

  readonly salt: string = this.configService.get<string>('salt');
}
