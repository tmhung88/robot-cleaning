import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CleaningModule } from 'src/cleaning/cleaning.module';
import {
  PostgresConfig,
  postgresConfigFactory,
} from 'src/config/postgres.config';
import { appConfigFactory } from 'src/config/app.config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfigFactory, postgresConfigFactory],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<PostgresConfig>('postgres'),
        type: 'postgres',
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    CleaningModule,
  ],
})
export class AppModule {}
