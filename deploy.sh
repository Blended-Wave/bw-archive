#!/bin/bash

# Blended Wave 전체 빌드 및 PM2 재실행 스크립트
# EC2 환경에서 사용

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 Blended Wave 배포 시작..."
echo "========================================"

# 프로젝트 디렉토리로 이동
PROJECT_DIR="/home/ubuntu/projects/bw-archive"
cd $PROJECT_DIR

echo "📁 현재 디렉토리: $(pwd)"

# Git에서 최신 코드 가져오기
echo "📥 Git에서 최신 코드 가져오는 중..."
git fetch origin
git reset --hard origin/main
echo "✅ 최신 코드 가져오기 완료"

# PM2 프로세스 중지
echo "🛑 PM2 프로세스 중지 중..."
pm2 stop all || echo "⚠️  실행 중인 PM2 프로세스가 없습니다"
pm2 delete all || echo "⚠️  삭제할 PM2 프로세스가 없습니다"
echo "✅ PM2 프로세스 중지 완료"

# 백엔드 빌드
echo "🔨 백엔드 빌드 시작..."
cd $PROJECT_DIR/backend

# 백엔드 의존성 설치
echo "📦 백엔드 의존성 설치 중..."
npm install

# 백엔드 빌드
echo "🏗️  백엔드 TypeScript 빌드 중..."
npm run build
echo "✅ 백엔드 빌드 완료"

# 프론트엔드 빌드
echo "🔨 프론트엔드 빌드 시작..."
cd $PROJECT_DIR/frontend

# 프론트엔드 의존성 설치
echo "📦 프론트엔드 의존성 설치 중..."
npm install

# 프론트엔드 빌드 (메모리 증가)
echo "🏗️  프론트엔드 Next.js 빌드 중..."
NODE_OPTIONS="--max_old_space_size=2048" npm run build
echo "✅ 프론트엔드 빌드 완료"

# PM2로 서비스 시작
echo "🚀 PM2로 서비스 시작 중..."
cd $PROJECT_DIR

# PM2 ecosystem 파일로 시작 (프로젝트 루트의 파일 사용)
pm2 start ecosystem.config.js
echo "✅ PM2 서비스 시작 완료"

# PM2 상태 확인
echo "📊 PM2 상태 확인..."
pm2 status

# Nginx 설정 다시 로드
echo "🔄 Nginx 설정 다시 로드 중..."
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx 재로드 완료"

echo "========================================"
echo "🎉 배포 완료!"
echo "📱 사이트 확인: https://thisiscuzz.com"
echo "🔍 로그 확인: pm2 logs"
echo "📊 상태 확인: pm2 status"
echo "========================================"
