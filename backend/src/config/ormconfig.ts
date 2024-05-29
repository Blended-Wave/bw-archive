import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as UserEntities from '../app/users/entities';
import * as WorksEntities from '../app/works/entities';
import *as dotenv from 'dotenv';

const ENV_PATH = `src/config/.env.${process.env.NODE_ENV}`

dotenv.config({path: ENV_PATH})

const config:TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST, 
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: [...Object.values(UserEntities), ...Object.values(WorksEntities)], // 엔터티들을 배열로 변환하여 사용 
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',  // 앱 실행 시 스키마 자동 생성 및 동기화 옵션, 개발 환경에서만 켜둘것
    logging: true,
}

export = config;