import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningController } from './cleaning.controller';
import { CleanExecution } from './clean-execution.entity';
import { CleaningExecutionService } from './service/cleaning-execution.service';

@Module({
  imports: [TypeOrmModule.forFeature([CleanExecution])],
  controllers: [CleaningController],
  providers: [CleaningExecutionService],
})
export class CleaningModule {}
