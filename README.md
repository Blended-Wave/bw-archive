# 🎨 Blended Wave Archive

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/136903496?s=400&u=a5c54197d2e3fc4e8d5d2c847ba5b0e058e0d699&v=4" alt="Blended Wave Logo" width="200">
</p>

<p align="center">
  <strong>아티스트를 위한 종합 포트폴리오 관리 플랫폼</strong><br>
  <em>작품 업로드부터 관리자 패널까지, 완전한 웹 서비스</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Version-v1.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Developer-Solo-orange?style=for-the-badge" alt="Developer">
</p>

---

## 🚀 배포 주소

🔗 **Production**: [http://thisiscuzz.com](http://thisiscuzz.com)  

> **개발기간**: 2024.03 ~ 현재 (지속적 운영 및 개선)  
> **배포환경**: AWS EC2 + RDS + S3

---

## 📖 프로젝트 소개

**Blended Wave Archive**는 아티스트들이 자신의 작품을 체계적으로 관리하고 전시할 수 있는 **풀스택 웹 플랫폼**입니다.

### ✨ 주요 기능

- 🎨 **작품 관리**: 이미지/비디오 업로드, 메타데이터 관리, 시리즈 분류
- 👥 **사용자 시스템**: 세션 기반 인증, 프로필 관리, 아티스트별 소개 작업물 모아보기
- 🔍 **작품 탐색**: 최신순/조회수순 정렬, 페이지네이션, 상세 모달

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14.1.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modules-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-red?style=for-the-badge&logo=typeorm&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-Auth-34E27A?style=for-the-badge&logo=passport&logoColor=white)

### Database & Storage
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Session%20Store-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-File%20Storage-569A31?style=for-the-badge&logo=amazons3&logoColor=white)

### Infrastructure & DevOps
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-Compute-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![AWS RDS](https://img.shields.io/badge/AWS%20RDS-Database-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

### Development Tools
![Visual Studio Code](https://img.shields.io/badge/VS%20Code-IDE-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?style=for-the-badge&logo=git&logoColor=white)
![npm](https://img.shields.io/badge/npm-Package%20Manager-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │   Data Layer    │
│                 │    │                 │    │                 │
│  Next.js 14     │◄──►│   NestJS 10     │◄──►│   MySQL 8.0     │
│  React 18       │    │   Node.js 20    │    │   (AWS RDS)     │
│  TypeScript     │    │   TypeScript    │    │                 │
│                 │    │                 │    │   Redis Session │
│                 │    │   Passport.js   │    │                 │
│                 │    │   TypeORM       │    │   AWS S3        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Infrastructure  │
                    │                 │
                    │  AWS EC2        │
                    │  Nginx Proxy    │
                    │  PM2 Cluster    │
                    │  SSL/TLS        │
                    └─────────────────┘
```

---

## 🚀 시작 가이드

### 📋 Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0  
- **MySQL** >= 8.0
- **Redis** >= 6.0

### 🔧 Installation

1. **Repository Clone**
   ```bash
   git clone https://github.com/your-username/blended-wave.git
   cd blended-wave
   ```

2. **Backend Setup**
   ```bash
   cd bw-archive/backend
   npm install
   
   # 환경변수 설정
   cp .env.example .env
   # .env 파일에 데이터베이스 정보 입력
   
   # 데이터베이스 마이그레이션
   npm run build
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000
   - **Admin Panel**: http://localhost:3000/admin

### 🔐 Environment Variables

**Backend (.env)**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_DB=blended_wave

# Session
SESSION_SECRET=your_session_secret
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
AWS_REGION=ap-northeast-2
```

---

## 📱 주요 화면

### 🏠 메인 페이지
- **YouTube 배경 비디오**: 시각적 임팩트를 위한 동영상 배경

### 🎨 작품 갤러리
- **정렬 옵션**: 최신순, 조회수순, 고정 작품
- **페이지네이션**: 12개씩 분할 로딩

### 👨‍🎨 아티스트 소개
- **작품 슬라이더**: Swiper 기반 인터랙티브 갤러리
- **작품 상세 모달**: 클릭 시 상세 정보 표시

### ⚙️ 관리자 패널
- **사용자 관리**: 계정 상태 관리
- **작품 관리**: CRUD 작업, 상태 변경

---

## 🚧 개발 히스토리

### v1.0.0 (2024.03 - 현재)
- ✅ **기본 CRUD 시스템** 구축
- ✅ **세션 기반 인증** 구현  
- ✅ **AWS S3 파일 업로드** 시스템
- ✅ **관리자 패널** 구현
- ✅ **반응형 UI** 적용
- ✅ **프로덕션 배포** 완료

### 🔮 향후 계획
- 🔄 **성능 모니터링** 시스템 도입
- 🔄 **CI/CD 파이프라인** 구축
- 🔄 **Redis 캐싱** 레이어 추가 (현재는 세션 스토어로만 활용)
- 🔄 **이미지 최적화** (WebP, 리사이징)

---

## 🤝 기여하기

피드백과 제안은 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

이 프로젝트는 MIT 라이센스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 📞 Contact

 
**이메일**: sunwoo005@gmail.com  

