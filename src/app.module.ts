import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CleaningModule } from './cleaning/cleaning.module';
import {
  PostgresConfig,
  postgresConfigFactory,
} from './config/postgres.config';
import { appConfigFactory } from './config/app.config';

@Module({
  imports: [
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
