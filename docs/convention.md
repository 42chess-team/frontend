# Git Convention

## 브랜치 전략

```
main          ← 배포용 (안정)
develop       ← 개발 통합
feature/*     ← 기능 개발 (develop에서 분기)
hotfix/*      ← 긴급 수정 (main에서 분기)
chore/*       ← 설정, CI, 문서 등
```

**흐름:** `feature/* → develop PR → main PR (배포)`

## 커밋 컨벤션 (Conventional Commits)

```
feat: 새로운 기능
fix: 버그 수정
chore: 설정, CI, 빌드 등
refactor: 코드 리팩토링
style: 포맷팅, 세미콜론 등
docs: 문서 변경
test: 테스트 추가/수정
```

### 예시

```
feat: add game page with chessboard
fix: timer not resetting on rematch
chore: add CI workflow and GitHub templates
```

## PR 규칙

- feature → develop: 자유롭게
- develop → main: 충분히 테스트 후
