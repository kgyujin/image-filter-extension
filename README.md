# Image Filter Extension

| 항목 | 버전/설명 |
|------------|------------------------|
| Manifest | v3 (크롬 확장 프로그램) |
| 언어 | JavaScript |
| 실행환경 | Chrome + VSCode + GitHub |

## 디렉터리 구조
```
image-filter-extension/
├── icons/
│   ├── icon128_off.png
│   ├── icon128_on.png
│   ├── icon16_off.png
│   ├── icon16_on.png
│   ├── icon48_off.png
│   └── icon48_on.png
├── README.md
├── background.js
├── content.js
└── manifest.json
```

## 파일 설명

| 파일명 | 설명 |
|------------------|--------------------------------|
| manifest.json | 확장 프로그램의 설정 및 권한 정의(MV3 기준) |
| background.js | 우클릭 메뉴 등록 및 메시지 전달 핸들링 |
| content.js | 메시지 수신 후 이미지 숨김 처리 |
| styles/popup.css | 팝업 UI의 시각적 구성 |

## 기능 요약
- 확장 아이콘 클릭 시 이미지 숨김 ON/OFF(필터 활성화 상태에 따라 아이콘 자동 변경)
- 우클릭 메뉴(Context Menu)를 통해 기능 수행
  - 이미지 숨기기

## 실행 방법(과정)
1. [해당 저장소](https://github.com/kgyujin/image-filter-extension)의 **[Release]** 페이지로 이동
2. 가장 최신 릴리즈의 **Assets**에서 ZIP 파일 다운로드
3. 다운로드한 ZIP 파일 압축 해제
4. Chrome 주소창에 `chrome://extensions/` 입력
5. 우측 상단 [개발자 모드] 활성화
6. **[압축해제된 확장 프로그램 로드]** 클릭
7. 방금 압축 해제한 폴더 선택

## 개발 및 테스트 명령어
- 변경 사항 저장 후 리로드
  - Chrome 확장 탭 → **[새로고침]** 버튼 클릭
- 개발 로그 보기
  - Chrome 확장 탭 > 서비스 워커 → `background.js` 로그 확인
