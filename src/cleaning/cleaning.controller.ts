import { Body, Controller, Post } from '@nestjs/common';
import { CleanExecution } from './clean-execution.entity';
import { CleanOfficeInput } from './clean-office.dto';
import { CleaningExecutionService } from './service/cleaning-execution.service';

@Controller()
export class CleaningController {
  constructor(private readonly cleaningService: CleaningExecutionService) {}

  @Post('/tibber-developer-test/enter-path')
  async cleanOffice(@Body() input: CleanOfficeInput): Promise<CleanExecution> {
    return this.cleaningService.clean(input);
  }
}
