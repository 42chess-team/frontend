# Auth Flow

## 인증 방식

- OAuth만 사용 (이메일/비밀번호 가입 없음)
- 백엔드가 OAuth 콜백 처리 후 자체 JWT 발급

## OAuth 제공자

1. **Google** (메인)
2. **Apple**
3. **42**

## 토큰 구조

| 토큰                | 저장 위치                           | 만료 |
| ------------------- | ----------------------------------- | ---- |
| Access Token (ATK)  | 메모리 (Zustand)                    | 15분 |
| Refresh Token (RTK) | httpOnly Cookie (백엔드 Set-Cookie) | 7일  |

## 인증 흐름

```
1. 유저가 OAuth 버튼 클릭
2. OAuth 제공자 로그인 페이지로 리다이렉트
3. 인증 완료 → 백엔드 콜백 URL로 리다이렉트
4. 백엔드가 유저 정보 확인/생성 후:
   - RTK → httpOnly Cookie (Set-Cookie)
   - ATK → 응답 body
5. 프론트가 ATK를 Zustand에 저장
6. 이후 API 요청 시 axios 헤더에 ATK 첨부
```

## 토큰 갱신

```
1. API 요청 → 401 응답
2. axios 인터셉터가 감지
3. POST /api/auth/refresh (Cookie에 RTK 자동 전송)
4. 백엔드가 새 ATK 응답
5. Zustand에 새 ATK 저장 → 원래 요청 재시도
```

## 새로고침 시

```
1. 페이지 로드 → Zustand에 ATK 없음
2. POST /api/auth/refresh (Cookie에 RTK 자동 전송)
3. 유효하면 새 ATK 발급 → 로그인 상태 복원
4. 무효하면 비로그인 상태
```

## 로그아웃

```
1. POST /api/auth/logout (Cookie에 RTK 자동 전송)
2. 백엔드가 RTK 무효화 + Cookie 삭제
3. 프론트가 Zustand 초기화
```

## 기타

- 다중 기기 로그인 허용
- 프론트는 토큰(ATK/RTK)을 localStorage에 저장하지 않음
