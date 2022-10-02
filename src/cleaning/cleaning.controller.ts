import { Body, Controller, Post } from '@nestjs/common';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { CleaningInput } from 'src/cleaning/cleaning-input.dto';
import { CleaningExecutionService } from 'src/cleaning/services/cleaning-execution.service';

@Controller()
export class CleaningController {
  constructor(private readonly cleaningService: CleaningExecutionService) {}

  @Post('/tibber-developer-test/enter-path')
  async cleanOffice(@Body() input: CleaningInput): Promise<CleanExecution> {
    return this.cleaningService.clean(input);
  }
}
