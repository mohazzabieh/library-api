import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeederService } from '../services/user.seeder.service';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { EnvModule } from 'src/env/env.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EnvModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
