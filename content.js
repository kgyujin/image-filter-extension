// 이미지 토글 처리를 위한 클래스 명 정의
const CLASS_HIDDEN = 'image-filter-hidden';
const CLASS_BLUR = 'image-filter-blur';
const CLASS_RESIZE = 'image-filter-resize';
const CLASS_BG_HIDE = 'image-filter-background';

// 확장 프로그램이 삽입된 직후 저장된 상태가 활성화되어 있으면 자동 필터 적용
chrome.storage.local.get(["filterEnabled"], (result) => {
  const isEnabled = result.filterEnabled ?? false;
  if (isEnabled) {
    enableAllFilters();
  }
});

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
      enableAllFilters();
      break;
    case "disableAllFilters":
      disableAllFilters();
      break;
    default:
      console.warn(`[Image Filter] 알 수 없는 action: ${message.action}`);
  }
});

// 이미지 및 background-image 요소에 클래스 적용/제거
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

// 각 클래스별 효과 정의
const style = document.createElement('style');
style.textContent = `
  .${CLASS_HIDDEN} {
    display: none !important;
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
document.head.appendChild(style);

// 모든 이미지 필터 켜기
function enableAllFilters() {
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

// 모든 이미지 필터 끄기
function disableAllFilters() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.remove(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
  });

  const bgElements = document.querySelectorAll("*");
  bgElements.forEach((el) => {
    el.classList.remove(CLASS_BG_HIDE);
  });
}