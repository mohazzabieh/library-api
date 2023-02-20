import { Module } from '@nestjs/common';
import { ProviderModule } from './modules/provider.module';
import { UserSeederModule } from './modules/user.seeder.module';
import { Seeder } from './Seeder';

@Module({
  imports: [ProviderModule, UserSeederModule],
  providers: [Seeder],
})
export class SeederModule {}
