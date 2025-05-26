// 이미지 토글 처리를 위한 클래스 명 정의
const CLASS_HIDDEN = 'image-filter-hidden';
const CLASS_BLUR = 'image-filter-blur';
const CLASS_RESIZE = 'image-filter-resize';

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

// 이미지 요소에 토글 방식으로 클래스 적용/제거
function toggleImageClass(className) {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.toggle(className);
  });
}

// 각 클래스별 효과 정의
const style = document.createElement('style');
style.textContent = `
  /* 이미지 완전 숨기기 */
  .${CLASS_HIDDEN} {
    display: none !important;
  }

  /* 이미지 블러 처리 */
  .${CLASS_BLUR} {
    filter: blur(8px) !important;
  }

  /* 이미지 크기 축소 */
  .${CLASS_RESIZE} {
    width: 50% !important;
    height: auto !important;
    object-fit: contain !important;
  }
`;
document.head.appendChild(style);

// 모든 이미지 필터 켜기
function enableAllFilters() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.add(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
  });
}

// 모든 이미지 필터 끄기
function disableAllFilters() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.classList.remove(CLASS_HIDDEN, CLASS_BLUR, CLASS_RESIZE);
  });
}