import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeederService } from '../services/user.seeder.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
