import request, { Response } from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CleaningController', () => {
  let app: INestApplication;
  let executionRepo: Repository<CleanExecution>;
  const cleaningEndpoint = '/tibber-developer-test/enter-path';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    executionRepo = moduleFixture.get(getRepositoryToken(CleanExecution));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const assertSuccessResponse = (
    actualResponse: Response,
    expectResult: { commands: number; uniqueVisits: number },
  ) => {
    expect(actualResponse.status).toStrictEqual(201);
    expect(actualResponse.body).toStrictEqual({
      uniqueVisits: expectResult.uniqueVisits,
      commands: expectResult.commands,
      duration: expect.isPositiveNumber(),
      id: expect.isPositiveNumber(),
      insertedAt: expect.closeToNow(),
    });
  };

  const assertDb = async (actualResponse: Response): Promise<void> => {
    const executionId = actualResponse.body.id;
    expect(executionId).not.toBeNull();
    const result = await executionRepo.findOneOrFail({ where: { id: executionId } });
    expect(result).toStrictEqual(
      expect.objectContaining({
        uniqueVisits: actualResponse.body.uniqueVisits,
        commands: actualResponse.body.commands,
        duration: actualResponse.body.duration,
      }),
    );
  };

  describe('POST /tibber-developer-test/enter-path', () => {
    it('should return a correct cleaning execution', async () => {
      const payload = {
        start: {
          x: 10,
          y: 22,
        },
        commands: [
          {
            direction: 'east',
            steps: 2,
          },
          {
            direction: 'north',
            steps: 1,
          },
        ],
      };
      const response = await request(app.getHttpServer()).post(cleaningEndpoint).send(payload);
      assertSuccessResponse(response, { commands: payload.commands.length, uniqueVisits: 4 });
      await assertDb(response);
    });
  });
});
