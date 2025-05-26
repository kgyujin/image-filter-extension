// 이미지 토글 처리를 위한 클래스 명 정의
const CLASS_HIDDEN = 'image-filter-hidden';
const CLASS_BLUR = 'image-filter-blur';
const CLASS_RESIZE = 'image-filter-resize';
const CLASS_BG_HIDE = 'image-filter-background';

let isFilterEnabled = false; // 필터 상태 캐싱

// 필터용 스타일 정의
const style = document.createElement('style');
style.textContent = `
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

// 필터 적용
function applyFilters() {
  try {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.add(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
    });

    const bgElements = document.querySelectorAll("*");
    bgElements.forEach((el) => {
      const bg = el.style.backgroundImage || window.getComputedStyle(el).getPropertyValue("background-image");
      if (bg && bg !== "none") {
        el.classList.add(CLASS_BG_HIDE);
      }
    });
  } catch (e) {
    console.warn("[Image Filter] 필터 적용 중 오류:", e);
  }
}

// 필터 해제
function removeFilters() {
  try {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.remove(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
    });

    const bgElements = document.querySelectorAll("*");
    bgElements.forEach((el) => {
      el.classList.remove(CLASS_BG_HIDE);
    });
  } catch (e) {
    console.warn("[Image Filter] 필터 해제 중 오류:", e);
  }
}

// DOM 변화 즉시 처리
function observeDOMForFilterApplication() {
  const observer = new MutationObserver(() => {
    if (isFilterEnabled) {
      try {
        applyFilters();
      } catch (e) {
        console.warn("[Image Filter] 감지 필터 적용 실패:", e);
      }
    }
  });

  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      requestAnimationFrame(startObserving);
    }
  };

  startObserving();
}

// 메시지 수신
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
      isFilterEnabled = true;
      applyFilters();
      break;
    case "disableAllFilters":
      isFilterEnabled = false;
      removeFilters();
      break;
    default:
      console.warn(`[Image Filter] 알 수 없는 action: ${message.action}`);
  }
});

// 개별 필터 토글
function toggleImageClass(className) {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.toggle(className);
  });

  const bgElements = document.querySelectorAll("*");
  bgElements.forEach((el) => {
    const bg = el.style.backgroundImage || window.getComputedStyle(el).getPropertyValue("background-image");
    if (bg && bg !== "none") {
      el.classList.toggle(CLASS_BG_HIDE);
    }
  });
}

// 초기 상태 불러와 필터 적용
chrome.storage.local.get(["filterEnabled"], (result) => {
  isFilterEnabled = result.filterEnabled ?? false;
  if (isFilterEnabled) {
    applyFilters();
  }
});

// DOM 감시 시작
observeDOMForFilterApplication();