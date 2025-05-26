// 확장 프로그램 설치 시 context menu 등록
chrome.runtime.onInstalled.addListener(() => {
  // 기존 메뉴 제거 후 재생성 (중복 방지)
  chrome.contextMenus.removeAll(() => {
    // 이미지 숨기기
    chrome.contextMenus.create({
      id: "hideImages",
      title: "이미지 숨기기",
      contexts: ["all"]
    });

    // 이미지 블러 처리
    chrome.contextMenus.create({
      id: "blurImages",
      title: "이미지 블러 처리",
      contexts: ["all"]
    });

    // 이미지 크기 축소
    chrome.contextMenus.create({
      id: "resizeImages",
      title: "이미지 크기 축소",
      contexts: ["all"]
    });
  });
});

// context menu 항목 클릭 시 content.js로 메시지 전송
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab.id) return;

  // 현재 선택된 옵션 저장
  chrome.storage.local.set({ lastFilterAction: info.menuItemId });

  // content.js에 메시지 전송
  chrome.tabs.sendMessage(tab.id, {
    action: info.menuItemId
  });
});