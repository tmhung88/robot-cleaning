import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';

describe('CleaningController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close()
  })

  describe('POST /tibber-developer-test/enter-path', () => {
    it('should return a correct cleaning execution', async () => {
      const payload = {
        'start': {
          'x': 10,
          'y': 22,
        },
        'commands': [
          {
            'direction': 'east',
            'steps': 2,
          },
          {
            'direction': 'north',
            'steps': 1,
          },
        ],
      };
      const response = await request(app.getHttpServer())
        .post('/tibber-developer-test/enter-path')
        .send(payload)

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({
        "commands": 2,
        "uniqueVisits": 4,
        "duration": expect.isPositiveNumber(),
        "id": expect.isPositiveNumber(),
        "insertedAt": expect.closeToNow()
      })
    })
  });
});
