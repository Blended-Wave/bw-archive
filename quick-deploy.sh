#!/bin/bash

# 빠른 배포 스크립트 (Git pull 없이)
# 로컬 변경사항만 빌드하고 재시작

set -e

echo "⚡ 빠른 배포 시작..."
echo "========================================"

PROJECT_DIR="/home/ubuntu/projects/bw-archive"
cd $PROJECT_DIR

# PM2 중지
echo "🛑 PM2 프로세스 중지 중..."
pm2 stop all || true
pm2 delete all || true

# 백엔드 빌드
echo "🔨 백엔드 빌드..."
cd $PROJECT_DIR/backend
npm run build

# 프론트엔드 빌드
echo "🔨 프론트엔드 빌드..."
cd $PROJECT_DIR/frontend
NODE_OPTIONS="--max_old_space_size=2048" npm run build

# PM2 재시작
echo "🚀 PM2 재시작..."
cd $PROJECT_DIR
pm2 start ecosystem.config.js

echo "⚡ 빠른 배포 완료!"
pm2 status
