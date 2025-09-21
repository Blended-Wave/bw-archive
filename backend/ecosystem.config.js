module.exports = {
  apps: [
    {
      name: 'bw-archive-backend',
      script: 'dist/main.js',
      instances: 1, // 클러스터 모드 (CPU 코어 수만큼)
      exec_mode: 'fork', // 또는 'cluster'
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      // 로그 설정
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',

      // 자동 재시작 설정
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',

      // 재시작 정책
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
