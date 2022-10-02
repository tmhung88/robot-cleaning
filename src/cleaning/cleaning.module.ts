import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningController } from 'src/cleaning/cleaning.controller';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { CleaningExecutionService } from 'src/cleaning/services/cleaning-execution.service';
import { CleaningSession } from 'src/cleaning/services/cleaning-session.model';

@Module({
  imports: [TypeOrmModule.forFeature([CleanExecution])],
  controllers: [CleaningController],
  providers: [CleaningExecutionService, CleaningSession],
})
export class CleaningModule {}
