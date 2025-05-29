const CLASS_HIDDEN = 'image-filter-hidden';
const CLASS_BG_HIDE = 'image-filter-background';

let isFilterEnabled = false;

const style = document.createElement('style');
style.id = 'image-filter-style';
style.textContent = generateStyleText();
document.documentElement.prepend(style);

function generateStyleText() {
  return `
    .${CLASS_HIDDEN} {
      display: none !important;
      visibility: hidden !important;
    }
    .${CLASS_BG_HIDE} {
      background-image: none !important;
    }
    img[data-image-filter-prehide="true"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
}

function updateStyle() {
  const s = document.getElementById('image-filter-style');
  if (s) s.textContent = generateStyleText();
}

// 이미지가 DOM에 추가되는 즉시 숨김 처리
function preHideImages() {
  // 아직 숨겨지지 않은 img에 data 속성 추가
  document.querySelectorAll('img:not([data-image-filter-prehide])').forEach(img => {
    img.setAttribute('data-image-filter-prehide', 'true');
  });
}

// prehide 속성 제거 (복구)
function removePreHideImages() {
  document.querySelectorAll('img[data-image-filter-prehide]').forEach(img => {
    img.removeAttribute('data-image-filter-prehide');
  });
}

function applyFilters() {
  preHideImages(); // 1차적으로 즉시 숨김

  chrome.storage.local.get(["selectedFilter"], (result) => {
    // 실제 필터 적용
    document.querySelectorAll("img").forEach((img) => {
      img.classList.add(CLASS_HIDDEN);
      img.removeAttribute('data-image-filter-prehide'); // class 방식으로 전환
    });

    document.querySelectorAll("*").forEach((el) => {
      const bg = el.style.backgroundImage || window.getComputedStyle(el).getPropertyValue("background-image");
      if (bg && bg !== "none") {
        el.classList.add(CLASS_BG_HIDE);
      }
    });
  });
}

function removeFilters() {
  document.querySelectorAll("img").forEach((img) => {
    img.classList.remove(CLASS_HIDDEN);
  });

  document.querySelectorAll("*").forEach((el) => {
    el.classList.remove(CLASS_BG_HIDE);
  });

  removePreHideImages(); // prehide 속성도 복구
}

function observeDOMForFilterApplication() {
  const observer = new MutationObserver((mutations) => {
    if (isFilterEnabled) {
      // 새로 추가된 img를 즉시 숨김
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') {
              node.setAttribute('data-image-filter-prehide', 'true');
            } else if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(img => {
                img.setAttribute('data-image-filter-prehide', 'true');
              });
            }
          }
        });
      });
      applyFilters();
    }
  });

  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      requestAnimationFrame(startObserving);
    }
  };

  startObserving();
}

// DOMContentLoaded 이전에 최대한 빨리 숨김 적용
preHideImages();

chrome.runtime.onMessage.addListener((message) => {
  const { action } = message;

  switch (action) {
    case "hideImages":
      applyFilters();
      break;
    case "enableAllFilters":
      isFilterEnabled = true;
      applyFilters();
      break;
    case "disableAllFilters":
      isFilterEnabled = false;
      removeFilters();
      break;
  }
});

chrome.storage.local.get(["filterEnabled"], (result) => {
  isFilterEnabled = result.filterEnabled ?? false;
  updateStyle();
  if (isFilterEnabled) applyFilters();
});

observeDOMForFilterApplication();