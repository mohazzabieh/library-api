import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const options: TypeOrmModuleOptions = {
          ...env.mongoConfig,
          type: 'mongodb',
          useUnifiedTopology: true,
          autoLoadEntities: true,
        };

        return options;
      },
    }),
  ],
})
export class ProviderModule {}
