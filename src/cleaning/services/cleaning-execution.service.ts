import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CleaningInput } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { CleaningSession } from 'src/cleaning/services/cleaning-session.model';

@Injectable()
export class CleaningExecutionService {
  constructor(
    @InjectRepository(CleanExecution)
    private cleanExecutionRepo: Repository<CleanExecution>,
  ) {}

  async clean(input: CleaningInput): Promise<CleanExecution> {
    const cleanResult = CleaningSession.execute(input);
    return await this.saveExecutionResult(cleanResult);
  }

  private async saveExecutionResult(
    executionResult: Pick<CleanExecution, 'duration' | 'commands' | 'uniqueVisits'>,
  ): Promise<CleanExecution> {
    const execution = new CleanExecution();
    execution.commands = executionResult.commands;
    execution.uniqueVisits = executionResult.uniqueVisits;
    execution.duration = executionResult.duration;
    return await this.cleanExecutionRepo.save(execution);
  }
}
