import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { GroupsModule } from './groups/groups.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development', // Apenas em dev!
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    WorkoutsModule,
    GroupsModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
