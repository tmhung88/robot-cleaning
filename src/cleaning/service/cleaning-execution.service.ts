import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CleanOfficeInput } from '../clean-office.dto';
import { CleanExecution } from '../clean-execution.entity';
import { CleaningSession } from './cleaning-session.model';

@Injectable()
export class CleaningExecutionService {
  @InjectRepository(CleanExecution)
  private cleanExecutionRepo: Repository<CleanExecution>;

  async clean(input: CleanOfficeInput): Promise<CleanExecution> {
    const cleaningSession = new CleaningSession();
    const cleanResult = cleaningSession.performCleaning(input);
    return await this.saveExecutionResult(cleanResult);
  }

  private async saveExecutionResult(
    executionResult: Pick<
      CleanExecution,
      'duration' | 'commands' | 'uniqueVisits'
    >,
  ): Promise<CleanExecution> {
    const execution = new CleanExecution();
    execution.commands = executionResult.commands;
    execution.uniqueVisits = executionResult.uniqueVisits;
    execution.duration = executionResult.duration;
    return this.cleanExecutionRepo.save(execution);
  }
}
