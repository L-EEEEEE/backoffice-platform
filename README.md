# 🚀 확장성 있는 멀티 테넌트 기반 백엔드 시스템

안정적인 아키텍처와 유연한 확장성을 지향하는 백엔드 서비스입니다.
Java/Spring 생태계에서 체득한 계층화 설계 원칙을 NestJS에 적용하여, 유지보수가 용이하고 보안이 강화된 시스템을 구축했습니다.

## 🛠 Tech Stack
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL / TypeORM
- **Authentication**: JWT, Passport
- **Environment Management**: @nestjs/config (Environment Variables)

## ✨ 핵심 구현 사항

### 1. 보안 및 인증 아키텍처 (Security)
- **JWT & Passport 기반 인증**: Stateless한 인증 방식을 채택하여 서버의 확장성을 확보하고 보안 레이어를 구축했습니다.
- **환경변수 관리 고도화**: `ConfigService`를 활용해 민감한 정보를 소스코드와 완전 분리하였으며, `registerAsync`를 통해 의존성 주입 시점의 안정성을 확보했습니다.
- **보안 예외 처리**: 인증 실패 시 보안 위협을 최소화하기 위해 에러 메시지를 정제하고 통합된 예외 처리를 구현했습니다.

### 2. 도메인 및 데이터베이스 설계 (Domain & DB)
- **Multi-Tenant 구조**: 조직(Tenant)과 구성원(Member) 간의 관계를 설계하여 데이터 격리의 기초를 마련했습니다.
- **역방향 조회 최적화**: 서비스 로직에 필요한 양방향 연관관계를 설정하고, 효율적인 데이터 조회를 위해 관계 설정을 최적화했습니다.
- **데이터 무결성**: ValidationPipe를 전역에 적용하여 인입되는 데이터의 유효성을 엄격하게 검증합니다.

### 3. 개발 표준화 및 생산성 (Standardization)
- **Global Response Interceptor**: API 응답 규격을 전역적으로 통일하여 클라이언트와의 통신 효율을 극대화했습니다.
- **관심사의 분리(SoC)**: 인증, 회원, 조직 도메인을 독립적인 모듈로 분리하여 코드의 응집도를 높이고 결합도를 낮췄습니다.

## 🚦 시작하기
1. 의존성 설치: `npm install`
2. 환경변수 설정: `.env` 파일에 `JWT_SECRET`, `JWT_EXPIRATION_TIME` 정의
3. 서버 실행: `npm run start:dev`

## 💡 개발 철학
- **안정성**: 예외 상황을 선제적으로 방어하는 코드를 작성합니다.
- **표준화**: 팀 생산성을 위해 공통 규격과 아키텍처를 중시합니다.
- **학습과 기록**: 새로운 기술을 기존의 실무 경험과 융합하여 최적의 해답을 찾아내는 과정을 기록합니다.