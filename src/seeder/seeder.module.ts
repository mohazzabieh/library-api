import { Module } from '@nestjs/common';
import { ProviderModule } from './modules/provider.module';
import { UserSeederModule } from './modules/user.seeder.module';
import { Seeder } from './Seeder';
import { AuthModule } from 'src/auth/auth.module';
import { EnvModule } from 'src/env/env.module';
import { BookSeederModule } from './modules/book.seeder.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ProviderModule,
    UserSeederModule,
    BookSeederModule,
    AuthModule,
    EnvModule,
    UserModule,
  ],
  providers: [Seeder],
})
export class SeederModule {}
