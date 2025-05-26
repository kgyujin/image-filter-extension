// 확장 프로그램 설치 시 context menu 등록
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "hideImages", title: "이미지 숨기기", contexts: ["all"] });
    chrome.contextMenus.create({ id: "blurImages", title: "이미지 블러 처리", contexts: ["all"] });
    chrome.contextMenus.create({ id: "resizeImages", title: "이미지 크기 축소", contexts: ["all"] });
  });
});

// 아이콘 클릭 시 필터 ON/OFF 전환
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["filterEnabled"], (result) => {
    const isEnabled = result.filterEnabled ?? false;
    const newState = !isEnabled;

    // 상태 저장
    chrome.storage.local.set({ filterEnabled: newState });

    // 아이콘 업데이트
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        "128": newState ? "icons/icon128_on.png" : "icons/icon128_off.png"
      }
    });

    if (!tab.id) return;

    // content.js에 메시지 직접 전송
    chrome.tabs.sendMessage(tab.id, {
      action: newState ? "enableAllFilters" : "disableAllFilters"
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn("필터 메시지 전송 실패:", chrome.runtime.lastError.message);
      }
    });
  });
});

// 새로고침/탭 전환 시 아이콘 상태 동기화
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["filterEnabled"], (result) => {
      const isEnabled = result.filterEnabled ?? false;
      chrome.action.setIcon({
        tabId,
        path: {
          "128": isEnabled ? "icons/icon128_on.png" : "icons/icon128_off.png"
        }
      });
    });
  }
});