#!/bin/bash

# 서버 상태 확인 스크립트

echo "🔍 Blended Wave 서버 상태 확인"
echo "========================================"

echo "📊 PM2 프로세스 상태:"
pm2 status

echo ""
echo "🌐 Nginx 상태:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "💾 디스크 사용량:"
df -h /

echo ""
echo "🧠 메모리 사용량:"
free -h

echo ""
echo "🔗 포트 사용 상황:"
sudo netstat -tlnp | grep -E ":(3000|4000|80|443)"

echo ""
echo "📝 최근 PM2 로그 (마지막 20줄):"
pm2 logs --lines 20

echo "========================================"
echo "✅ 상태 확인 완료"
