#!/bin/bash

# 배포 스크립트들에 실행 권한 부여 및 설정

echo "🔧 배포 스크립트 설정 중..."

# 스크립트들에 실행 권한 부여
chmod +x deploy.sh
chmod +x quick-deploy.sh
chmod +x check-status.sh
chmod +x setup-scripts.sh

echo "✅ 실행 권한 부여 완료"

# .env.production 파일 존재 확인
if [ ! -f "backend/.env.production" ]; then
    echo "⚠️  backend/.env.production 파일이 없습니다!"
    echo "   다음 명령어로 생성하세요:"
    echo "   cp backend/.env.dev backend/.env.production"
    echo "   vi backend/.env.production"
fi

if [ ! -f "frontend/.env.production" ]; then
    echo "⚠️  frontend/.env.production 파일이 없습니다!"
    echo "   다음 내용으로 생성하세요:"
    echo "   echo 'NEXT_PUBLIC_API_URL=https://thisiscuzz.com/api' > frontend/.env.production"
fi

# ecosystem.config.js 파일 존재 확인
if [ ! -f "ecosystem.config.js" ]; then
    echo "⚠️  ecosystem.config.js 파일이 없습니다!"
    echo "   프로젝트 루트에 PM2 설정 파일이 필요합니다."
else
    echo "✅ ecosystem.config.js 파일 확인됨"
fi

echo ""
echo "📋 사용 가능한 명령어들:"
echo "  ./deploy.sh       - 전체 배포 (Git pull + 빌드 + 재시작)"
echo "  ./quick-deploy.sh - 빠른 배포 (빌드 + 재시작만)"
echo "  ./check-status.sh - 서버 상태 확인"
echo ""
echo "🎯 스크립트 설정 완료!"
