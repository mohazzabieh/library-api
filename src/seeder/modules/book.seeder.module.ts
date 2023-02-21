import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookSeederService } from '../services/book.seeder.service';
import { Book } from 'src/book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookSeederService],
  exports: [BookSeederService],
})
export class BookSeederModule {}
