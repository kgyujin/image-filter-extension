# Image Filter Extension

| 항목 | 버전/설명 |
|------------|------------------------|
| Manifest | v3 (크롬 확장 프로그램) |
| 언어 | JavaScript |
| 실행환경 | Chrome + VSCode + GitHub |

## 디렉터리 구조
```
image-filter-extension/
├── background.js
├── content.js
├── popup.html
├── popup.js
├── styles/
│   └── popup.css
├── content.js
├── manifest.json
└── README.md
```

## 파일 설명

| 파일명 | 설명 |
|------------------|--------------------------------|
| manifest.json | 확장 프로그램의 설정 및 권한 정의(MV3 기준) |
| background.js | 우클릭 메뉴 등록 및 메시지 전달 핸들링 |
| content.js | 메시지 수신 후 이미지 숨김/블러/크기 조절 처리 |
| popup.html | 확장 프로그램 아이콘 클릭 시 표시되는 설정 UI |
| popup.js | 토글 스위치 제어 및 content.js로 메시지 전송 |
| styles/popup.css | 팝업 UI의 시각적 구성 |

## 기능 요약
- 확장 아이콘 클릭 시 이미지 처리 ON/OFF
- 우클릭 메뉴(Context Menu)를 통해 기능 수행
  - 이미지 숨기기
  - 이미지 블러 처리
  - 이미지 크기 축소

## 실행 방법(과정)
### Load
1. Chrome 주소창에 `chrome://extensions/` 입력 후 진입
2. 우측 상단 [개발자 모드] ON
3. [압축해제된 확장 프로그램 로드] 클릭
4. `image-filter-extension` 디렉토리 선택

## 개발 및 테스트 명령어
- 변경 사항 저장 후 리로드
  - Chrome 확장 탭 → **[새로고침]** 버튼 클릭
- 개발 로그 보기
  - Chrome 확장 탭 > 서비스 워커 → `background.js` 로그 확인