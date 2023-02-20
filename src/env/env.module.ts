import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import configs from './configs';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configs],
      cache: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
