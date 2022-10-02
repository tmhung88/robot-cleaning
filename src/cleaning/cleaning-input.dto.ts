import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Position {
  @IsInt()
  @Min(-100000)
  @Max(100000)
  x: number;

  @IsInt()
  @Min(-100000)
  @Max(100000)
  y: number;
}

export enum Direction {
  east = 'east',
  north = 'north',
  west = 'west',
  south = 'south',
}

export class CleaningCommand {
  @IsEnum(Direction)
  direction: Direction;

  @IsInt()
  @Min(0)
  @Max(100000)
  steps: number;
}

export class CleaningInput {
  @ValidateNested()
  @Type(() => Position)
  start: Position;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10000)
  @Type(() => CleaningCommand)
  commands: CleaningCommand[];
}
