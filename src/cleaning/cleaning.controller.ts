import { Body, Controller, Post } from '@nestjs/common';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { CleanOfficeInput } from 'src/cleaning/clean-office.dto';
import { CleaningExecutionService } from 'src/cleaning/service/cleaning-execution.service';

@Controller()
export class CleaningController {
  constructor(private readonly cleaningService: CleaningExecutionService) {}

  @Post('/tibber-developer-test/enter-path')
  async cleanOffice(@Body() input: CleanOfficeInput): Promise<CleanExecution> {
    return this.cleaningService.clean(input);
  }
}
