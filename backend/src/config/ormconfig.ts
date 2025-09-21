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
    keepConnectionAlive: true,
    // 개발환경에 최적화된 연결 풀 설정
    extra: {
        connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 3, // 개발: 3개로 줄임, 운영: 20개
        acquireTimeout: 60000, // 연결 획득 타임아웃 (60초)
        timeout: 60000, // 쿼리 타임아웃 (60초)
        reconnect: true, // 자동 재연결 활성화
        handleDisconnects: true, // 연결 끊김 자동 처리
        idleTimeout: process.env.NODE_ENV === 'production' ? 180000 : 240000, // 개발: 4분, 운영: 3분
        charset: 'utf8mb4',
        // MySQL 서버 연결 유지 설정
        keepAliveInitialDelay: 0,
        enableKeepAlive: true, // 개발환경에서도 활성화
        // 연결 검증 및 재시도 설정 강화
        maxReconnects: 5, // 재시도 횟수 증가
        reconnectDelay: 1000, // 재연결 지연시간 (1초)
        // 추가 안정성 설정
        multipleStatements: false,
        dateStrings: false,
        debug: false,
        trace: false,
        // Pool 관련 추가 설정
        queueLimit: 0, // 무제한 큐
        createConnection: undefined, // 기본값 사용
        autoReconnect: true // 자동 재연결
    }
}

export = config;