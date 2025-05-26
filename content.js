// 이미지 토글 처리를 위한 클래스 명 정의
const CLASS_HIDDEN = 'image-filter-hidden';
const CLASS_BLUR = 'image-filter-blur';
const CLASS_RESIZE = 'image-filter-resize';
const CLASS_BG_HIDE = 'image-filter-background';

// 초기 스타일 즉시 삽입 (선제 차단)
const style = document.createElement('style');
style.textContent = `
  /* 초기 렌더링 시 숨김 우선 처리 */
  img,
  [style*="background-image"] {
    visibility: hidden !important;
  }

  .${CLASS_HIDDEN} {
    display: none !important;
    visibility: hidden !important;
  }

  .${CLASS_BLUR} {
    filter: blur(8px) !important;
  }

  .${CLASS_RESIZE} {
    width: 50% !important;
    height: auto !important;
    object-fit: contain !important;
  }

  .${CLASS_BG_HIDE} {
    background-image: none !important;
  }
`;
document.documentElement.prepend(style);

// 필터 적용 함수
function applyFilters() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.add(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
  });

  const bgElements = document.querySelectorAll("*");
  bgElements.forEach((el) => {
    const bg = window.getComputedStyle(el).getPropertyValue("background-image");
    if (bg && bg !== "none") {
      el.classList.add(CLASS_BG_HIDE);
    }
  });
}

// 필터 제거 함수
function removeFilters() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.remove(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
  });

  const bgElements = document.querySelectorAll("*");
  bgElements.forEach((el) => {
    el.classList.remove(CLASS_BG_HIDE);
  });
}

// DOM 변화 감지
function observeDOMForFilterApplication() {
  const observer = new MutationObserver(() => {
    chrome.storage.local.get(["filterEnabled"], (result) => {
      const isEnabled = result.filterEnabled ?? false;
      if (isEnabled) {
        applyFilters();
      }
    });
  });

  // document.body가 로드될 때까지 기다렸다가 observe 실행
  function waitForBodyAndObserve() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      requestAnimationFrame(waitForBodyAndObserve);
    }
  }

  waitForBodyAndObserve();
}

// 메시지 수신 대기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "hideImages":
      toggleImageClass(CLASS_HIDDEN);
      break;
    case "blurImages":
      toggleImageClass(CLASS_BLUR);
      break;
    case "resizeImages":
      toggleImageClass(CLASS_RESIZE);
      break;
    case "enableAllFilters":
      applyFilters();
      break;
    case "disableAllFilters":
      removeFilters();
      break;
    default:
      console.warn(`[Image Filter] 알 수 없는 action: ${message.action}`);
  }
});

// 토글 함수 (우클릭)
function toggleImageClass(className) {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.toggle(className);
  });

  const bgElements = document.querySelectorAll("*");
  bgElements.forEach((el) => {
    const bg = window.getComputedStyle(el).getPropertyValue("background-image");
    if (bg && bg !== "none") {
      el.classList.toggle(CLASS_BG_HIDE);
    }
  });
}

// 초기 진입 시 필터 상태 확인 후 적용
chrome.storage.local.get(["filterEnabled"], (result) => {
  const isEnabled = result.filterEnabled ?? false;
  if (isEnabled) {
    applyFilters();
  }
});

// 감시 시작
observeDOMForFilterApplication();