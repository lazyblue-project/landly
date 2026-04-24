# Landly 테스트 배포 가이드

## 1. Vercel 배포 방법

### 사전 조건
- GitHub 계정 (코드 저장소)
- Vercel 계정 (vercel.com)

### 배포 절차

#### 1-1. GitHub 저장소 생성
```bash
# 프로젝트 루트에서
git init
git add .
git commit -m "chore: initial landly source"
git remote add origin https://github.com/<your-id>/landly.git
git push -u origin main
```

#### 1-2. Vercel 프로젝트 연결
1. vercel.com 접속 → **Add New Project**
2. GitHub 저장소 `landly` 선택
3. Framework Preset: **Next.js** (자동 감지)
4. **Deploy** 클릭

> 첫 배포 완료 후 `https://landly-xxx.vercel.app` 형태의 URL이 생성됩니다.

---

## 2. 환경별 구분 (Staging / Production)

| 환경 | 브랜치 | URL 예시 | 용도 |
|------|--------|----------|------|
| Production | `main` | `landly.vercel.app` | 최종 배포 |
| Staging / Preview | `staging` or PR | `landly-git-staging-xxx.vercel.app` | 외부 테스트 |

### Staging 브랜치 만들기
```bash
git checkout -b staging
git push -u origin staging
```
Vercel은 모든 브랜치에 **Preview Deployment**를 자동 생성합니다.  
`staging` 브랜치로 Push 할 때마다 새 Preview URL이 발급됩니다.

---

## 3. 환경변수 설정

### Vercel Dashboard에서 설정
1. Project → **Settings** → **Environment Variables**
2. 아래 변수를 추가:

| Key | Value | 환경 |
|-----|-------|------|
| `NEXT_PUBLIC_APP_ENV` | `production` | Production |
| `NEXT_PUBLIC_APP_ENV` | `staging` | Preview |
| `NEXT_PUBLIC_FEEDBACK_URL` | Google Form URL | All |

### 로컬 개발
```bash
cp .env.example .env.local
# .env.local 파일에 실제 값 입력
```

---

## 4. 외부 테스터 공유 방법

### 권장: Preview URL 공유
- 테스터에게 `staging` 브랜치의 Preview URL을 공유
- URL 예: `https://landly-git-staging-<your-id>.vercel.app`

### 선택: Vercel Password Protection
Vercel Pro 이상에서 사용 가능:
1. Project → **Settings** → **Deployment Protection**
2. **Password Protection** 활성화 → 비밀번호 설정
3. 테스터에게 URL + 비밀번호 전달

---

## 5. PWA 아이콘 준비 (홈 화면 설치)

현재 `public/icons/icon.svg`가 있습니다.  
**Android Chrome의 PWA 설치 배너**를 위해 PNG 아이콘이 필요합니다.

```bash
# ImageMagick 설치 후
magick public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
magick public/icons/icon.svg -resize 512x512 public/icons/icon-512.png
```

또는 브라우저에서: [Squoosh](https://squoosh.app) → SVG 업로드 → PNG 내보내기

> SVG 아이콘만 있어도 iOS Safari의 "홈 화면에 추가"는 정상 동작합니다.

---

## 6. 배포 체크리스트

- [ ] `git push` 완료 및 Vercel 빌드 성공 확인
- [ ] Preview URL로 외부 접속 테스트
- [ ] 모바일(iOS/Android)에서 홈 화면 추가 테스트
- [ ] `/test` 페이지 접속 확인
- [ ] 피드백 폼 URL 환경변수 설정 확인 (`NEXT_PUBLIC_FEEDBACK_URL`)
- [ ] PNG 아이콘 생성 후 `public/icons/` 에 추가
